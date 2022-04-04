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
const calcMonthlyTvm = tvm => Math.pow(1 + tvm, 1 / 12) - 1;

const tvm = .07; // % gain per year (time-value of money)
const monthlyTvm = calcMonthlyTvm(tvm);

const marginalTaxRate = .37;

/**
 * 
 * @param {number} p Remaining principal for the loan.
 * @param {number} i Monthly interest rate.
 * @param {number} term Remaining months for the loan.
 * @returns Monthly loan payment amount.
 */
const calcMonthlyPayment = (p, i, term) => {
  const x = Math.pow(1 + i, term);
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
  interestRate: .045,
  balance: 550000,
  disbursementDate: moment('2022-04-02'),
  term: 360,
  firstPaymentDate: moment('2022-06-01'),
  doItemizeInterest: false,
  closingCosts: 2250,
})

// let mortgage1 = createMortgage({
//   name: 'Mortgage 1',
//   interestRate: .05,
//   balance: 417000,
//   disbursementDate: moment('2016-10-19'), // use to calc per diem interest
//   term: 360,
//   firstPaymentDate: moment('2016-12-01'),
//   doItemizeInterest: true,
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
 * 
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
      nativeDate: date.toDate(),
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

  // fast-forward m1 payment schedule to first payment date of m2
  while (m1.payments[m1n] && !m1.payments[m1n].date.isSame(m2.firstPaymentDate))
    m1n++;

  const m1PayLen = m1.payments.length;
  const m2PayLen = m2.payments.length;
  let m1Cash = 0;
  let m2Cash = roundToTwo(m2.balance - m1.payments[m1n].startingBalance - m2.closingCosts);
  let m1Equity = 0;
  let m2Equity = -m2Cash;
  let m1PrevCash = null;
  let m2PrevCash = null;
  let netWorthDifferences = [];

  while (m1n < m1PayLen || m2n < m2PayLen) {
    const date = m1n < m1PayLen
      ? m1.payments[m1n].date.clone() : m2.payments[m2n].date.clone();
    const nativeDate = date.toDate();
    const dates = {
      date: date,
      nativeDate: nativeDate,
    };
    let m1NetWorth;
    let m2NetWorth;

    if (m1n < m1PayLen) {
      const accruedInt = m1PrevCash === null ? 0 : m1PrevCash * monthlyTvm;
      m1Cash = m1Cash - m1.monthlyPayment + accruedInt;
      if (m1.doItemizeInterest)
        m1Cash += m1.payments[m1n].interest * marginalTaxRate;
      m1Equity += m1.payments[m1n].principal;
      m1NetWorth = m1Cash + m1Equity;
      m1.netWorth.push({
        ...dates,
        cash: m1Cash,
        equity: m1Equity,
        netWorth: m1NetWorth,
      });
      m1PrevCash = m1Cash;
      m1n++;
    }

    if (m2n < m2PayLen) {
      const accruedInt = m2PrevCash === null ? 0 : m2PrevCash * monthlyTvm;
      m2Cash = m2Cash - m2.monthlyPayment + accruedInt;
      if (m2.doItemizeInterest)
        m2Cash += m2.payments[m2n].interest * marginalTaxRate;
      m2Equity += m2.payments[m2n].principal;
      m2NetWorth = m2Cash + m2Equity;
      m2.netWorth.push({
        ...dates,
        cash: m2Cash,
        equity: m2Equity,
        netWorth: m2NetWorth,
      });
      m2PrevCash = m2Cash;
      m2n++;
    }

    if (m1NetWorth && m2NetWorth) {
      netWorthDifferences.push({
        ...dates,
        difference: m2NetWorth - m1NetWorth,
      });
    }
  }

  return netWorthDifferences;
};

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
        x: payment.nativeDate,
        y: payment.principal,
      })),
    },
    {
      name: 'Interest',
      data: m.payments.map(payment => ({
        x: payment.nativeDate,
        y: payment.interest,
      })),
    }
  ],
  xAxis: {
    type: 'datetime',
    // dateTimeLabelFormats: {
    //   day: '%d %b %Y' //eg 01 Jan 2016
    // }
    // min: minDate.valueOf(),
  },
  yAxis: {
    title: {
      text: null
    },
    labels: {
      format: '${value}'
    }
  },
  tooltip: {
    shared: true,
    //split: true,
    crosshairs: true,
    //xDateFormat: '%Y-%m-%d',
    xDateFormat: '%M',
    valuePrefix: "$",
    valueDecimals: 2,
    // pointFormatter: function() { 
    //   return '<span style="color:' + this.series.color + ';">●</span> ' + this.series.name + ': <b>' + this.y + '</b><br/>'; 
    // },
    // formatter: function () {
    //   return this.points.reduce(function (s, point) {
    //     return s + '<br/>' + point.series.name + ': ' + point.y;
    //   }, '<b>' + this.x + '</b>');
    // },
  },
});

const createComparisonChartOptions = (comparison, m1, m2) => ({
  chart: {
    type: 'spline',
  },
  title: {
    text: 'Mortgages Compared'
  },
  series: [
    {
      name: '(M2 - M1) Net Worth',
      data: comparison.map(c => ({
        x: c.nativeDate,
        y: c.difference,
      })),
    },
    {
      name: 'M1 Net Worth',
      data: m1.netWorth.map(nw => ({
        x: nw.nativeDate,
        y: nw.netWorth,
      })),
      visible: false,
    },
    {
      name: 'M1 Cash',
      data: m1.netWorth.map(nw => ({
        x: nw.nativeDate,
        y: nw.cash,
      })),
      visible: false,
    },
    {
      name: 'M1 Equity',
      data: m1.netWorth.map(nw => ({
        x: nw.nativeDate,
        y: nw.equity,
      })),
      visible: false,
    },
    {
      name: 'M2 Net Worth',
      data: m2.netWorth.map(nw => ({
        x: nw.nativeDate,
        y: nw.netWorth,
      })),
      visible: false,
    },
    {
      name: 'M2 Cash',
      data: m2.netWorth.map(nw => ({
        x: nw.nativeDate,
        y: nw.cash,
      })),
      visible: false,
    },
    {
      name: 'M2 Equity',
      data: m2.netWorth.map(nw => ({
        x: nw.nativeDate,
        y: nw.equity,
      })),
      visible: false,
    },
  ],
  xAxis: {
    type: 'datetime',
    // dateTimeLabelFormats: {
    //   day: '%d %b %Y' //eg 01 Jan 2016
    // }
  },
  yAxis: {
    title: {
      text: null
    },
    labels: {
      format: '${value}'
    }
  },
  tooltip: {
    shared: true,
    //split: true,
    crosshairs: true,
    //xDateFormat: '%Y-%m-%d',
    xDateFormat: '%M',
    valuePrefix: "$",
    valueDecimals: 2,
    // pointFormatter: function() { 
    //   return '<span style="color:' + this.series.color + ';">●</span> ' + this.series.name + ': <b>' + this.y + '</b><br/>'; 
    // },
    // formatter: function () {
    //   return this.points.reduce(function (s, point) {
    //     return s + '<br/>' + point.series.name + ': ' + point.y;
    //   }, '<b>' + this.x + '</b>');
    // },
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