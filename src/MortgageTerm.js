const monthsPerYear = 12;

const MortgageTerm = {
  _40_years: '1',
  _30_years: '2',
  _20_years: '3',
  _15_years: '4',
  _10_years: '5',
  props: {
    1: { name: '40 years', months: 40 * monthsPerYear },
    2: { name: '30 years', months: 30 * monthsPerYear },
    3: { name: '20 years', months: 20 * monthsPerYear },
    4: { name: '15 years', months: 15 * monthsPerYear },
    5: { name: '10 years', months: 10 * monthsPerYear },
  },
};

export default MortgageTerm;
