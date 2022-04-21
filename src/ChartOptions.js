import Color from 'color';
import Highcharts from 'highcharts';
import moment from 'moment';
import merge from './Merge';

const yAxisLabelFormat = '${value:,.0f}';

const colors = {
  red: '#b84c3e',
  green: '#86a542',
  blue: '#6881d8',
  gold: '#c18739',
  purple: '#8650a6',
  teal: '#50b47b',
  pink: '#b84c7d',
  grey: '#888',
};

for (const c in colors) {
  const lightenPct = 0.4;
  const darkenPct = 0.25;
  const color = Color(colors[c]);
  colors[`${c}s`] = [
    color.lighten(lightenPct).hex(),
    color.darken(darkenPct).hex(),
  ];
}

Highcharts.setOptions({
  lang: {
    thousandsSep: ',',
  },
});

let commonOptions;

/**
 * Determines min/max dates that will cover both mortgage amortization time periods.
 * Then adds some padding to those dates so the data is not pushing up against the
 * ends of the chart.
 */
const calcMinMaxDates = mortgages => {
  const m1 = mortgages[0];
  const m2 = mortgages[1];
  const minDate = moment.min(m1.startDate, m2.startDate).clone();
  const maxDate = moment.max(m1.endDate, m2.endDate).clone();
  const diff = maxDate.diff(minDate, 'days');
  const margin = 0.02;
  const padding = diff * margin;
  minDate.subtract(padding, 'days');
  maxDate.add(padding, 'days');
  return { minDate, maxDate };
};

/**
 * Vertical lines on the graphs.
 */
const makePlotLines = (minDate, maxDate) => {
  const yearsBetweenLines = 5;
  const arr = [];
  const date = minDate.clone().add(1, 'year').startOf('year');
  while (date.year() % yearsBetweenLines !== 0) date.add(1, 'year');
  while (date.isBefore(maxDate)) {
    arr.push({
      color: '#EEE',
      width: 1,
      value: date.valueOf(),
      zIndex: 2,
    });
    date.add(yearsBetweenLines, 'year');
  }
  return arr;
};

export const setCommonOptions = mortgages => {
  const { minDate, maxDate } = calcMinMaxDates(mortgages);
  const plotLines = makePlotLines(minDate, maxDate);

  commonOptions = {
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
      min: minDate.valueOf(),
      max: maxDate.valueOf(),
      plotLines,
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
};

export const createNetWorthChartOptions = (comparison, mortgages) =>
  merge(commonOptions, {
    title: {
      text: 'Net Worth',
    },
    series: [
      {
        name: 'Difference',
        data: comparison.map(c => ({
          x: c.unixTimeMs,
          y: c.difference,
        })),
        color: colors.grey,
      },
      ...mortgages.map((m, n) => ({
        name: `${m.name} Net Worth`,
        data: m.netWorth.map(nw => ({
          x: nw.unixTimeMs,
          y: nw.netWorth,
        })),
        color: colors.blues[n],
      })),
    ],
    tooltip: {
      valueDecimals: 0,
    },
  });

export const createCashEquityChartOptions = mortgages =>
  merge(commonOptions, {
    title: {
      text: 'Cash & Equity',
    },
    series: [
      ...mortgages.map((m, n) => ({
        name: `${m.name} Cash`,
        data: m.netWorth.map(nw => ({
          x: nw.unixTimeMs,
          y: nw.cash,
        })),
        color: colors.teals[n],
      })),
      ...mortgages.map((m, n) => ({
        name: `${m.name} Equity`,
        data: m.netWorth.map(nw => ({
          x: nw.unixTimeMs,
          y: nw.equity,
        })),
        color: colors.golds[n],
      })),
    ],
    tooltip: {
      valueDecimals: 0,
    },
  });

export const createPaymentsChartOptions = mortgages =>
  merge(commonOptions, {
    title: {
      text: `Total Payments`,
    },
    series: [
      ...mortgages.map((m, n) => ({
        name: `${m.name} Payments`,
        data: m.payments.map(p => ({
          x: p.unixTimeMs,
          y: p.cumPayments,
        })),
        color: colors.purples[n],
      })),
      ...mortgages.map((m, n) => ({
        name: `${m.name} Principal`,
        data: m.payments.map(p => ({
          x: p.unixTimeMs,
          y: p.cumPrincipal,
        })),
        visible: false,
        color: colors.greens[n],
      })),
      ...mortgages.map((m, n) => ({
        name: `${m.name} Interest`,
        data: m.payments.map(p => ({
          x: p.unixTimeMs,
          y: p.cumInterest,
        })),
        visible: false,
        color: colors.reds[n],
      })),
    ],
    tooltip: {
      valueDecimals: 0,
    },
  });

export const createAmortizationChartOptions = m =>
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
        color: colors.green,
      },
      {
        name: 'Interest',
        data: m.payments.map(payment => ({
          x: payment.unixTimeMs,
          y: payment.interest,
        })),
        color: colors.red,
      },
    ],
    tooltip: {
      valueDecimals: 2,
    },
  });
