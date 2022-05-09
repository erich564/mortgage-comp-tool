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
import moment from 'moment';
import MortgageTerm from './enum/MortgageTerm';
import MortgageType from './enum/MortgageType';

export const setStartDate = m => {
  if (m.startDateMonth !== '' && m.startDateYear !== '') {
    m.startDate = moment(`${m.startDateMonth}/${m.startDateYear}`, 'MM/YYYY');
  }
};

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

export default function MortgageForm({
  state,
  handleMortgageChange,
  isRefinance,
}) {
  const handleChange = e => {
    handleMortgageChange(state.id, e);
  };

  const skinnyWidth = '150px';
  const gutterWidth = '24px';
  const fieldMargin = 'dense';
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

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
              <TextField
                value={state.startDateMonth}
                name="startDateMonth"
                select
                label="Month"
                margin={fieldMargin}
                sx={{ width: 125, mr: 2 }}
                onChange={handleChange}
              >
                {months.map((m, n) => (
                  <MenuItem key={n + 1} value={n + 1}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin={fieldMargin}
                required
                value={state.startDateYear}
                name="startDateYear"
                onChange={handleChange}
                fullWidth
                label="Year"
                placeholder="2022"
                sx={{ width: 65 }}
                InputLabelProps={{ required: false }}
                inputProps={{ maxLength: 4 }}
              />
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
