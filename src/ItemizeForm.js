import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Table,
  TableBody,
  TableRow,
  TextField,
} from '@mui/material';
import TooltipFormField from './common/TooltipFormField';
import { fieldWidth, formPadding, formPaddingXs } from './common/constants';
import { FieldError, TableCellLabel, TableCellValue } from './common/styled';
import IRSFilingStatus from './enum/IRSFilingStatus';
import {
  enableM1HomeAcquisitionDebt,
  enableRefiNewAcquisitionDebt,
} from './validation';

export default function ItemizeForm({
  formik,
  handleChange,
  hasError,
  getError,
}) {
  const { values } = formik;

  return (
    <Accordion
      expanded={values.doItemize}
      onChange={() => formik.setFieldValue('doItemize', !values.doItemize)}
      sx={{
        maxWidth: 601,
        margin: 'auto',
        '&.Mui-expanded': {
          margin: 'auto',
        },
      }}
    >
      <AccordionSummary
        sx={{
          pl: {
            xs: `${formPaddingXs}px`,
            sm: `${formPadding}px`,
          },
          '.MuiAccordionSummary-content': {
            my: '6px',
            '&.Mui-expanded': {
              my: '14px',
            },
          },
        }}
        expandIcon={<ExpandMoreIcon sx={{}} />}
      >
        <Table sx={{ margin: 'auto', width: 1 }}>
          <TableBody>
            <TableRow>
              <TableCellLabel
                sx={{ width: 1, paddingTop: 0, paddingBottom: 0 }}
              >
                Itemize mortgage interest:
              </TableCellLabel>
              <TableCellValue
                sx={{
                  pr: {
                    xs: '109px',
                    sm: '121px',
                  },
                }}
              >
                <TooltipFormField
                  tooltip="Is the mortgage interest deductable
                  on income taxes?"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.doItemize}
                        onChange={handleChange}
                        name="doItemize"
                      />
                    }
                    label="Yes"
                    sx={{ mr: 0 }}
                  />
                </TooltipFormField>
              </TableCellValue>
            </TableRow>
          </TableBody>
        </Table>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          p: {
            xs: `${formPaddingXs}px`,
            sm: `${formPadding}px`,
          },
          pt: {
            xs: 0,
            sm: 0,
          },
        }}
      >
        <Table sx={{ margin: 'auto', width: 1 }}>
          <TableBody>
            <TableRow>
              <TableCellLabel>Marginal tax rate:</TableCellLabel>
              <TableCellValue>
                <TooltipFormField
                  tooltip="Enter your combined state and federal marginal tax rate
                    on your adjusted gross income (AGI). Your marginal tax rate is
                    the top tax bracket that you're in."
                >
                  <TextField
                    name="marginalTaxRate"
                    value={values.marginalTaxRate}
                    onChange={handleChange}
                    sx={{
                      input: { textAlign: 'right' },
                      width: fieldWidth.s,
                    }}
                    placeholder="40"
                    disabled={!values.doItemize}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    error={hasError('marginalTaxRate')}
                  />
                </TooltipFormField>
                <FieldError display={hasError('marginalTaxRate')}>
                  {getError('marginalTaxRate')}
                </FieldError>
              </TableCellValue>
            </TableRow>
            <TableRow>
              <TableCellLabel>IRS filing status:</TableCellLabel>
              <TableCellValue>
                <TextField
                  select
                  disabled={!values.doItemize}
                  sx={{ minWidth: fieldWidth.xl }}
                  value={values.irsFilingStatus}
                  name="irsFilingStatus"
                  onChange={handleChange}
                  error={hasError('irsFilingStatus')}
                >
                  {Object.keys(IRSFilingStatus.props).map(n => (
                    <MenuItem key={n} value={n}>
                      {IRSFilingStatus.props[n].name}
                    </MenuItem>
                  ))}
                </TextField>
                <FieldError display={hasError('irsFilingStatus')}>
                  {getError('irsFilingStatus')}
                </FieldError>
              </TableCellValue>
            </TableRow>
            <TableRow>
              <TableCellLabel>Other itemized deductions:</TableCellLabel>
              <TableCellValue>
                <TooltipFormField
                  tooltip="For example, state and local taxes
                  (SALT: currently capped at $10k for most people), other mortgage interest,
                  and charitable donations."
                >
                  <TextField
                    disabled={!values.doItemize}
                    name="otherItemizedDeductions"
                    value={values.otherItemizedDeductions}
                    sx={{
                      input: { textAlign: 'right' },
                      width: fieldWidth.s,
                    }}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    error={hasError('otherItemizedDeductions')}
                  />
                </TooltipFormField>
                <FieldError display={hasError('otherItemizedDeductions')}>
                  {getError('otherItemizedDeductions')}
                </FieldError>
              </TableCellValue>
            </TableRow>
            <TableRow>
              <TableCellLabel>Qualified home improvements:</TableCellLabel>
              <TableCellValue>
                <TooltipFormField
                  tooltip="For cash-out refinances that occur after the Tax Cuts and
                    Jobs Act (TCJA) of 2017, home acquisition debt is limited to the
                    remaining amount on the existing mortgage. However, any qualified
                    amount used to substantially improve your home is treated as home
                    acquisition debt. Enter that amount here, if any. Only interest on
                    home acquisition debt can be itemized.
                    "
                >
                  <TextField
                    disabled={
                      !enableRefiNewAcquisitionDebt(
                        values.doItemize,
                        values.isRefinance,
                        values.mortgage2.startDate
                      )
                    }
                    name="refiNewAcquisitionDebt"
                    value={values.refiNewAcquisitionDebt}
                    sx={{
                      input: { textAlign: 'right' },
                      width: fieldWidth.s,
                    }}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    error={hasError('refiNewAcquisitionDebt')}
                  />
                </TooltipFormField>
                <FieldError display={hasError('refiNewAcquisitionDebt')}>
                  {getError('refiNewAcquisitionDebt')}
                </FieldError>
              </TableCellValue>
            </TableRow>
            <TableRow>
              <TableCellLabel>Custom old home acquisition debt:</TableCellLabel>
              <TableCellValue>
                <TooltipFormField
                  tooltip="In rare circumstances, the refinanced home acquisition debt
                    may be less than the remaining loan amount of Mortgage 1. That is the
                    case if Mortgage 1 was a cash-out refinance that closed after the Tax
                    Cuts and Jobs Act (TCJA) of 2017 went into effect. If that is
                    the case, enter the initial home acquisition debt for Mortgage 1."
                >
                  <TextField
                    disabled={
                      !enableM1HomeAcquisitionDebt(
                        values.doItemize,
                        values.isRefinance,
                        values.mortgage1.startDate
                      )
                    }
                    name="m1HomeAcquisitionDebt"
                    value={values.m1HomeAcquisitionDebt}
                    sx={{
                      input: { textAlign: 'right' },
                      width: fieldWidth.m,
                    }}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    error={hasError('m1HomeAcquisitionDebt')}
                  />
                </TooltipFormField>
                <FieldError display={hasError('m1HomeAcquisitionDebt')}>
                  {getError('m1HomeAcquisitionDebt')}
                </FieldError>
              </TableCellValue>
            </TableRow>
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  );
}
