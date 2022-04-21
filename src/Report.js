import { Divider } from '@mui/material';
import clone from 'clone';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { memo } from 'react';
import {
  createAmortizationChartOptions,
  createCashEquityChartOptions,
  createNetWorthChartOptions,
  createPaymentsChartOptions,
  setCommonOptions,
} from './ChartOptions';
import MortgageTerm from './MortgageTerm';
import MortgageType from './MortgageType';

const monthsPerYear = 12;

/**
 * Convert annual rate to monthly rate (with monthly compounding).
 */
const calcMonthlyRoi = n => (1 + n) ** (1 / monthsPerYear) - 1;

/** Round to 2 decimal places */
// eslint-disable-next-line prefer-template
const roundToTwo = num => +(Math.round(+`${num}e+2`) + 'e-2');

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
  for (const m of state.mortgages) {
    m.name = `Mortgage ${m.id}`;
    m.interestRate /= 100;
    m.loanAmount = +m.loanAmount;
    m.term = MortgageTerm.props[m.term].months;
    m.endDate = m.startDate.clone().add(m.term - 1, 'months');
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
      m.term
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
    let prevPayment;
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
      const cumPrin = roundToTwo(
        prin + (prevPayment ? prevPayment.cumPrincipal : 0)
      );
      const cumInt = roundToTwo(
        int + (prevPayment ? prevPayment.cumInterest : 0)
      );
      const cumPayments = roundToTwo(cumPrin + cumInt);
      const payment = {
        principal: prin,
        interest: int,
        date: date.clone(),
        unixTimeMs: date.valueOf(),
        startingBalance: bStart,
        remainingBalance: bEnd,
        cumPrincipal: cumPrin,
        cumInterest: cumInt,
        cumPayments,
      };
      m.payments.push(payment);
      date.add(1, 'month');
      prevPayment = payment;
      if (m.rateAdjust && date.isSame(m.rateAdjust.adjustDate)) {
        intRate = m.rateAdjust.monthlyInterestRate;
        const t = m.term - m.rateAdjust.adjustDate.diff(m.startDate, 'months');
        monthlyPayment = calcMonthlyPayment(b, intRate, t);
        m.rateAdjust.monthlyPayment = monthlyPayment;
      }
    }
  }
};

/**
 * Creates data for comparing cash, equity, and net worth comparisons of the two
 * mortgages over their life time.
 */
const compareMortgages = ({
  mortgages,
  isRefinance,
  doItemize,
  marginalTaxRate,
  monthlyRoi,
}) => {
  let m1 = mortgages[0];
  let m2 = mortgages[1];
  const isM2StartDateBeforeM1 = m2.startDate.isBefore(m1.startDate);
  if (isM2StartDateBeforeM1) {
    [m1, m2] = [m2, m1];
  }
  let m1n = 0;
  let m2n = 0;
  const m1PayLen = m1.payments.length;
  const m2PayLen = m2.payments.length;

  // fast-forward m1 payment schedule to first payment date of m2
  while (m1.payments[m1n] && !m1.payments[m1n].date.isSame(m2.startDate)) m1n++;

  let m1Cash;
  let m2Cash;
  let m1Equity = 0;
  let m2Equity;

  if (isRefinance) {
    m1Cash = 0;
    m2Cash = roundToTwo(
      m2.loanAmount - m1.payments[m1n].startingBalance - m2.closingCosts
    );
    m2Equity = -m2Cash;
  } else {
    m1Cash = -m1.closingCosts;
    m2Cash = -m2.closingCosts;
    m2Equity = 0;
  }

  let m1PrevCash = m1Cash;
  let m2PrevCash = m2Cash;
  const netWorthDifferences = [];
  let m1Payment = m1.monthlyPayment;
  let m2Payment = m2.monthlyPayment;

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
        m1Cash += m1.payments[m1n].interest * marginalTaxRate;
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
        m2Cash += m2.payments[m2n].interest * marginalTaxRate;
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

    if (m1NetWorth && m2NetWorth) {
      netWorthDifferences.push({
        unixTimeMs,
        difference: m2NetWorth - m1NetWorth,
      });
    }
  }

  return netWorthDifferences;
};

function Report({ reportState }) {
  const state = transformState(reportState);
  createAmortizationSchedules(state.mortgages);
  const comparison = compareMortgages(state);
  setCommonOptions(state.mortgages);

  return (
    <>
      <Divider variant="middle" />
      <br />
      <HighchartsReact
        highcharts={Highcharts}
        options={createNetWorthChartOptions(comparison, state.mortgages)}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={createCashEquityChartOptions(state.mortgages)}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={createPaymentsChartOptions(state.mortgages)}
      />
      {state.mortgages.map(m => (
        <HighchartsReact
          key={m.id}
          highcharts={Highcharts}
          options={createAmortizationChartOptions(m)}
        />
      ))}
    </>
  );
}

export default memo(Report);
