import IRSFilingStatus from './enum/IRSFilingStatus';
import MortgageTerm from './enum/MortgageTerm';
import MortgageType from './enum/MortgageType';

const moment = require('moment');

const mortgageTemplate = {
  loanAmount: '',
  term: MortgageTerm._30_years,
  type: '',
  interestRate: '',
  startDateMonth: '',
  startDateYear: '',
  startDate: null,
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
  m1HomeAcquisitionDebt: '',
  refiNewAcquisitionDebt: '',
  irsFilingStatus: IRSFilingStatus.Single,
  otherItemizedDeductions: '10000',
};

const nextViableStartDate = moment().startOf('month').add(2, 'months');

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
        startDateMonth: 12,
        startDateYear: '2016',
        interestRateAdjusted: '5',
        closingCosts: '3208',
      },
      {
        id: 2,
        loanAmount: '500000',
        term: MortgageTerm._30_years,
        type: MortgageType.FixedRate,
        interestRate: '5.5',
        startDateMonth: nextViableStartDate.month() + 1,
        startDateYear: `${nextViableStartDate.year()}`,
        interestRateAdjusted: '',
        closingCosts: '3000',
      },
    ],
    doItemize: true,
    marginalTaxRate: '33.3',
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
        startDateMonth: 9,
        startDateYear: '2020', // closing date 07/10/20
        interestRateAdjusted: '',
        closingCosts: '0',
      },
      {
        id: 2,
        loanAmount: '1500000',
        term: MortgageTerm._30_years,
        type: MortgageType.FixedRate,
        interestRate: '2.5',
        startDateMonth: 1,
        startDateYear: '2022',
        interestRateAdjusted: '',
        closingCosts: '0',
      },
    ],
    doItemize: true,
    marginalTaxRate: '49.3',
    irsFilingStatus: IRSFilingStatus.MarriedFilingJointly,
  },
  {
    ...formDefaults,
    isRefinance: false,
    roi: '7.5',
    mortgages: [
      {
        id: 1,
        loanAmount: '650000',
        term: MortgageTerm._30_years,
        type: MortgageType._7_1_Arm,
        interestRate: '4.5',
        startDateMonth: nextViableStartDate.month() + 1,
        startDateYear: `${nextViableStartDate.year()}`,
        interestRateAdjusted: '6.75',
        closingCosts: '3500',
      },
      {
        id: 2,
        loanAmount: '500000',
        term: MortgageTerm._30_years,
        type: MortgageType.FixedRate,
        interestRate: '5',
        startDateMonth: nextViableStartDate.month() + 1,
        startDateYear: `${nextViableStartDate.year()}`,
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
    roi: '7.5',
    mortgages: [
      {
        id: 1,
        loanAmount: '750000',
        term: MortgageTerm._30_years,
        type: MortgageType.FixedRate,
        interestRate: '4.75',
        startDateMonth: 4,
        startDateYear: '2019',
        interestRateAdjusted: '',
        closingCosts: '2000',
      },
      {
        id: 2,
        loanAmount: '700000',
        term: MortgageTerm._30_years,
        type: MortgageType._7_1_Arm,
        interestRate: '4.25',
        startDateMonth: 7,
        startDateYear: '2022',
        interestRateAdjusted: '5.5',
        closingCosts: '2000',
      },
    ],
    doItemize: true,
    marginalTaxRate: '35',
    irsFilingStatus: IRSFilingStatus.Single,
  },
];
