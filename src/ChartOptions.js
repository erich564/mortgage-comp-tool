import Highcharts, { merge } from 'highcharts';

const yAxisLabelFormat = '${value:,.0f}';

Highcharts.setOptions({
  lang: {
    thousandsSep: ',',
  },
});

let commonOptions;
export const setCommonOptions = ({ minDateMs, maxDateMs }) => {
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
      min: minDateMs,
      max: maxDateMs,
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
          y: p.cumPrinciple,
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
