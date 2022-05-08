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
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  styled,
} from '@mui/material';
import MortgageForm from './MortgageForm';
import IRSFilingStatus from './enum/IRSFilingStatus';

const inputWidth = '124px';

const TableCellField = styled(TableCell)({
  border: 0,
  paddingLeft: 0,
  paddingTop: 9,
  paddingBottom: 9,
  paddingRight: 40,
  fontSize: 'inherit',
  lineHeight: 'inherit',
  letterSpacing: 'inherit',
  width: '100%',
});

const TableCellValue = styled(TableCell)({
  border: 0,
  padding: 0,
  paddingTop: 12,
  paddingBottom: 12,
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
      {state.mortgages.map(m => (
        <MortgageForm
          key={m.id}
          handleMortgageChange={handleMortgageChange}
          state={m}
          isRefinance={state.isRefinance}
        />
      ))}
      <br />
      <Table sx={{ margin: 'auto', width: 'auto' }}>
        <TableBody>
          <TableRow>
            <TableCellField sx={{ width: 'auto' }}>
              How much do you expect investments to make per year?
            </TableCellField>
            <TableCellValue sx={{ padding: 0 }}>
              <TextField
                required
                margin="none"
                name="roi"
                value={state.roi}
                placeholder="9"
                sx={{ input: { textAlign: 'right' }, width: inputWidth }}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                }}
                InputLabelProps={{ required: false }}
              />
            </TableCellValue>
          </TableRow>
        </TableBody>
      </Table>
      <br />
      <br />
      <Accordion
        expanded={state.doItemize}
        onChange={handleAccordianChange}
        sx={{
          maxWidth: 600,
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
                <TableCellField>
                  Is the mortgage interest deductable on income taxes?
                </TableCellField>
                <TableCellValue sx={{ padding: 0 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={state.doItemize}
                        onChange={handleChange}
                        name="doItemize"
                      />
                    }
                    label="Itemize"
                  />
                </TableCellValue>
              </TableRow>
            </TableBody>
          </Table>
        </AccordionSummary>
        <AccordionDetails sx={{ paddingTop: 0 }}>
          <Table sx={{ margin: 'auto', width: 1 }}>
            <TableBody>
              <TableRow>
                <TableCellField>Marginal Tax Rate:</TableCellField>
                <TableCellValue>
                  <TextField
                    required
                    margin="none"
                    name="marginalTaxRate"
                    value={state.marginalTaxRate}
                    onChange={handleChange}
                    sx={{ input: { textAlign: 'right' }, width: inputWidth }}
                    placeholder="40"
                    disabled={!state.doItemize}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ required: false }}
                  />
                </TableCellValue>
              </TableRow>
              <TableRow>
                <TableCellField>
                  What is your IRS tax filing status?
                </TableCellField>
                <TableCellValue>
                  <Select
                    required
                    disabled={!state.doItemize}
                    sx={{ minWidth: inputWidth }}
                    value={state.irsFilingStatus}
                    name="irsFilingStatus"
                    onChange={handleChange}
                  >
                    {Object.keys(IRSFilingStatus.props).map(n => (
                      <MenuItem key={n} value={n}>
                        {IRSFilingStatus.props[n].name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCellValue>
              </TableRow>
              <TableRow>
                <TableCellField>
                  Other itemized deductions (e.g. salt, donations):
                </TableCellField>
                <TableCellValue>
                  <TextField
                    required
                    disabled={!state.doItemize}
                    margin="none"
                    name="otherItemizedDeductions"
                    value={state.otherItemizedDeductions}
                    sx={{ input: { textAlign: 'right' }, width: inputWidth }}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ required: false }}
                  />
                </TableCellValue>
              </TableRow>
              <TableRow>
                <TableCellField>
                  For cash-out refinances, new home acquisition debt:
                </TableCellField>
                <TableCellValue>
                  <TextField
                    required
                    disabled={!(state.doItemize && state.isRefinance)}
                    margin="none"
                    name="newAcquisitionDebt"
                    value={state.newAcquisitionDebt}
                    placeholder="9"
                    sx={{ input: { textAlign: 'right' }, width: inputWidth }}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ required: false }}
                  />
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
