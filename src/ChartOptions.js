import { merge } from 'highcharts';

const yAxisLabelFormat = '${value:,.0f}';

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

export const createAmortizationChartOptions = (m, minDate, maxDate) =>
  merge(commonOptions, {
    title: {
      text: `${m.name} Amortization schedule`,
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

export const createComparisonChartOptions = (comparison, m1, m2) =>
  merge(commonOptions, {
    title: {
      text: 'Mortgages Compared',
    },
    series: [
      {
        name: 'NW Difference',
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
      },
      {
        name: 'M2 Net Worth',
        data: m2.netWorth.map(nw => ({
          x: nw.unixTimeMs,
          y: Math.round(nw.netWorth),
        })),
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
        name: 'M2 Cash',
        data: m2.netWorth.map(nw => ({
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
        name: 'M2 Equity',
        data: m2.netWorth.map(nw => ({
          x: nw.unixTimeMs,
          y: Math.round(nw.equity),
        })),
        visible: false,
      },
    ],
    tooltip: {
      valueDecimals: 0,
    },
  });
