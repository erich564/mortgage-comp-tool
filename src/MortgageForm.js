import {
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import MortgageTerm from './enum/MortgageTerm';
import MortgageType from './enum/MortgageType';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'left',
  display: 'inline-block',
  padding: '30px',
  margin: '30px',
  // color: theme.palette.text.secondary,
  fontSize: 'inherit',
  lineHeight: 'inherit',
  letterSpacing: 'inherit',
}));

export default function MortgageForm({
  state,
  handleMortgageChange,
  isRefinance,
}) {
  const handleChange = e => {
    handleMortgageChange(state.id, e);
  };
  const handleDateChange = (e, key) => {
    handleMortgageChange(state.id, e, key);
  };

  const skinnyWidth = '150px';
  const gutterWidth = '24px';
  const fieldMargin = 'dense';

  const TableCellField = styled(TableCell)({
    border: 0,
    paddingLeft: 0,
    paddingTop: 9,
    paddingBottom: 9,
    paddingRight: 25,
    fontSize: 'inherit',
    lineHeight: 'inherit',
    letterSpacing: 'inherit',
    width: 'auto',
    textAlign: 'right',
  });

  const TableCellValue = styled(TableCell)({
    border: 0,
    padding: 0,
    fontSize: 'inherit',
  });

  return (
    <Item>
      <Typography
        variant="h5"
        component="div"
        sx={{ textAlign: 'center', mb: '20px', color: 'rgba(0,0,0,.75)' }}
      >
        Mortgage {state.id}{' '}
        {isRefinance ? `(${state.id === 1 ? 'Old' : 'New'})` : ''}
      </Typography>
      <Table>
        <TableBody>
          <TableRow>
            <TableCellField>Start Date:</TableCellField>
            <TableCellValue>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  value={state.startDate}
                  views={['year', 'month']}
                  onChange={m => {
                    m.set('date', 1);
                    handleDateChange(m, 'startDate');
                  }}
                  inputFormat="MM-DD-YYYY"
                  // allowSameDateSelection
                  renderInput={params => (
                    <TextField
                      {...params}
                      margin={fieldMargin}
                      required
                      inputProps={{
                        ...params.inputProps,
                        placeholder: 'mm-dd-yyyy',
                      }}
                      sx={{ width: skinnyWidth, mr: gutterWidth }}
                      InputLabelProps={{ required: false }}
                    />
                  )}
                />
              </LocalizationProvider>
            </TableCellValue>
          </TableRow>
          <TableRow>
            <TableCellField>Loan Amount:</TableCellField>
            <TableCellValue>
              <TextField
                margin={fieldMargin}
                required
                value={state.loanAmount}
                name="loanAmount"
                onChange={handleChange}
                fullWidth
                placeholder="600000"
                sx={{ width: skinnyWidth }}
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
            <TableCellField>Interest Rate:</TableCellField>
            <TableCellValue>
              <TextField
                margin={fieldMargin}
                required
                value={state.interestRate}
                name="interestRate"
                onChange={handleChange}
                fullWidth
                sx={{
                  input: { textAlign: 'right' },
                  width: skinnyWidth,
                  mr: gutterWidth,
                }}
                placeholder="4.25"
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
            <TableCellField>Term:</TableCellField>
            <TableCellValue>
              <TextField
                value={state.term}
                name="term"
                select
                margin={fieldMargin}
                sx={{ width: skinnyWidth }}
                onChange={handleChange}
              >
                {Object.keys(MortgageTerm.props).map(n => (
                  <MenuItem key={n} value={n}>
                    {MortgageTerm.props[n].name}
                  </MenuItem>
                ))}
              </TextField>
            </TableCellValue>
          </TableRow>
          <TableRow>
            <TableCellField>Type:</TableCellField>
            <TableCellValue>
              <TextField
                value={state.type}
                name="type"
                margin={fieldMargin}
                select
                required
                sx={{ width: skinnyWidth, mr: gutterWidth }}
                onChange={handleChange}
              >
                {Object.keys(MortgageType.props).map(n => (
                  <MenuItem key={n} value={n}>
                    {MortgageType.props[n].name}
                  </MenuItem>
                ))}
              </TextField>
            </TableCellValue>
          </TableRow>
          <TableRow>
            <TableCellField>Adj. Int. Rate:</TableCellField>
            <TableCellValue>
              <TextField
                margin={fieldMargin}
                name="interestRateAdjusted"
                value={state.interestRateAdjusted}
                onChange={handleChange}
                disabled={
                  state.type === MortgageType.FixedRate || state.type === ''
                }
                required
                sx={{ input: { textAlign: 'right' }, width: skinnyWidth }}
                placeholder="6.75"
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
            <TableCellField>Closing Costs:</TableCellField>
            <TableCellValue>
              <TextField
                margin={fieldMargin}
                name="closingCosts"
                value={state.closingCosts}
                onChange={handleChange}
                fullWidth
                placeholder="2000"
                sx={{ width: skinnyWidth }}
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
    </Item>
  );
}
