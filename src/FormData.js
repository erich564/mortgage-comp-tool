import moment from 'moment';
import DeductionFrequency from './enum/DeductionFrequency';
import IRSFilingStatus from './enum/IRSFilingStatus';
import MortgageTerm from './enum/MortgageTerm';
import MortgageType from './enum/MortgageType';

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
  doItemize: false,
  marginalTaxRate: '',
  newAcquisitionDebt: '0',
  deductionFrequency: DeductionFrequency.Monthly,
  irsFilingStatus: IRSFilingStatus.Single,
  otherItemizedDeductions: '10000',
};

const nextViableStartDate = moment().startOf('month').add(2, 'months');
export const MOMENT_FORMAT = 'YYYY-MM-DD';

export const sampleData = [
  {
    ...formDefaults,
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
        interestRateAdjusted: '4.62',
        closingCosts: '2773',
      },
      {
        id: 2,
        loanAmount: '500000',
        term: MortgageTerm._30_years,
        type: MortgageType.FixedRate,
        interestRate: '5.625',
        startDate: nextViableStartDate.clone(),
        isStartDateChanged: true,
        interestRateAdjusted: '',
        closingCosts: '3500',
      },
    ],
    doItemize: true,
    marginalTaxRate: '33.3',
  },
  {
    ...formDefaults,
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
        closingCosts: '3500',
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
        closingCosts: '3500',
      },
    ],
    doItemize: true,
    marginalTaxRate: '40',
  },
  {
    ...formDefaults,
    isRefinance: true,
    roi: '4',
    mortgages: [
      {
        id: 1,
        loanAmount: '512060',
        term: MortgageTerm._30_years,
        type: MortgageType.FixedRate,
        interestRate: '2.625',
        startDate: moment('2020-09-1', MOMENT_FORMAT), // closing date 07/10/20
        isStartDateChanged: true,
        interestRateAdjusted: '',
        closingCosts: '0',
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
    doItemize: true,
    marginalTaxRate: '49.3',
    irsFilingStatus: IRSFilingStatus.MarriedFilingJointly,
  },
];
