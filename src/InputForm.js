import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  styled,
} from '@mui/material';
import MortgageForm from './MortgageForm';
import TooltipFormField from './TooltipFormField';
import { fieldMargin, fieldWidth } from './common/constants';
import IRSFilingStatus from './enum/IRSFilingStatus';

const inputWidth = '124px';

const TableCellLabel = styled(TableCell)({
  border: 0,
  paddingLeft: 0,
  paddingTop: 9,
  paddingBottom: 9,
  paddingRight: 25,
  fontSize: 'inherit',
  lineHeight: 'inherit',
  letterSpacing: 'inherit',
  width: '100%',
  textAlign: 'right',
});

const TableCellValue = styled(TableCell)({
  border: 0,
  padding: 0,
  fontSize: 'inherit',
});

export default function InputForm({
  state,
  handleChange,
  handleMortgageChange,
  handleExplicitChange,
  handleSubmit,
}) {
  const handleAccordianChange = e => {
    e.preventDefault();
    handleExplicitChange('doItemize', !state.doItemize);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'inline-block', textAlign: 'center' }}
    >
      <br />
      <FormControl>
        <FormLabel
          sx={{
            '&.MuiFormLabel-root': {
              color: 'rgba(0, 0, 0, 0.87)',
            },
          }}
        >
          Are you purchasing a home or refinancing?
        </FormLabel>
        <RadioGroup
          row
          name="isRefinance"
          value={String(state.isRefinance)}
          onChange={handleChange}
        >
          <FormControlLabel
            value="false"
            control={<Radio required />}
            label="Purchasing"
          />
          <FormControlLabel
            value="true"
            control={<Radio required />}
            label="Refinancing"
          />
        </RadioGroup>
      </FormControl>
      <br />
      <Box
        sx={{
          display: 'flex',
          textAlign: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '45px',
          my: 3,
        }}
      >
        {state.mortgages.map(m => (
          <MortgageForm
            key={m.id}
            handleMortgageChange={handleMortgageChange}
            state={m}
            isRefinance={state.isRefinance}
          />
        ))}
      </Box>

      <Table sx={{ margin: 'auto', width: 'auto' }}>
        <TableBody>
          <TableRow>
            <TableCellLabel sx={{ width: 'auto' }}>
              Return on investment (ROI):
            </TableCellLabel>
            <TableCellValue>
              <TooltipFormField
                tooltip="How much you expect investments to make
              per year, on average."
              >
                <TextField
                  required
                  margin={fieldMargin}
                  name="roi"
                  value={state.roi}
                  placeholder="9"
                  sx={{ input: { textAlign: 'right' }, width: fieldWidth.s }}
                  onChange={handleChange}
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
        </TableBody>
      </Table>

      <br />
      <Accordion
        expanded={state.doItemize}
        onChange={handleAccordianChange}
        sx={{
          maxWidth: 601,
          margin: 'auto',
          '&.Mui-expanded': {
            margin: 'auto',
          },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Table sx={{ margin: 'auto', width: 1 }}>
            <TableBody>
              <TableRow>
                <TableCellLabel>Itemize mortgage interest:</TableCellLabel>
                <TableCellValue sx={{ pr: '121px' }}>
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
        <AccordionDetails sx={{ p: '30px', pt: 0 }}>
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
                      margin={fieldMargin}
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
                    margin={fieldMargin}
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
                      margin={fieldMargin}
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
                      margin={fieldMargin}
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
                      margin={fieldMargin}
                      name="m1HomeAcquisitionDebt"
                      value={state.m1HomeAcquisitionDebt}
                      sx={{ input: { textAlign: 'right' }, width: inputWidth }}
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
      <br />
      <br />
      <Button variant="contained" type="submit">
        Compare
      </Button>
      <br />
      <br />
    </Box>
  );
}
