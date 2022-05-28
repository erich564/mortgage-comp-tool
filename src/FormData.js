import merge from './common/utility';
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
  startDate: undefined,
  interestRateAdjusted: '',
  closingCosts: '',
};

export const formDefaults = {
  isRefinance: null,
  roi: '9',
  mortgage1: {
    id: 1,
    ...mortgageTemplate,
  },
  mortgage2: {
    id: 2,
    ...mortgageTemplate,
  },
  doItemize: false,
  marginalTaxRate: '',
  m1HomeAcquisitionDebt: '',
  refiNewAcquisitionDebt: '',
  irsFilingStatus: IRSFilingStatus.Single,
  otherItemizedDeductions: '10000',
};

const nextViableStartDate = moment().startOf('month').add(2, 'months');

export const sampleData = [
  merge(formDefaults, {
    isRefinance: true,
    roi: '9',
    mortgage1: {
      id: 1,
      loanAmount: '417000',
      term: MortgageTerm._30_years,
      type: MortgageType._7_1_Arm,
      interestRate: '2.75',
      startDateMonth: 12,
      startDateYear: '2016',
      interestRateAdjusted: '5.5',
      closingCosts: '3208',
    },
    mortgage2: {
      id: 2,
      loanAmount: '650000',
      term: MortgageTerm._30_years,
      type: MortgageType.FixedRate,
      interestRate: '5.5',
      startDateMonth: nextViableStartDate.month() + 1, // 0-based month
      startDateYear: `${nextViableStartDate.year()}`,
      interestRateAdjusted: '',
      closingCosts: '3000',
    },
    doItemize: true,
    marginalTaxRate: '33.3',
  }),
  merge(formDefaults, {
    isRefinance: true,
    roi: '4',
    mortgage1: {
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
    mortgage2: {
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
    doItemize: true,
    marginalTaxRate: '49.3',
    irsFilingStatus: IRSFilingStatus.MarriedFilingJointly,
  }),

  merge(formDefaults, {
    ...formDefaults,
    isRefinance: false,
    roi: '6',
    mortgage1: {
      id: 1,
      loanAmount: '800000',
      term: MortgageTerm._30_years,
      type: MortgageType.FixedRate,
      interestRate: '5.25',
      startDateMonth: nextViableStartDate.month() + 1,
      startDateYear: `${nextViableStartDate.year()}`,
      interestRateAdjusted: '6.75',
      closingCosts: '3500',
    },
    mortgage2: {
      id: 2,
      loanAmount: '600000',
      term: MortgageTerm._30_years,
      type: MortgageType.FixedRate,
      interestRate: '5.25',
      startDateMonth: nextViableStartDate.month() + 1,
      startDateYear: `${nextViableStartDate.year()}`,
      interestRateAdjusted: '',
      closingCosts: '3500',
    },
    doItemize: true,
    marginalTaxRate: '30',
  }),
  merge(formDefaults, {
    ...formDefaults,
    isRefinance: true,
    roi: '7',
    mortgage1: {
      id: 1,
      loanAmount: '750000',
      term: MortgageTerm._40_years,
      type: MortgageType._10_1_Arm,
      interestRate: '5',
      startDateMonth: 4,
      startDateYear: '2019',
      interestRateAdjusted: '6',
      closingCosts: '2000',
    },
    mortgage2: {
      id: 2,
      loanAmount: '700000',
      term: MortgageTerm._30_years,
      type: MortgageType._10_1_Arm,
      interestRate: '5.25',
      startDateMonth: 7,
      startDateYear: '2022',
      interestRateAdjusted: '6.5',
      closingCosts: '3500',
    },
    doItemize: true,
    marginalTaxRate: '35',
    irsFilingStatus: IRSFilingStatus.Single,
  }),
];
