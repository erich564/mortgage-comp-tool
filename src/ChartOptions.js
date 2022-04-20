import Highcharts from 'highcharts';
import moment from 'moment';
import merge from './Merge';

const yAxisLabelFormat = '${value:,.0f}';

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

export const createComparisonChartOptions = (comparison, mortgages) =>
  merge(commonOptions, {
    title: {
      text: 'Mortgages Compared',
    },
    series: [
      {
        name: 'Net Worth Difference',
        data: comparison.map(c => ({
          x: c.unixTimeMs,
          y: c.difference,
        })),
      },
      ...mortgages.map(m => ({
        name: `${m.name} Net Worth`,
        data: m.netWorth.map(nw => ({
          x: nw.unixTimeMs,
          y: nw.netWorth,
        })),
      })),
      ...mortgages.map(m => ({
        name: `${m.name} Cash`,
        data: m.netWorth.map(nw => ({
          x: nw.unixTimeMs,
          y: nw.cash,
        })),
        visible: false,
      })),
      ...mortgages.map(m => ({
        name: `${m.name} Equity`,
        data: m.netWorth.map(nw => ({
          x: nw.unixTimeMs,
          y: nw.equity,
        })),
        visible: false,
      })),
    ],
    tooltip: {
      valueDecimals: 0,
    },
  });

export const createCumulativeChartOptions = mortgages =>
  merge(commonOptions, {
    title: {
      text: `Cumulative Payments`,
    },
    series: [
      ...mortgages.map(m => ({
        name: `${m.name} Payments`,
        data: m.payments.map(p => ({
          x: p.unixTimeMs,
          y: p.cumPayments,
        })),
      })),
      ...mortgages.map(m => ({
        name: `${m.name} Principal`,
        data: m.payments.map(p => ({
          x: p.unixTimeMs,
          y: p.cumPrincipal,
        })),
        visible: false,
      })),
      ...mortgages.map(m => ({
        name: `${m.name} Interest`,
        data: m.payments.map(p => ({
          x: p.unixTimeMs,
          y: p.cumInterest,
        })),
        visible: false,
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
      },
      {
        name: 'Interest',
        data: m.payments.map(payment => ({
          x: payment.unixTimeMs,
          y: payment.interest,
        })),
      },
    ],
    tooltip: {
      valueDecimals: 2,
    },
  });
