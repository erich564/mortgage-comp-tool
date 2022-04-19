import moment from 'moment';
import { MortgageTerm } from './MortgageTerm';
import { MortgageType } from './MortgageType';

const mortgageTemplate = {
  loanAmount: '',
  term: MortgageTerm._30_years,
  type: '',
  interestRate: '',
  startDate: null,
  isStartDateChanged: false,
  interestRateAdjusted: '',
  closingCosts: '',
};

export const formDefaults = {
  isRefinance: null,
  roi: '9',
  mortgages: [1, 2].map(n => ({
    ...mortgageTemplate,
    id: n,
  })),
  doItemize: true,
  marginalTaxRate: '40',
};

const nextViableStartDate = moment().startOf('month').add(2, 'months');
export const MOMENT_FORMAT = 'YYYY-MM-DD';

export const sampleData = [
  {
    isRefinance: true,
    roi: '9',
    mortgages: [
      {
        id: 1,
        loanAmount: '417000',
        term: MortgageTerm._30_years,
        type: MortgageType._7_1_Arm,
        interestRate: '2.75',
        startDate: moment('2016-12-01', MOMENT_FORMAT),
        isStartDateChanged: true,
        interestRateAdjusted: '6',
        closingCosts: '2000',
      },
      {
        id: 2,
        loanAmount: '500000',
        term: MortgageTerm._30_years,
        type: MortgageType.FixedRate,
        interestRate: '5',
        startDate: nextViableStartDate.clone(),
        isStartDateChanged: true,
        interestRateAdjusted: '',
        closingCosts: '2000',
      },
    ],
    doItemize: true,
    marginalTaxRate: '40',
  },
  {
    isRefinance: false,
    roi: '8.5',
    mortgages: [
      {
        id: 1,
        loanAmount: '650000',
        term: MortgageTerm._30_years,
        type: MortgageType._7_1_Arm,
        interestRate: '4.5',
        startDate: nextViableStartDate.clone(),
        isStartDateChanged: true,
        interestRateAdjusted: '6.75',
        closingCosts: '2000',
      },
      {
        id: 2,
        loanAmount: '500000',
        term: MortgageTerm._30_years,
        type: MortgageType.FixedRate,
        interestRate: '5',
        startDate: nextViableStartDate.clone(),
        isStartDateChanged: true,
        interestRateAdjusted: '',
        closingCosts: '2000',
      },
    ],
    doItemize: true,
    marginalTaxRate: '40',
  },
  {
    isRefinance: true,
    roi: '4',
    mortgages: [
      {
        id: 1,
        loanAmount: '519400',
        term: MortgageTerm._30_years,
        type: MortgageType.FixedRate,
        interestRate: '2.625',
        startDate: moment('2020-09-1', MOMENT_FORMAT),
        isStartDateChanged: true,
        interestRateAdjusted: '',
        closingCosts: '2000',
      },
      {
        id: 2,
        loanAmount: '1500000',
        term: MortgageTerm._30_years,
        type: MortgageType.FixedRate,
        interestRate: '2.5',
        startDate: moment('2022-01-01', MOMENT_FORMAT),
        isStartDateChanged: true,
        interestRateAdjusted: '',
        closingCosts: '0',
      },
    ],
    doItemize: false,
    marginalTaxRate: '40',
  },
];
