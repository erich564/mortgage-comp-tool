import Container from '@mui/material/Container';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
// import DateAdapter from '@mui/lab/AdapterMoment';
import moment from 'moment'

let mortgage1 = {
  interestRate: .0275,
  principal: 417000,
  disbursementDate: moment('2016-10-19'), // use to calc per diem interest
  term: 360,
  monthlyPayment: 1702.37,
  firstPaymentDate: moment('2016-12-01'),
  payments: [],
}

//console.log(mortgage1.firstPaymentDate.format())

let p = mortgage1.principal;
const int = mortgage1.interestRate / 12;
let date = mortgage1.firstPaymentDate;
while (p > 0) {
  let monthlyI = roundToTwo(p * int);
  let monthlyP = roundToTwo(mortgage1.monthlyPayment - monthlyI);
  p -= monthlyP;
  mortgage1.payments.push({
    principal: monthlyP,
    interest: monthlyI,
    date: date.clone(),
    nativeDate: date.toDate()
  });
  date.add(1, 'month');
}

console.log(mortgage1.payments.map(payment => ({
  x: payment.date,
  y: payment.interest,
})))

function roundToTwo(num) {
  return +(Math.round(num + "e+2")  + "e-2");
}

const options = {
  chart: {
    type: 'spline',
  },
  title: {
    text: 'Amortization schedule'
  },
  series: [
    {
      name: 'Principal',
      data: mortgage1.payments.map(payment => ({
        x: payment.nativeDate,
        y: payment.principal,
      })),
    },
    {
      name: 'Interest',
      data: mortgage1.payments.map(payment => ({
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
};

function Report() {
  return (
    <Container>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Container>
  );
}

export default Report;
