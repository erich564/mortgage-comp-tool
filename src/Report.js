import Container from '@mui/material/Container';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment'

/**
 * @typedef {import('moment').Moment} Moment
 */

 
/**
 * Convert annual rate to monthly rate (with monthly compounding).
 */
const calcMonthlyRoi = n => Math.pow(1 + n, 1 / 12) - 1;

const roi = .07; // % gain per year (return on investment)
const monthlyRoi = calcMonthlyRoi(roi);

const marginalTaxRate = .37;

/**
 * 
 * @param {number} p Remaining principal for the loan.
 * @param {number} i Monthly interest rate.
 * @param {number} t Remaining months for the loan. (term)
 * @returns Monthly loan payment amount.
 */
const calcMonthlyPayment = (p, i, t) => {
  const x = Math.pow(1 + i, t);
  return roundToTwo(p * (i * x)/(x - 1));
};

// round to 2 decimal places
const roundToTwo = num => {
  return +(Math.round(num + 'e+2')  + 'e-2');
};

const createMortgage = obj => {
  obj.monthlyInterestRate = obj.interestRate / 12;
  obj.monthlyPayment = calcMonthlyPayment(obj.balance, obj.monthlyInterestRate, obj.term);
  obj.payments = [];
  obj.netWorth = [];
  obj.closingCosts ??= 0;
  return obj;
};

let mortgage1 = createMortgage({
  name: 'Mortgage 1',
  interestRate: .0275,
  balance: 417000,
  disbursementDate: moment('2016-10-19'), // use to calc per diem interest
  term: 360,
  firstPaymentDate: moment('2016-12-01'),
  type: '7/1 ARM',
  rateAdjust: {
    interestRate: .06,
    adjustDate: moment('2023-12-01'),
  },
  doItemizeInterest: false,
  closingCosts: 2250,
});
let mortgage2 = createMortgage({
  name: 'Mortgage 2',
  interestRate: .05,
  balance: 500000,
  disbursementDate: moment('2022-04-02'),
  term: 360,
  firstPaymentDate: moment('2022-06-01'),
  doItemizeInterest: false,
  closingCosts: 2250,
});

// let mortgage1 = createMortgage({
//   name: 'Mortgage 1',
//   interestRate: .0425,
//   balance: 500000,
//   disbursementDate: moment('2022-04-02'), // use to calc per diem interest
//   term: 360,
//   firstPaymentDate: moment('2022-06-01'),
//   rateAdjust: {
//     interestRate: .075,
//     adjustDate: moment('2029-06-01'),
//   },
//   doItemizeInterest: true,
//   closingCosts: 2250,
// });
// let mortgage1 = createMortgage({
//   name: 'Mortgage 1',
//   interestRate: .04,
//   balance: 500000,
//   disbursementDate: moment('2022-04-02'), // use to calc per diem interest
//   term: 180,
//   firstPaymentDate: moment('2022-06-01'),
//   doItemizeInterest: true,
//   closingCosts: 2250,
// });
// let mortgage2 = createMortgage({
//   name: 'Mortgage 2',
//   interestRate: .0475,
//   balance: 500000,
//   disbursementDate: moment('2022-04-02'),
//   term: 360,
//   firstPaymentDate: moment('2022-06-01'),
//   doItemizeInterest: true,
//   closingCosts: 2250,
// });

// ishaan's
// let mortgage1 = createMortgage({
//   name: 'Mortgage 1',
//   interestRate: .02625,
//   balance: 519400,
//   disbursementDate: moment('2020-07-10'),
//   term: 360,
//   firstPaymentDate: moment('2020-09-01'),
//   doItemizeInterest: false,
// });
// let mortgage2 = createMortgage({
//   name: 'Mortgage 2',
//   interestRate: .025,
//   balance: 1500000,
//   //disbursementDate: moment('2022-01-01'),
//   term: 360,
//   firstPaymentDate: moment('2022-01-01'),
//   doItemizeInterest: false,
// });

/**
 * Builds amortization schedule for a given mortgage, with each payments principal
 * and interest portions.
 * @param {} m Mortgage
 */
const buildAmortizationSchedule = m => {
  let b = m.balance;
  let intRate = m.monthlyInterestRate;
  let date = m.firstPaymentDate.clone();
  let payment = m.monthlyPayment;
  while (b > 0) {
    const int = roundToTwo(b * intRate);
    const prin = roundToTwo(payment - int);
    const bStart = b;
    const bEnd = bStart - prin;
    b = bEnd;
    m.payments.push({
      principal: prin,
      interest: int,
      date: date.clone(),
      unixTimeMs: date.valueOf(),
      startingBalance: bStart,
      remainingBalance: bEnd,
    });
    date.add(1, 'month');
    if (m.rateAdjust && date.isSame(m.rateAdjust.adjustDate)) {
      intRate = m.rateAdjust.interestRate / 12;
      const t = m.term - m.rateAdjust.adjustDate.diff(m.firstPaymentDate, 'months');
      payment = calcMonthlyPayment(b, intRate, t);
      m.rateAdjust.monthlyPayment = payment;
    }
  }
};

const compareMortgages = (m1, m2) => {
  let m1n = 0;
  let m2n = 0;
  const m1PayLen = m1.payments.length;
  const m2PayLen = m2.payments.length;

  // fast-forward m1 payment schedule to first payment date of m2
  while (m1.payments[m1n] && !m1.payments[m1n].date.isSame(m2.firstPaymentDate))
    m1n++;

  const isRefi = m1n !== 0;
  let m1Cash;
  let m2Cash;
  let m1Equity = 0;
  let m2Equity;

  if (isRefi) {
    m1Cash = 0;
    m2Cash = roundToTwo(m2.balance - m1.payments[m1n].startingBalance - m2.closingCosts);
    m2Equity = -m2Cash;
  }
  else {
    m1Cash = -m1.closingCosts;
    m2Cash = -m2.closingCosts;
    m2Equity = 0;
  }

  let m1PrevCash;
  let m2PrevCash;
  let netWorthDifferences = [];
  let m1Payment = m1.monthlyPayment;
  let m2Payment = m2.monthlyPayment;

  while (m1n < m1PayLen || m2n < m2PayLen) {
    const eitherPayment = m1n < m1PayLen ? m1.payments[m1n] : m2.payments[m2n];
    const date = eitherPayment.date;
    const unixTimeMs = eitherPayment.unixTimeMs;
    let m1NetWorth;
    let m2NetWorth;

    if (m1n < m1PayLen) {
      if (m1.rateAdjust && date.isSame(m1.rateAdjust.adjustDate))
        m1Payment = m1.rateAdjust.monthlyPayment;
      const accruedInt = m1PrevCash === undefined ? 0 : m1PrevCash * monthlyRoi;
      m1Cash = m1Cash - m1Payment + accruedInt;
      if (m1.doItemizeInterest)
        m1Cash += m1.payments[m1n].interest * marginalTaxRate;
      m1Equity += m1.payments[m1n].principal;
      m1NetWorth = m1Cash + m1Equity;
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
      if (m2.doItemizeInterest)
        m2Cash += m2.payments[m2n].interest * marginalTaxRate;
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

Highcharts.setOptions({
  lang: {
      thousandsSep: ','
  }
});

const yAxisLabelFormat = '${value:,.0f}';

const createAmortizationChartOptions = m => ({
  chart: {
    type: 'spline',
  },
  title: {
    text: m.name + ' Amortization schedule'
  },
  series: [
    {
      name: 'Principal',
      data: m.payments.map(payment => ({
        x: payment.unixTimeMs,
        y: payment.principal,
      })),
    },
    {
      name: 'Interest',
      data: m.payments.map(payment => ({
        x: payment.unixTimeMs,
        y: payment.interest,
      })),
    }
  ],
  xAxis: {
    type: 'datetime',
    // min: minDate.valueOf(),
  },
  yAxis: {
    title: {
      text: null
    },
    labels: {
      format: yAxisLabelFormat,
    }
  },
  tooltip: {
    shared: true,
    crosshairs: true,
    xDateFormat: '%b %Y',
    valuePrefix: "$",
    valueDecimals: 2,
  },
});

const createComparisonChartOptions = (comparison, m1, m2) => ({
  chart: {
    type: 'spline',
    zoomType: 'x',
  },
  title: {
    text: 'Mortgages Compared'
  },
  series: [
    {
      name: '(M2 - M1) Net Worth',
      data: comparison.map(c => ({
        x: c.unixTimeMs,
        y: Math.round(c.difference),
      })),
    },
    {
      name: 'M1 Net Worth',
      data: m1.netWorth.map(nw => ({
        x: nw.unixTimeMs,
        y: Math.round(nw.netWorth),
      })),
      visible: false,
    },
    {
      name: 'M1 Cash',
      data: m1.netWorth.map(nw => ({
        x: nw.unixTimeMs,
        y: Math.round(nw.cash),
      })),
      visible: false,
    },
    {
      name: 'M1 Equity',
      data: m1.netWorth.map(nw => ({
        x: nw.unixTimeMs,
        y: Math.round(nw.equity),
      })),
      visible: false,
    },
    {
      name: 'M2 Net Worth',
      data: m2.netWorth.map(nw => ({
        x: nw.unixTimeMs,
        y: Math.round(nw.netWorth),
      })),
      visible: false,
    },
    {
      name: 'M2 Cash',
      data: m2.netWorth.map(nw => ({
        x: nw.unixTimeMs,
        y: Math.round(nw.cash),
      })),
      visible: false,
    },
    {
      name: 'M2 Equity',
      data: m2.netWorth.map(nw => ({
        x: nw.unixTimeMs,
        y: Math.round(nw.equity),
      })),
      visible: false,
    },
  ],
  xAxis: {
    type: 'datetime',
  },
  yAxis: {
    title: {
      text: null
    },
    labels: {
      format: yAxisLabelFormat,
    }
  },
  tooltip: {
    shared: true,
    //split: true,
    crosshairs: true,
    xDateFormat: '%b %Y',
    valuePrefix: "$",
    valueDecimals: 0,
  },
});

buildAmortizationSchedule(mortgage1);
buildAmortizationSchedule(mortgage2);
const comparison = compareMortgages(mortgage1, mortgage2);

export default function Report() {
  return (
    <Container>
      <HighchartsReact highcharts={Highcharts} options={createAmortizationChartOptions(mortgage1)} />
      <HighchartsReact highcharts={Highcharts} options={createAmortizationChartOptions(mortgage2)} />
      <HighchartsReact highcharts={Highcharts} options={createComparisonChartOptions(comparison, mortgage1, mortgage2)} />
    </Container>
  );
}