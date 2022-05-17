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
import { TableCellLabel, TableCellValue } from './common/styled';
import IRSFilingStatus from './enum/IRSFilingStatus';

export default function ItemizeForm({
  state,
  handleChange,
  handleExplicitChange,
}) {
  return (
    <Accordion
      expanded={state.doItemize}
      onChange={() => handleExplicitChange('doItemize', !state.doItemize)}
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
              <TableCellLabel sx={{ width: 1 }}>
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
                        checked={state.doItemize}
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
                    required
                    name="marginalTaxRate"
                    value={state.marginalTaxRate}
                    onChange={handleChange}
                    sx={{
                      input: { textAlign: 'right' },
                      width: fieldWidth.s,
                    }}
                    placeholder="40"
                    disabled={!state.doItemize}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ required: false }}
                  />
                </TooltipFormField>
              </TableCellValue>
            </TableRow>
            <TableRow>
              <TableCellLabel>Tax filing status:</TableCellLabel>
              <TableCellValue>
                <TextField
                  required
                  select
                  disabled={!state.doItemize}
                  sx={{ minWidth: fieldWidth.xl }}
                  value={state.irsFilingStatus}
                  name="irsFilingStatus"
                  onChange={handleChange}
                >
                  {Object.keys(IRSFilingStatus.props).map(n => (
                    <MenuItem key={n} value={n}>
                      {IRSFilingStatus.props[n].name}
                    </MenuItem>
                  ))}
                </TextField>
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
                    required
                    disabled={!state.doItemize}
                    name="otherItemizedDeductions"
                    value={state.otherItemizedDeductions}
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
                    InputLabelProps={{ required: false }}
                  />
                </TooltipFormField>
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
                    disabled={!(state.doItemize && state.isRefinance)}
                    name="refiNewAcquisitionDebt"
                    value={state.refiNewAcquisitionDebt}
                    sx={{
                      input: { textAlign: 'right' },
                      width: fieldWidth.s,
                    }}
                    onChange={handleChange}
                    placeholder="0"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ required: false }}
                  />
                </TooltipFormField>
              </TableCellValue>
            </TableRow>
            <TableRow>
              <TableCellLabel>
                Custom pre-refi home acquisition debt:
              </TableCellLabel>
              <TableCellValue>
                <TooltipFormField
                  tooltip="In rare circumstances, the refinanced home acquisition debt
                    may be less than the remaining loan amount of Mortgage 1. That is the
                    case if Mortgage 1 was a cash-out refinance that occurred after the Tax
                    Cuts and Jobs Act (TCJA) of 2017. If that is applicable, enter the remaining
                    home acquisition debt at time of that previous refinance."
                >
                  <TextField
                    disabled={!(state.doItemize && state.isRefinance)}
                    name="m1HomeAcquisitionDebt"
                    value={state.m1HomeAcquisitionDebt}
                    sx={{
                      input: { textAlign: 'right' },
                      width: fieldWidth.m,
                    }}
                    onChange={handleChange}
                    placeholder="0"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ required: false }}
                  />
                </TooltipFormField>
              </TableCellValue>
            </TableRow>
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  );
}
