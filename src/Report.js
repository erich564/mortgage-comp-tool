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
  createComparisonChartOptions,
  createInterestChartOptions,
  setCommonOptions,
} from './ChartOptions';
import IRSFilingStatus from './enum/IRSFilingStatus';
import MortgageTerm from './enum/MortgageTerm';
import MortgageType from './enum/MortgageType';

const monthsPerYear = 12;
// TCJA = Tax Cuts & Jobs Act of 2017
const tcjaBreakpoint = moment('2018-02-15', 'YYYY-MM-DD');

/**
 * Convert annual rate to monthly rate (with monthly compounding).
 */
const calcMonthlyRoi = n => (1 + n) ** (1 / monthsPerYear) - 1;

/** Round to n decimal places */
const roundTo = (n, num) => +`${Math.round(+`${num}e+${n}`)}e-${n}`;
const roundToTwo = num => roundTo(2, num);

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

const calcPerformanceRanges = netWorthDifferences => {
  const ranges = [];
  let isPositiveNow;
  let prevIsPositive;
  const firstDate = netWorthDifferences[0].date;
  const lastDate = netWorthDifferences[netWorthDifferences.length - 1].date;
  let prevDate = firstDate;
  const pushResult = (startDate, endDate, isPositive) => {
    ranges.push({
      startDate,
      endDate,
      isPositive,
    });
    prevDate = endDate;
  };
  for (const nwd of netWorthDifferences) {
    isPositiveNow = nwd.difference > 0;
    const isZeroNow = nwd.difference === 0;
    if (isPositiveNow !== prevIsPositive && prevIsPositive !== undefined) {
      pushResult(prevDate, nwd.date, prevIsPositive);
    }
    prevIsPositive = isZeroNow ? undefined : isPositiveNow;
  }
  pushResult(prevDate, lastDate, prevIsPositive);
  return ranges;
};

const transformState = reportState => {
  const data = clone(reportState);
  data.roi /= 100;
  data.monthlyRoi = calcMonthlyRoi(data.roi);
  data.marginalTaxRate /= 100;
  data.otherItemizedDeductions = +data.otherItemizedDeductions;
  data.m1HomeAcquisitionDebt = +data.m1HomeAcquisitionDebt;
  data.refiNewAcquisitionDebt = +data.refiNewAcquisitionDebt;
  for (const m of data.mortgages) {
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
    m.closingCosts = +m.closingCosts;
    delete m.interestRateAdjusted;
  }

  return data;
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
    m.payments = [];
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
const extendStandardDeductions = ({ m1, m2, irsFilingStatus }) => {
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
const findFirstSharedPaymentDateIndex = ({ m1, m2 }) => {
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
const calcProRatedInterestForRefi = ({ m1, m2, firstSharedM1Index }) => {
  const priorMonthNdx = firstSharedM1Index - 1;
  const priorMonthPayment = m1.payments[priorMonthNdx];
  const refiClosingDate = priorMonthPayment.date.clone().date(15); // arbirarily chosen
  const refiClosingDay = refiClosingDate.date();
  const daysInMonth = refiClosingDate.daysInMonth();
  m1.proRatedInterest = roundToTwo(
    priorMonthPayment.interest * ((refiClosingDay - 1) / daysInMonth)
  );
  m2.proRatedInterest = roundToTwo(
    m2.payments[0].interest * ((daysInMonth - refiClosingDay + 1) / daysInMonth)
  );
};

/**
 * Determine starting values for cash, equity, and home acquisition debt.
 */
const calcInitialCashEquityAndDebt = ({
  isRefinance,
  refiNewAcquisitionDebt,
  irsFilingStatus,
  m1,
  m2,
  firstSharedM1Index,
  m1HomeAcquisitionDebt,
}) => {
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
    if (m1.startDate.isAfter(tcjaBreakpoint) && m1HomeAcquisitionDebt !== 0) {
      m1.homeAcquisitionDebt = Math.min(m1HomeAcquisitionDebt, m1.loanAmount);
    } else {
      m1.homeAcquisitionDebt = m1.loanAmount;
    }
    let debt = m2.loanAmount;
    if (m2.startDate.isAfter(tcjaBreakpoint))
      debt =
        Math.min(m1.homeAcquisitionDebt, priorMonthStartingBalance, debt) +
        refiNewAcquisitionDebt;
    m2.homeAcquisitionDebt = Math.min(roundToTwo(debt), m2.loanAmount);
  } else {
    m1.initCash = -m1.closingCosts;
    m2.initCash = -m2.closingCosts;
    m2.initEquity = 0;
    m2.homeAcquisitionDebt = m2.loanAmount;
  }

  m1.homeAcquisitionDebt = capHomeAcquisitionDebt(
    m1.homeAcquisitionDebt,
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
const insertInitialPointBeforeStartDates = (m1, m2) => {
  const m1NetWorth = m1.initCash + m1.initEquity;
  const m2NetWorth = m2.initCash + m2.initEquity;
  const date = m2.payments[0].date.clone().subtract(1, 'month');
  const unixTimeMs = date.valueOf();
  m1.netWorth = [];
  m2.netWorth = [];
  m1.netWorth.push({
    date,
    unixTimeMs,
    cash: m1.initCash,
    equity: m1.initEquity,
    netWorth: m1NetWorth,
  });
  m2.netWorth.push({
    date,
    unixTimeMs,
    cash: m2.initCash,
    equity: m2.initEquity,
    netWorth: m2NetWorth,
  });
};

/**
 * Determine how much to offset monthly cash due to the benefits of
 * itemizing mortgage interest.
 */
const calcMonthlyNetGainFromItemizedInterest = (payment, interestByYear) => {
  const year = payment.date.year();
  const { itemizationNetGain } = interestByYear.find(x => x.year === year);
  const monthlyItemizationNetGain = roundToTwo(
    itemizationNetGain / monthsPerYear
  );
  return monthlyItemizationNetGain;
};

/**
 * Creates data for comparing cash, equity, and net worth comparisons of the two
 * mortgages over their life time.
 */
const compareMortgages = ({
  m1,
  m2,
  doItemize,
  monthlyRoi,
  firstSharedM1Index,
}) => {
  insertInitialPointBeforeStartDates(m1, m2);

  const calcNetWorthData = (m, initNdx) => {
    let { monthlyPayment } = m;
    let cash = m.initCash;
    let prevCash = m.initCash;
    let equity = m.initEquity;
    for (let i = initNdx; i < m.payments.length; i++) {
      const payment = m.payments[i];
      if (m.rateAdjust && payment.date.isSame(m.rateAdjust.adjustDate))
        monthlyPayment = m.rateAdjust.monthlyPayment;
      const accruedInt = prevCash * monthlyRoi;
      cash = cash - monthlyPayment + accruedInt;
      if (doItemize) {
        cash += calcMonthlyNetGainFromItemizedInterest(
          payment,
          m.interestByYear
        );
      }
      equity += payment.principal;
      const netWorth = roundToTwo(cash + equity);
      cash = roundToTwo(cash);
      m.netWorth.push({
        date: payment.date,
        unixTimeMs: payment.unixTimeMs,
        cash,
        equity,
        netWorth,
      });
      prevCash = cash;
    }
  };

  calcNetWorthData(m1, firstSharedM1Index);
  calcNetWorthData(m2, 0);

  const netWorthDifferences = [];
  for (let i = 0; i < Math.min(m1.netWorth.length, m2.netWorth.length); i++) {
    netWorthDifferences.push({
      date: m1.netWorth[i].date,
      unixTimeMs: m1.netWorth[i].unixTimeMs,
      difference: m2.netWorth[i].netWorth - m1.netWorth[i].netWorth,
    });
  }

  return netWorthDifferences;
};

/**
 * Calculate mortgage interest for each year, including pro-rated interest
 * in the case of refinances. Also calculate itemized interest and net
 * benefit of it.
 */
const calcMortgageInterestByYear = ({
  m1,
  m2,
  isRefinance,
  doItemize,
  firstSharedM1Index,
  irsFilingStatus,
  otherItemizedDeductions,
  marginalTaxRate,
}) => {
  const pushResult = (m, year, interest, itemizableInterest) => {
    m.interestByYear.push({
      year,
      interest: roundToTwo(interest),
      itemizableInterest: roundToTwo(itemizableInterest),
    });
  };
  const calcRatio = (homeAcquisitionDebt, startingBalance) =>
    homeAcquisitionDebt < startingBalance
      ? homeAcquisitionDebt / startingBalance
      : 1;

  for (const m of [m1, m2]) {
    m.interestByYear = [];
    let interest = 0;
    let itemizableInterest = 0;
    let prevYear;
    for (const p of m.payments) {
      const year = p.date.year();
      if (prevYear && prevYear !== year) {
        pushResult(m, prevYear, interest, itemizableInterest);
        interest = 0;
        itemizableInterest = 0;
      }
      interest += p.interest;
      const ratio = calcRatio(m.homeAcquisitionDebt, p.startingBalance);
      p.itemizableInterest = roundToTwo(p.interest * ratio);
      itemizableInterest += p.itemizableInterest;
      prevYear = year;
    }
    pushResult(m, prevYear, interest, itemizableInterest);
  }

  // for refi's, determine partial year interest from m1. also,
  // add pro-rated interest for old and new lender to total yearly interest
  // totals
  if (isRefinance) {
    let m1n = firstSharedM1Index;
    const refiYear = m1.payments[m1n].date.year();
    let m1Interest = 0;
    let m1ItemizableInterest = 0;
    for (m1n -= 2; m1.payments[m1n].date.year() === refiYear; m1n--) {
      m1Interest += m1.payments[m1n].interest;
      m1ItemizableInterest += m1.payments[m1n].itemizableInterest;
    }
    const refiM1Ratio = calcRatio(m1.homeAcquisitionDebt, m2.loanAmount);
    m2.interestByYear[0].m1Interest = roundToTwo(
      m1Interest + m1.proRatedInterest
    );
    m2.interestByYear[0].m1ItemizableInterest =
      m1ItemizableInterest + m1.proRatedInterest * refiM1Ratio;
    const refiM2Ratio = calcRatio(m2.homeAcquisitionDebt, m2.loanAmount);
    m2.interestByYear[0].interest = roundToTwo(
      m2.interestByYear[0].interest + m2.proRatedInterest
    );
    m2.interestByYear[0].itemizableInterest = roundToTwo(
      m2.interestByYear[0].itemizableInterest +
        m1.proRatedInterest * refiM1Ratio +
        m2.proRatedInterest * refiM2Ratio
    );
  }

  // determine the net benefit of mortgage interest itemization for
  // each year, taking into account other deductions
  if (doItemize) {
    const standarddDeductionData =
      IRSFilingStatus.props[irsFilingStatus].standardDeduction;
    for (const m of [m1, m2]) {
      for (const i of m.interestByYear) {
        const standardDeduction = standarddDeductionData[i.year];
        i.itemizationNetGain = roundToTwo(
          marginalTaxRate *
            Math.max(
              i.itemizableInterest -
                Math.max(standardDeduction - otherItemizedDeductions, 0),
              0
            )
        );
      }
    }
  }
};

function Report({ reportState }) {
  const data = transformState(reportState);
  [data.m1, data.m2] = data.mortgages;
  extendStandardDeductions(data);
  createAmortizationSchedules(data.mortgages);
  data.firstSharedM1Index = findFirstSharedPaymentDateIndex(data);
  if (data.isRefinance) calcProRatedInterestForRefi(data);
  calcInitialCashEquityAndDebt(data);
  calcMortgageInterestByYear(data);
  data.netWorthDifferences = compareMortgages(data);

  setCommonOptions(data);
  data.performanceRanges = calcPerformanceRanges(data.netWorthDifferences);

  const tableCellStyle = {
    border: 0,
    fontSize: 'initial',
    padding: 0,
  };

  return (
    <>
      <Divider variant="middle" />
      <br />
      <br />
      <Table sx={{ width: 'fit-content', margin: 'auto !important' }}>
        <TableBody>
          <TableRow>
            <TableCell
              sx={{
                ...tableCellStyle,
                verticalAlign: 'top',
                whiteSpace: 'nowrap',
              }}
            >
              Scenario 1:
            </TableCell>
            <TableCell sx={tableCellStyle}>
              &nbsp;
              {data.isRefinance
                ? `You keep Mortgage 1 instead of refinancing.`
                : `You purchase a home with Mortgage 1.`}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              sx={{
                ...tableCellStyle,
                verticalAlign: 'top',
                whiteSpace: 'nowrap',
              }}
            >
              Scenario 2:
            </TableCell>
            <TableCell sx={tableCellStyle}>
              &nbsp;
              {data.isRefinance
                ? `You refinance Mortgage 1 with Mortgage 2.`
                : `You purchase a home with Mortgage 2.`}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <br />
      The comparison graph below shows the following:
      <br />
      <br />
      {data.performanceRanges.map((range, n) => (
        <Fragment key={n}>
          From {range.startDate.format('MM-YYYY')} to{' '}
          {range.endDate.format('MM-YYYY')}, Scenario {range.isPositive ? 2 : 1}{' '}
          outperforms Scenario {range.isPositive ? 1 : 2}.
          <br />
        </Fragment>
      ))}
      <br />
      <HighchartsReact
        highcharts={Highcharts}
        options={createComparisonChartOptions(data.netWorthDifferences)}
      />
      <p>
        The Comparison graph shows how Scenario 1 and Scenario 2 compare in
        value over time in terms of Net Worth. Net Worth is defined here as Cash
        plus Equity -- see below. The graph line values above are &quot;Scenario
        2 Net Worth&quot; minus &quot;Scenario 1 Net Worth.&quot; So, if a
        point&apos;s value is greater than $0, then Scenario 2 is outperforming
        Scenario 1 at that time (taking into account past performance).
        <br />
        <br />
        Note that you can zoom in on graphs by clicking and dragging. You also
        can show/hide lines by clicking on their legend entries.
      </p>
      <br />
      <HighchartsReact
        highcharts={Highcharts}
        options={createCashEquityChartOptions(data.mortgages)}
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
        options={createInterestChartOptions(data.mortgages)}
      />
      <p>
        This graph shows the total mortgage interest paid in each calendar year.
      </p>
      <br />
      <HighchartsReact
        highcharts={Highcharts}
        options={createBalanceChartOptions(data.mortgages)}
      />
      <p>
        This graph shows the outstanding mortgage balances decreasing over time.
      </p>
      {data.mortgages.map(m => (
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
