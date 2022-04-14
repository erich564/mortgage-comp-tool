import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import MortgageType from './MortgageType';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'left',
  display: 'inline-block',
  padding: '30px',
  margin: '30px',
  color: theme.palette.text.secondary,
}));

export default function MortgageForm({ handleMortgageChange, data }) {
  const handleChange = e => {
    handleMortgageChange(data.id, e);
  };
  const handleDateChange = (e, key) => {
    handleMortgageChange(data.id, e, key);
  };

  const skinnyWidth = '150px';
  const gutterWidth = '24px';

  return (
    <Item>
      <Box sx={{ display: 'inline-block' }}>
        <Typography
          variant="h5"
          component="div"
          gutterBottom
          sx={{ textAlign: 'center' }}
        >
          Mortgage {data.id}
        </Typography>

        <DatePicker
          label="Start Date"
          value={data.startDate}
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
              margin="normal"
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
        <TextField
          margin="normal"
          required
          value={data.loanAmount}
          name="loanAmount"
          onChange={handleChange}
          label="Loan Amount"
          fullWidth
          placeholder="600000"
          sx={{ width: skinnyWidth }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          InputLabelProps={{ required: false }}
        />
        <br />
        <TextField
          margin="normal"
          required
          value={data.interestRate}
          name="interestRate"
          onChange={handleChange}
          label="Interest Rate"
          fullWidth
          sx={{
            input: { textAlign: 'right' },
            width: skinnyWidth,
            mr: gutterWidth,
          }}
          placeholder="4.25"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
          InputLabelProps={{ required: false }}
        />
        <FormControl sx={{ minWidth: 150 }} margin="normal">
          <InputLabel>Term</InputLabel>
          <Select
            label="Term"
            value={data.term}
            name="term"
            sx={{ width: skinnyWidth }}
            onChange={handleChange}
          >
            <MenuItem value={1}>40 years</MenuItem>
            <MenuItem value={2}>30 years</MenuItem>
            <MenuItem value={3}>20 years</MenuItem>
            <MenuItem value={4}>15 years</MenuItem>
            <MenuItem value={5}>10 years</MenuItem>
          </Select>
        </FormControl>
        <br />
        <FormControl sx={{ minWidth: 150 }} margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={data.type}
            label="Type"
            name="type"
            required
            sx={{ width: skinnyWidth, mr: gutterWidth }}
            onChange={handleChange}
          >
            <MenuItem value={MortgageType.FixedRate}>Fixed-rate</MenuItem>
            <MenuItem value={MortgageType.Arm10_1}>10/1 ARM</MenuItem>
            <MenuItem value={MortgageType.Arm7_1}>7/1 ARM</MenuItem>
            <MenuItem value={MortgageType.Arm5_1}>5/1 ARM</MenuItem>
            <MenuItem value={MortgageType.Arm3_1}>3/1 ARM</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          label="Adj. Int. Rate"
          name="interestRateAdjusted"
          value={data.interestRateAdjusted}
          onChange={handleChange}
          sx={{ input: { textAlign: 'right' }, width: skinnyWidth }}
          placeholder="6.75"
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
          }}
        />
        <br />
        <TextField
          margin="normal"
          label="Closing Costs"
          name="closingCosts"
          value={data.closingCosts}
          onChange={handleChange}
          fullWidth
          placeholder="2000"
          sx={{ width: skinnyWidth }}
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
        />
      </Box>
    </Item>
  );
}
