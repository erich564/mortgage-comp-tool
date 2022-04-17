import Highcharts, { merge } from 'highcharts';

const yAxisLabelFormat = '${value:,.0f}';

Highcharts.setOptions({
  lang: {
    thousandsSep: ',',
  },
});

const commonOptions = {
  chart: {
    type: 'spline',
    zoomType: 'x',
  },
  plotOptions: {
    series: {
      states: {
        hover: {
          lineWidthPlus: 0,
        },
      },
    },
  },
  xAxis: {
    type: 'datetime',
  },
  yAxis: {
    title: {
      text: null,
    },
    labels: {
      format: yAxisLabelFormat,
    },
  },
  tooltip: {
    shared: true,
    crosshairs: true,
    // xDateFormat: '%b %Y',
    xDateFormat: '%m-%Y',
    headerFormat: '{point.key}<br/>',
    valuePrefix: '$',
  },
};

export const createComparisonChartOptions = (
  comparison,
  m1,
  m2,
  minDate,
  maxDate
) =>
  merge(commonOptions, {
    title: {
      text: 'Mortgages Compared',
    },
    series: [
      {
        name: 'Net Worth Difference',
        data: comparison.map(c => ({
          x: c.unixTimeMs,
          y: Math.round(c.difference),
        })),
      },
      {
        name: `${m1.name} Net Worth`,
        data: m1.netWorth.map(nw => ({
          x: nw.unixTimeMs,
          y: Math.round(nw.netWorth),
        })),
      },
      {
        name: `${m2.name} Net Worth`,
        data: m2.netWorth.map(nw => ({
          x: nw.unixTimeMs,
          y: Math.round(nw.netWorth),
        })),
      },
      {
        name: `${m1.name} Cash`,
        data: m1.netWorth.map(nw => ({
          x: nw.unixTimeMs,
          y: Math.round(nw.cash),
        })),
        visible: false,
      },
      {
        name: `${m2.name} Cash`,
        data: m2.netWorth.map(nw => ({
          x: nw.unixTimeMs,
          y: Math.round(nw.cash),
        })),
        visible: false,
      },
      {
        name: `${m1.name} Equity`,
        data: m1.netWorth.map(nw => ({
          x: nw.unixTimeMs,
          y: Math.round(nw.equity),
        })),
        visible: false,
      },
      {
        name: `${m2.name} Equity`,
        data: m2.netWorth.map(nw => ({
          x: nw.unixTimeMs,
          y: Math.round(nw.equity),
        })),
        visible: false,
      },
    ],
    xAxis: {
      min: minDate,
      max: maxDate,
    },
    tooltip: {
      valueDecimals: 0,
    },
  });

export const createCumulativeChartOptions = (m1, m2, minDate, maxDate) =>
  merge(commonOptions, {
    title: {
      text: `Cumulative Payments`,
    },
    series: [
      {
        name: `${m1.name} Payments`,
        data: m1.payments.map(p => ({
          x: p.unixTimeMs,
          y: p.cumPayments,
        })),
      },
      {
        name: `${m2.name} Payments`,
        data: m2.payments.map(p => ({
          x: p.unixTimeMs,
          y: p.cumPayments,
        })),
      },
      {
        name: `${m1.name} Principal`,
        data: m1.payments.map(p => ({
          x: p.unixTimeMs,
          y: p.cumPrinciple,
        })),
        visible: false,
      },
      {
        name: `${m2.name} Principal`,
        data: m2.payments.map(p => ({
          x: p.unixTimeMs,
          y: p.cumPrinciple,
        })),
        visible: false,
      },
      {
        name: `${m1.name} Interest`,
        data: m1.payments.map(p => ({
          x: p.unixTimeMs,
          y: p.cumInterest,
        })),
        visible: false,
      },
      {
        name: `${m2.name} Interest`,
        data: m2.payments.map(p => ({
          x: p.unixTimeMs,
          y: p.cumInterest,
        })),
        visible: false,
      },
    ],
    xAxis: {
      min: minDate,
      max: maxDate,
    },
    tooltip: {
      valueDecimals: 0,
    },
  });

export const createAmortizationChartOptions = (m, minDate, maxDate) =>
  merge(commonOptions, {
    title: {
      text: `${m.name} Amortization`,
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
      },
    ],
    xAxis: {
      min: minDate,
      max: maxDate,
    },
    tooltip: {
      valueDecimals: 2,
    },
  });
