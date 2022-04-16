import moment from 'moment';
import MortgageTerm from './MortgageTerm';
import MortgageType from './MortgageType';

const mortgageTemplate = {
  loanAmount: '',
  term: MortgageTerm._30_years,
  type: '',
  interestRate: '',
  startDate: null,
  interestRateAdjusted: '',
  closingCosts: '',
};

export const formDefaults = {
  purchaseOrRefinance: 'purchase',
  roi: '9',
  mortgages: [1, 2].map(n => ({
    ...mortgageTemplate,
    id: n,
  })),
  doItemize: true,
  marginalTaxRate: '40',
};

export const sampleData = [
  {
    purchaseOrRefinance: 'refinance',
    roi: '9',
    mortgages: [
      {
        id: 1,
        loanAmount: '417000',
        term: MortgageTerm._30_years,
        type: MortgageType._7_1_Arm,
        interestRate: '2.75',
        startDate: moment('2016-12-01'),
        interestRateAdjusted: '6',
        closingCosts: '2000',
      },
      {
        id: 2,
        loanAmount: '500000',
        term: MortgageTerm._30_years,
        type: MortgageType.FixedRate,
        interestRate: '5',
        startDate: moment('2016-12-01'),
        interestRateAdjusted: '',
        closingCosts: '2000',
      },
    ],
    doItemize: true,
    marginalTaxRate: '40',
  },
  {
    purchaseOrRefinance: 'purchase',
    roi: '8.5',
    mortgages: [
      {
        id: 1,
        loanAmount: '650000',
        term: MortgageTerm._30_years,
        type: MortgageType._7_1_Arm,
        interestRate: '4.5',
        startDate: moment(),
        interestRateAdjusted: '6.75',
        closingCosts: '2000',
      },
      {
        id: 2,
        loanAmount: '500000',
        term: MortgageTerm._30_years,
        type: MortgageType.FixedRate,
        interestRate: '5',
        startDate: moment(),
        interestRateAdjusted: '',
        closingCosts: '2000',
      },
    ],
    doItemize: true,
    marginalTaxRate: '40',
  },
];
