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
import TooltipFormField from './common/TooltipFormField';
import { fieldWidth, formPadding, formPaddingXs } from './common/constants';
import { FieldError, TableCellLabel, TableCellValue } from './common/styled';
import MortgageTerm from './enum/MortgageTerm';
import MortgageType from './enum/MortgageType';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'left',
  display: 'inline-block',
  padding: formPadding,
  [theme.breakpoints.down('sm')]: {
    padding: formPaddingXs,
  },
  // color: theme.palette.text.secondary,
  fontSize: 'inherit',
  lineHeight: 'inherit',
  letterSpacing: 'inherit',
}));

export default function MortgageForm({ formik, id, handleChange }) {
  const mortgageName = `mortgage${id}`;
  let { values } = formik;
  const { isRefinance } = values;
  values = values[mortgageName];
  const hasError = name =>
    formik.touched[mortgageName]?.[name] &&
    !!formik.errors[mortgageName]?.[name];
  const getError = name => formik.errors[mortgageName]?.[name];

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
        Mortgage {id} {isRefinance ? `(${id === 1 ? 'Old' : 'New'})` : ''}
      </Typography>
      <Table>
        <TableBody>
          <TableRow>
            <TableCellLabel>Start date:</TableCellLabel>
            <TableCellValue>
              <TooltipFormField tooltip="First mortgage payment date.">
                <TextField
                  value={values.startDateMonth}
                  name={`${mortgageName}.startDateMonth`}
                  select
                  label="Month"
                  sx={{ width: fieldWidth.m }}
                  onChange={handleChange}
                  error={hasError('startDate')}
                >
                  {months.map((m, n) => (
                    <MenuItem key={n + 1} value={n + 1}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  value={values.startDateYear}
                  name={`${mortgageName}.startDateYear`}
                  onChange={handleChange}
                  fullWidth
                  label="Year"
                  placeholder="2022"
                  sx={{ width: fieldWidth.xs }}
                  inputProps={{ maxLength: 4 }}
                  error={hasError('startDate')}
                />
              </TooltipFormField>
              <FieldError display={hasError('startDate')}>
                {getError('startDate')}
              </FieldError>
            </TableCellValue>
          </TableRow>
          <TableRow>
            <TableCellLabel>Loan amount:</TableCellLabel>
            <TableCellValue>
              <TextField
                value={values.loanAmount}
                name={`${mortgageName}.loanAmount`}
                onChange={handleChange}
                fullWidth
                placeholder="600000"
                sx={{ width: fieldWidth.m }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                error={hasError('loanAmount')}
              />
              <FieldError display={hasError('loanAmount')}>
                {getError('loanAmount')}
              </FieldError>
            </TableCellValue>
          </TableRow>
          <TableRow>
            <TableCellLabel>Interest rate:</TableCellLabel>
            <TableCellValue>
              <TextField
                value={values.interestRate}
                name={`${mortgageName}.interestRate`}
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
                error={hasError('interestRate')}
              />
              <FieldError display={hasError('interestRate')}>
                {getError('interestRate')}
              </FieldError>
            </TableCellValue>
          </TableRow>
          <TableRow>
            <TableCellLabel>Term:</TableCellLabel>
            <TableCellValue>
              <TextField
                value={values.term}
                name={`${mortgageName}.term`}
                select
                sx={{ width: fieldWidth.m }}
                onChange={handleChange}
                error={hasError('term')}
              >
                {Object.keys(MortgageTerm.props).map(n => (
                  <MenuItem key={n} value={n}>
                    {MortgageTerm.props[n].name}
                  </MenuItem>
                ))}
              </TextField>
              <FieldError display={hasError('term')}>
                {getError('term')}
              </FieldError>
            </TableCellValue>
          </TableRow>
          <TableRow>
            <TableCellLabel>Type:</TableCellLabel>
            <TableCellValue>
              <TextField
                value={values.type}
                name={`${mortgageName}.type`}
                select
                sx={{ width: fieldWidth.m }}
                onChange={handleChange}
                error={hasError('type')}
              >
                {Object.keys(MortgageType.props).map(n => (
                  <MenuItem key={n} value={n}>
                    {MortgageType.props[n].name}
                  </MenuItem>
                ))}
              </TextField>
              <FieldError display={hasError('type')}>
                {getError('type')}
              </FieldError>
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
                  name={`${mortgageName}.interestRateAdjusted`}
                  value={values.interestRateAdjusted}
                  onChange={handleChange}
                  disabled={
                    values.type === MortgageType.FixedRate || values.type === ''
                  }
                  sx={{ input: { textAlign: 'right' }, width: fieldWidth.s }}
                  placeholder="6.75"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  error={hasError('interestRateAdjusted')}
                />
              </TooltipFormField>
              <FieldError display={hasError('interestRateAdjusted')}>
                {getError('interestRateAdjusted')}
              </FieldError>
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
                  name={`${mortgageName}.closingCosts`}
                  value={values.closingCosts}
                  onChange={handleChange}
                  fullWidth
                  placeholder="2000"
                  sx={{ width: fieldWidth.s }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                  error={hasError('closingCosts')}
                />
              </TooltipFormField>
              <FieldError display={hasError('closingCosts')}>
                {getError('closingCosts')}
              </FieldError>
            </TableCellValue>
          </TableRow>
        </TableBody>
      </Table>
    </Item>
  );
}
