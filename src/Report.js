import { Divider, Table, TableBody, TableCell, TableRow } from '@mui/material';
import clone from 'clone';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import { Fragment, memo } from 'react';
import {
  createAmortizationChartOptions,
  createBalanceChartOptions,
  createCashEquityChartOptions,
  createInterestChartOptions,
  createNetWorthChartOptions,
  setCommonOptions,
} from './ChartOptions';
import IRSFilingStatus from './enum/IRSFilingStatus';
import MortgageTerm from './enum/MortgageTerm';
import MortgageType from './enum/MortgageType';

const monthsPerYear = 12;

const locale = 'en-US';

/**
 * Convert annual rate to monthly rate (with monthly compounding).
 */
const calcMonthlyRoi = n => (1 + n) ** (1 / monthsPerYear) - 1;

/** Round to n decimal places */
const roundTo = (n, num) => +`${Math.round(+`${num}e+${n}`)}e-${n}`;
const roundToTwo = num => roundTo(2, num);
const displayInterestRate = pct => roundTo(3, pct * 100);

/**
 * Calculate monthly loan payment amount
 * @param {number} p Remaining principal for the loan.
 * @param {number} i Monthly interest rate.
 * @param {number} t Remaining months for the loan. (term)
 */
const calcMonthlyPayment = (p, i, t) => {
  const x = (1 + i) ** t;
  return roundToTwo((p * (i * x)) / (x - 1));
};

const transformState = reportState => {
  const state = clone(reportState);
  state.roi /= 100;
  state.monthlyRoi = calcMonthlyRoi(state.roi);
  state.marginalTaxRate /= 100;
  state.otherItemizedDeductions = +state.otherItemizedDeductions;
  state.newAcquisitionDebt = +state.newAcquisitionDebt;
  for (const m of state.mortgages) {
    m.name = `Mortgage ${m.id}`;
    m.interestRate /= 100;
    m.loanAmount = +m.loanAmount;
    m.termMonths = MortgageTerm.props[m.term].months;
    m.endDate = m.startDate.clone().add(m.termMonths - 1, 'months');
    if (m.type !== MortgageType.FixedRate) {
      const years = MortgageType.props[m.type].yearsFixed;
      const intRate = m.interestRateAdjusted / 100;
      m.rateAdjust = {
        interestRate: intRate,
        monthlyInterestRate: intRate / monthsPerYear,
        adjustDate: m.startDate.clone().add(years, 'years'),
      };
    }
    m.monthlyInterestRate = m.interestRate / monthsPerYear;
    m.monthlyPayment = calcMonthlyPayment(
      m.loanAmount,
      m.monthlyInterestRate,
      m.termMonths
    );
    m.payments = [];
    m.netWorth = [];
    m.closingCosts = +m.closingCosts;
    delete m.interestRateAdjusted;
  }
  return state;
};

/**
 * Builds amortization schedule for a mortgages, with each payment's principal
 * and interest portions.
 */
const createAmortizationSchedules = mortgages => {
  for (const m of mortgages) {
    let b = m.loanAmount;
    let intRate = m.monthlyInterestRate;
    const date = m.startDate.clone();
    let { monthlyPayment } = m;
    while (b > 0) {
      const int = roundToTwo(b * intRate);
      let prin;
      // on the very last payment, pay off remaining balance due to rounding over time
      if (date.isSame(m.endDate)) {
        prin = b;
      } else {
        prin = roundToTwo(monthlyPayment - int);
      }
      const bStart = roundToTwo(b);
      const bEnd = roundToTwo(bStart - prin);
      b = bEnd;
      const payment = {
        principal: prin,
        interest: int,
        date: date.clone(),
        unixTimeMs: date.valueOf(),
        startingBalance: bStart,
        remainingBalance: bEnd,
      };
      m.payments.push(payment);
      date.add(1, 'month');
      if (m.rateAdjust && date.isSame(m.rateAdjust.adjustDate)) {
        intRate = m.rateAdjust.monthlyInterestRate;
        const t =
          m.termMonths - m.rateAdjust.adjustDate.diff(m.startDate, 'months');
        monthlyPayment = calcMonthlyPayment(b, intRate, t);
        m.rateAdjust.monthlyPayment = monthlyPayment;
      }
    }
  }
};

/**
 * Extrapolate past and future standard deductions as needed.
 */
const extendStandardDeductions = (m1, m2, irsFilingStatus) => {
  const percentChange = 3.25 / 100;
  let startYear;
  let endYear;

  if (m1.startDate.isBefore(m2.startDate)) {
    startYear = m1.startDate.year();
  } else {
    startYear = m2.startDate.year();
  }
  if (m1.endDate.isAfter(m2.endDate)) {
    endYear = m1.endDate.year();
  } else {
    endYear = m2.endDate.year();
  }
  const stdDev = IRSFilingStatus.props[irsFilingStatus].standardDeduction;
  const keys = Object.keys(stdDev);
  const first = +keys[0];
  const last = +keys.pop();
  for (let i = first - 1; i >= startYear; i--) {
    stdDev[i] = roundToTwo(stdDev[i + 1] / (1 + percentChange));
  }
  for (let i = last + 1; i <= endYear; i++) {
    stdDev[i] = stdDev[i - 1];
  }
};

/**
 * Caps home acquisition debt to a maximum amount which depends the mortgage's
 * start date and the IRS filing status.
 */
const capHomeAcquisitionDebt = (amount, startDate, irsFilingStatus) => {
  const tcjaBreakpoint = moment('2018-02-15', 'YYYY-MM-DD');
  let homeAcquisitionDebt;
  if (startDate.isAfter(tcjaBreakpoint)) {
    if (irsFilingStatus === IRSFilingStatus.MarriedFilingSeparately) {
      homeAcquisitionDebt = Math.min(375000, amount);
    } else {
      homeAcquisitionDebt = Math.min(750000, amount);
    }
  } else {
    if (irsFilingStatus === IRSFilingStatus.MarriedFilingSeparately) {
      homeAcquisitionDebt = Math.min(500000, amount);
    } else {
      homeAcquisitionDebt = Math.min(1000000, amount);
    }
  }
  return homeAcquisitionDebt;
};

/**
 * Assuming m1 and m2 will overlap payment dates, find the first m1 index where
 * they share the same date. Also, assume m1.startDate <= m2.startDate.
 */
const findFirstSharedPaymentDateIndex = (m1, m2) => {
  let m1n = 0;
  while (m1.payments[m1n] && !m1.payments[m1n].date.isSame(m2.startDate)) {
    m1n++;
    if (m1n === 1000)
      throw new Error(
        `Couldn't find intersecting payment dates between the two mortgages.`
      );
  }
  return m1n;
};

/**
 * Calculate pro-rated interest for old lender, as well as prepaid per-diem
 * interest for the new lender.
 */
const calcProRatedInterestForRefi = (m1, m2, firstSharedM1Index) => {
  const priorMonthNdx = firstSharedM1Index - 1;
  const priorMonthPayment = m1.payments[priorMonthNdx];
  const refiClosingDate = priorMonthPayment.date.clone().date(15); // arbirarily chosen
  const refiClosingDay = refiClosingDate.date();
  const daysInMonth = refiClosingDate.daysInMonth();
  m1.proRatedInterest =
    priorMonthPayment.interest * ((refiClosingDay - 1) / daysInMonth);
  m2.proRatedInterest =
    m2.payments[0].interest *
    ((daysInMonth - refiClosingDay + 1) / daysInMonth);
};

/**
 * Determine starting values for cash, equity, and home acquisition debt.
 */
const calcInitialCashEquityAndDebt = (
  { isRefinance, newAcquisitionDebt, irsFilingStatus },
  m1,
  m2,
  firstSharedM1Index
) => {
  m1.initEquity = 0;

  if (isRefinance) {
    const priorMonthStartingBalance =
      m1.payments[firstSharedM1Index - 1].startingBalance;
    m1.initCash = 0;
    m2.initCash = roundToTwo(
      m2.loanAmount -
        priorMonthStartingBalance -
        m2.closingCosts -
        m1.proRatedInterest -
        m2.proRatedInterest
    );
    m2.initEquity = -roundToTwo(m2.loanAmount - priorMonthStartingBalance);
    m2.homeAcquisitionDebt =
      Math.min(priorMonthStartingBalance, m2.loanAmount) + newAcquisitionDebt;
  } else {
    m1.initCash = -m1.closingCosts;
    m2.initCash = -m2.closingCosts;
    m2.initEquity = 0;
    m2.homeAcquisitionDebt = m2.loanAmount;
  }

  m1.homeAcquisitionDebt = capHomeAcquisitionDebt(
    m1.loanAmount,
    m1.startDate,
    irsFilingStatus
  );
  m2.homeAcquisitionDebt = capHomeAcquisitionDebt(
    m2.homeAcquisitionDebt,
    m1.startDate, // using m1's startDate instead of m2 on purpose!
    irsFilingStatus
  );
};

/**
 * Inserts an additional data point before first payment date.
 */
const insertInitialPointBeforeStartDates = (m1, m2, netWorthDifferences) => {
  const m1NetWorth = m1.initCash + m1.initEquity;
  const m2NetWorth = m2.initCash + m2.initEquity;
  const unixTimeMs = m2.payments[0].date.clone().subtract(1, 'month').valueOf();
  m1.netWorth.push({
    unixTimeMs,
    cash: m1.initCash,
    equity: m1.initEquity,
    netWorth: m1NetWorth,
  });
  m2.netWorth.push({
    unixTimeMs,
    cash: m2.initCash,
    equity: m2.initEquity,
    netWorth: m2NetWorth,
  });
  netWorthDifferences.push({
    unixTimeMs,
    difference: m2NetWorth - m1NetWorth,
  });
};

/**
 * Creates data for comparing cash, equity, and net worth comparisons of the two
 * mortgages over their life time.
 */
const compareMortgages = (
  { doItemize, monthlyRoi },
  m1,
  m2,
  firstSharedM1Index
) => {
  let m1n = firstSharedM1Index;

  const netWorthDifferences = [];

  insertInitialPointBeforeStartDates(
    m1,
    m2,

    netWorthDifferences
  );

  let m1Cash = m1.initCash;
  let m2Cash = m2.initCash;
  let m1Equity = m1.initEquity;
  let m2Equity = m2.initEquity;
  let m1PrevCash = m1Cash;
  let m2PrevCash = m2Cash;
  let m1Payment = m1.monthlyPayment;
  let m2Payment = m2.monthlyPayment;
  const m1PayLen = m1.payments.length;
  const m2PayLen = m2.payments.length;
  let m2n = 0;

  while (m1n < m1PayLen || m2n < m2PayLen) {
    const eitherPayment = m1n < m1PayLen ? m1.payments[m1n] : m2.payments[m2n];
    const { date } = eitherPayment;
    const { unixTimeMs } = eitherPayment;
    let m1NetWorth;
    let m2NetWorth;

    if (m1n < m1PayLen) {
      if (m1.rateAdjust && date.isSame(m1.rateAdjust.adjustDate))
        m1Payment = m1.rateAdjust.monthlyPayment;
      const accruedInt = m1PrevCash === undefined ? 0 : m1PrevCash * monthlyRoi;
      m1Cash = m1Cash - m1Payment + accruedInt;
      if (doItemize) {
        m1Cash += m1.payments[m1n].itemizedInterestCashDiff;
      }
      m1Equity += m1.payments[m1n].principal;
      m1NetWorth = roundToTwo(m1Cash + m1Equity);
      m1.netWorth.push({
        unixTimeMs,
        cash: m1Cash,
        equity: m1Equity,
        netWorth: m1NetWorth,
      });
      m1PrevCash = m1Cash;
      m1n++;
    }

    if (m2n < m2PayLen) {
      if (m2.rateAdjust && date.isSame(m2.rateAdjust.adjustDate))
        m2Payment = m2.rateAdjust.monthlyPayment;
      const accruedInt = m2PrevCash === undefined ? 0 : m2PrevCash * monthlyRoi;
      m2Cash = m2Cash - m2Payment + accruedInt;
      if (doItemize) {
        m2Cash += m2.payments[m2n].itemizedInterestCashDiff;
      }
      m2Equity += m2.payments[m2n].principal;
      m2NetWorth = m2Cash + m2Equity;
      m2.netWorth.push({
        unixTimeMs,
        cash: m2Cash,
        equity: m2Equity,
        netWorth: m2NetWorth,
      });
      m2PrevCash = m2Cash;
      m2n++;
    }

    if (m1NetWorth !== null && m2NetWorth !== null) {
      netWorthDifferences.push({
        unixTimeMs,
        difference: m2NetWorth - m1NetWorth,
      });
    }
  }

  return netWorthDifferences;
};

const calcMortgageInterestByYear = (
  m1,
  m2,
  isRefinance,
  firstSharedM1Index
) => {
  for (const m of [m1, m2]) {
    m.interestByYear = [];
    let interest = 0;
    let prevYear;
    for (const p of m.payments) {
      const newYear = p.date.year();
      if (prevYear && prevYear !== newYear) {
        m.interestByYear.push({
          year: prevYear,
          interest: roundToTwo(interest),
          preRefiInterest: 0,
        });
        interest = 0;
      }
      interest += p.interest;
      prevYear = newYear;
    }
  }

  // for refi's, determine partial year interest from m1 so that it can
  // be used for itemizing interest
  if (isRefinance) {
    let m1n = firstSharedM1Index;
    const refiYear = m1.payments[m1n].date.year();
    let preRefiInterest = 0;
    for (m1n -= 2; m1.payments[m1n].date.year() === refiYear; m1n--) {
      preRefiInterest += m1.payments[m1n].interest;
    }
    m2.interestByYear[0].preRefiInterest =
      m1.proRatedInterest + preRefiInterest;
    m2.interestByYear[0].interest += m2.proRatedInterest;
  }
};

const calcItemizedMortgageInterest = ({
  mortgages,
  deductionFrequency,
  irsFilingStatus,
  otherItemizedDeductions,
  marginalTaxRate,
}) => {
  const standarddDeductionData =
    IRSFilingStatus.props[irsFilingStatus].standardDeduction;

  for (const m of mortgages) {
    for (const p of m.payments) {
      const standardDeduction = standarddDeductionData[p.date.year()];
      const ratio =
        m.homeAcquisitionDebt < p.startingBalance
          ? m.homeAcquisitionDebt / p.startingBalance
          : 1;
      p.itemizedInterest = roundToTwo(p.interest * marginalTaxRate * ratio);
      p.itemizedInterestRatio = ratio;
      p.itemizedInterestCashDiff = roundToTwo(
        Math.max(
          p.itemizedInterest -
            Math.max(standardDeduction - otherItemizedDeductions, 0) / 12,
          0
        )
      );
    }
  }
};

function Report({ reportState }) {
  const state = transformState(reportState);
  const [m1, m2] = [state.mortgages[0], state.mortgages[1]];
  extendStandardDeductions(m1, m2, state.irsFilingStatus);
  createAmortizationSchedules(state.mortgages);
  const firstSharedM1Index = findFirstSharedPaymentDateIndex(m1, m2);
  calcMortgageInterestByYear(m1, m2, state.isRefinance, firstSharedM1Index);
  console.log(state);
  if (state.isRefinance)
    calcProRatedInterestForRefi(m1, m2, firstSharedM1Index);
  calcInitialCashEquityAndDebt(state, m1, m2, firstSharedM1Index);
  if (state.doItemize) calcItemizedMortgageInterest(state);
  const comparison = compareMortgages(state, m1, m2, firstSharedM1Index);
  setCommonOptions(state.mortgages);

  const tableCellStyle = {
    border: 0,
    fontSize: 'initial',
    padding: 1,
  };

  return (
    <>
      <Divider variant="middle" />
      <br />
      <br />
      <Table sx={{ width: 'fit-content', margin: 'auto !important' }}>
        {state.mortgages.map(m => (
          <Fragment key={m.id}>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{
                    ...tableCellStyle,
                    verticalAlign: 'top',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Mortgage {m.id}:
                </TableCell>
                <TableCell sx={tableCellStyle}>
                  ${m.loanAmount.toLocaleString(locale)} at{' '}
                  {displayInterestRate(m.interestRate)}% for
                  {m.type === MortgageType.FixedRate
                    ? ` ${MortgageTerm.props[m.term].name}.`
                    : ` the first ${m.rateAdjust.adjustDate.diff(
                        m.startDate,
                        'years'
                      )} years, then ${displayInterestRate(
                        m.rateAdjust.interestRate
                      )}% for the remaining duration of the loan.`}
                  <br />
                  Monthly payment
                  {m.type === MortgageType.FixedRate
                    ? ` is $${m.monthlyPayment.toLocaleString(locale)}.`
                    : ` starts at $${m.monthlyPayment.toLocaleString(
                        locale
                      )}, and then changes to $${m.rateAdjust.monthlyPayment.toLocaleString(
                        locale
                      )} on ${m.rateAdjust.adjustDate.format('MM-DD-YYYY')}.`}
                  <br />
                </TableCell>
              </TableRow>
            </TableBody>
          </Fragment>
        ))}
      </Table>
      <br />
      The difference in net worths is the bottom-line takeaway for this tool.
      Note that you can zoom in on graphs by clicking and dragging. You also can
      show/hide lines by clicking on their legend entries.
      <br />
      <br />
      <HighchartsReact
        highcharts={Highcharts}
        options={createNetWorthChartOptions(comparison, state.mortgages)}
      />
      <p>
        The Net Worth graph shows how Mortgage 1 and Mortgage 2 compare in value
        over time. Net Worth is defined here as Cash plus Equity. See below. The
        Difference graph line values are simply &quot;Mortgage 2 Net Worth&quot;
        minus &quot;Mortgage 1 Net Worth.&quot;
      </p>
      <br />
      <HighchartsReact
        highcharts={Highcharts}
        options={createCashEquityChartOptions(state.mortgages)}
      />
      <p>
        For each monthly mortgage payment made, Cash goes down by that amount.
        Equity goes up by the principal portion of the payment. Cash has
        additional value over time, as it can be invested. To account for the
        time value of money, each month Cash is multiplied by a monthly ROI
        value (which is derived from the yearly ROI value supplied above). If
        Cash is positive, then this value is added to Cash. If Cash is negative,
        then this value is an opportunity cost that gets subtracted from Cash.
        <br />
        <br />
        If this scenario is a refinance, then the starting cash starts off
        increased by the cash-out amount and equity starts off decreased by the
        cash-out amount.
        <br />
      </p>
      <br />
      <HighchartsReact
        highcharts={Highcharts}
        options={createInterestChartOptions(state.mortgages)}
      />
      <p>
        This graph shows the total mortgage interest paid in each calendar year.
      </p>
      <br />
      <HighchartsReact
        highcharts={Highcharts}
        options={createBalanceChartOptions(state.mortgages)}
      />
      <p>
        This graph shows the outstanding mortgage balances decreasing over time.
      </p>
      {state.mortgages.map(m => (
        <Fragment key={m.id}>
          <br />
          <HighchartsReact
            highcharts={Highcharts}
            options={createAmortizationChartOptions(m)}
          />
          <p>Amortization schedule for Mortgage {m.id}.</p>
        </Fragment>
      ))}
    </>
  );
}

export default memo(Report);
