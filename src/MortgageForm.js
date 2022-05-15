import {
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableRow,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import moment from 'moment';
import TooltipFormField from './common/TooltipFormField';
import { fieldWidth } from './common/constants';
import { TableCellLabel, TableCellValue } from './common/styled';
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
            <TableCellLabel>Start date:</TableCellLabel>
            <TableCellValue>
              <TooltipFormField tooltip="First mortgage payment date.">
                <TextField
                  value={state.startDateMonth}
                  name="startDateMonth"
                  select
                  label="Month"
                  sx={{ width: fieldWidth.m }}
                  onChange={handleChange}
                >
                  {months.map((m, n) => (
                    <MenuItem key={n + 1} value={n + 1}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  required
                  value={state.startDateYear}
                  name="startDateYear"
                  onChange={handleChange}
                  fullWidth
                  label="Year"
                  placeholder="2022"
                  sx={{ width: fieldWidth.xs }}
                  InputLabelProps={{ required: false }}
                  inputProps={{ maxLength: 4 }}
                />
              </TooltipFormField>
            </TableCellValue>
          </TableRow>
          <TableRow>
            <TableCellLabel>Loan amount:</TableCellLabel>
            <TableCellValue>
              <TextField
                required
                value={state.loanAmount}
                name="loanAmount"
                onChange={handleChange}
                fullWidth
                placeholder="600000"
                sx={{ width: fieldWidth.m }}
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
            <TableCellLabel>Interest rate:</TableCellLabel>
            <TableCellValue>
              <TextField
                required
                value={state.interestRate}
                name="interestRate"
                onChange={handleChange}
                fullWidth
                sx={{
                  input: { textAlign: 'right' },
                  width: fieldWidth.s,
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
            <TableCellLabel>Term:</TableCellLabel>
            <TableCellValue>
              <TextField
                value={state.term}
                name="term"
                select
                sx={{ width: fieldWidth.m }}
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
            <TableCellLabel>Type:</TableCellLabel>
            <TableCellValue>
              <TextField
                value={state.type}
                name="type"
                select
                required
                sx={{ width: fieldWidth.m }}
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
            <TableCellLabel>
              Adjusted
              <br />
              interest rate:
            </TableCellLabel>
            <TableCellValue>
              <TooltipFormField tooltip="The interest rate after the initial fixed period for adjustable rate mortgages (ARMs).">
                <TextField
                  name="interestRateAdjusted"
                  value={state.interestRateAdjusted}
                  onChange={handleChange}
                  disabled={
                    state.type === MortgageType.FixedRate || state.type === ''
                  }
                  required
                  sx={{ input: { textAlign: 'right' }, width: fieldWidth.s }}
                  placeholder="6.75"
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
            <TableCellLabel>Closing costs:</TableCellLabel>
            <TableCellValue>
              <TooltipFormField
                tooltip="Do not include prepaid or partially prepaid (initial escrow)
            homeowner's insurance, mortgage insurance, and property taxes. Also, don't
            include per-diem mortgage interest."
              >
                <TextField
                  name="closingCosts"
                  value={state.closingCosts}
                  onChange={handleChange}
                  fullWidth
                  placeholder="2000"
                  sx={{ width: fieldWidth.s }}
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
    </Item>
  );
}
