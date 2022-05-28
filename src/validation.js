import * as yup from 'yup';
import { tcjaBreakpoint } from './common/constants';
import MortgageTerm from './enum/MortgageTerm';
import MortgageType from './enum/MortgageType';

const moment = require('moment');

const msgInvalidNumber = 'Enter a valid number.';
const msgEnterANumber = 'Enter a number.';
const msgSelectAnOption = 'Select an option.';

export const enableM1HomeAcquisitionDebt = (
  doItemize,
  isRefinance,
  startDate1
) =>
  doItemize && isRefinance && startDate1 && startDate1.isAfter(tcjaBreakpoint);
export const enableRefiNewAcquisitionDebt = (
  doItemize,
  isRefinance,
  startDate2
) =>
  doItemize && isRefinance && startDate2 && startDate2.isAfter(tcjaBreakpoint);

export const validationSchema = yup.object({
  isRefinance: yup.boolean().typeError(msgSelectAnOption),
  roi: yup.number().typeError(msgInvalidNumber),
  marginalTaxRate: yup.mixed().when(['doItemize'], {
    is: true,
    then: yup
      .number()
      .typeError(msgInvalidNumber)
      .required(msgEnterANumber)
      .max(100, 'Enter less than or equal to 100%.'),
  }),
  otherItemizedDeductions: yup.mixed().when(['doItemize'], {
    is: true,
    then: yup.number().typeError(msgInvalidNumber).required(msgEnterANumber),
  }),
  refiNewAcquisitionDebt: yup
    .mixed()
    .when(['doItemize', 'isRefinance', 'mortgage2.startDate'], {
      is: (doItemize, isRefinance, startDate2) =>
        enableRefiNewAcquisitionDebt(doItemize, isRefinance, startDate2),
      then: yup.number().typeError(msgInvalidNumber),
    }),
  m1HomeAcquisitionDebt: yup
    .mixed()
    .when(['doItemize', 'isRefinance', 'mortgage1.startDate'], {
      is: (doItemize, isRefinance, startDate1) =>
        enableM1HomeAcquisitionDebt(doItemize, isRefinance, startDate1),
      then: yup
        .number()
        .typeError(msgInvalidNumber)
        .test('m1HomeAcquisitionDebt', (val, context) => {
          const m1LoanAmount = context.parent.mortgage1.loanAmount;
          const createError = msg =>
            context.createError({
              message: msg,
            });
          if (m1LoanAmount && val !== undefined) {
            if (val === 0) return createError('Must be greater than 0.');
            if (val > m1LoanAmount)
              return createError("Must be less than Mortgage 1's loan amount.");
          }
          return true;
        }),
    }),
  // nearly same validation schema for both sets of mortgage form fields
  ...[1, 2].reduce(
    (prev, id) => ({
      ...prev,
      [`mortgage${id}`]: yup.object({
        startDate: yup
          .mixed()
          .required('Enter a month and year.')
          .test('startDate', (val, context) => {
            // @ts-ignore
            const values = context.from[1].value;
            const { startDate, startDateYear } = values[`mortgage${id}`];
            const startDate1 = values.mortgage1.startDate;
            const startDate2 = values.mortgage2.startDate;
            const term1 = values.mortgage1.term;
            const createError = msg =>
              context.createError({
                message: msg,
              });
            if (!Number.isInteger(+startDateYear))
              return createError('Enter a valid year.');
            if (Math.abs(moment().diff(startDate, 'years')) >= 50)
              return createError('Must be within 50 years of today.');
            if (startDate1 && startDate2 && values.isRefinance !== null) {
              if (values.isRefinance) {
                if (startDate2.diff(startDate1, 'months') < 2) {
                  return createError(
                    "For refinances, Mortgage 1's start date must be at least two" +
                      "months before Mortgage 2's."
                  );
                }
                if (
                  startDate2.diff(startDate1, 'years') >=
                  MortgageTerm.props[term1].years
                ) {
                  return createError('Start dates are too many years apart.');
                }
              } else {
                if (!startDate1.isSame(startDate2)) {
                  return createError(
                    'For purchases, both mortgages must have the same start date.'
                  );
                }
              }
            }
            return true;
          }),
        loanAmount: yup
          .number()
          .typeError(msgInvalidNumber)
          .required(msgEnterANumber),
        interestRate: yup
          .number()
          .typeError(msgInvalidNumber)
          .required(msgEnterANumber),
        term: yup.number().required(msgSelectAnOption),
        type: yup.number().required(msgSelectAnOption),
        interestRateAdjusted: yup.mixed().when(['type'], {
          is: type =>
            !(
              type === '' ||
              type === undefined ||
              type === +MortgageType.FixedRate
            ),
          then: yup
            .number()
            .typeError(msgInvalidNumber)
            .required(msgEnterANumber),
        }),
        closingCosts: yup.number().typeError(msgInvalidNumber),
      }),
    }),
    {}
  ),
});
