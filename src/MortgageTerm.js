export const MortgageTerm = {
  _40_years: '40 years',
  _30_years: '30 years',
  _20_years: '20 years',
  _15_years: '15 years',
  _10_years: '10 years',
};

export const termToMonths = t => {
  switch (t) {
    case MortgageTerm._40_years:
      return 480;
    case MortgageTerm._30_years:
      return 360;
    case MortgageTerm._20_years:
      return 240;
    case MortgageTerm._10_years:
      return 120;
    default:
      throw new Error('invalid MortgageTerm!');
  }
};
