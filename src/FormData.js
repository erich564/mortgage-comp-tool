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
  irsFilingStatus: IRSFilingStatus.Single,
  otherItemizedDeductions: '10000',
  refiNewAcquisitionDebt: '',
  m1HomeAcquisitionDebt: '',
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
    roi: '8',
    mortgage1: {
      id: 1,
      loanAmount: '500000',
      term: MortgageTerm._50_years,
      type: MortgageType.FixedRate,
      interestRate: '4.5',
      startDateMonth: 7,
      startDateYear: '2018',
      closingCosts: '3500',
    },
    mortgage2: {
      id: 2,
      loanAmount: '775000',
      term: MortgageTerm._40_years,
      type: MortgageType._10_1_Arm,
      interestRate: '6.125',
      startDateMonth: 12,
      startDateYear: '2024',
      interestRateAdjusted: '5.5',
      closingCosts: '3500',
    },
    doItemize: true,
    marginalTaxRate: '33',
    irsFilingStatus: IRSFilingStatus.Single,
    refiNewAcquisitionDebt: '75000',
    m1HomeAcquisitionDebt: '400000',
  }),
];
