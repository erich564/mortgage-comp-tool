import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  styled,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { useState } from 'react';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  display: 'inline-block',
  padding: '30px',
  margin: '30px',
  color: theme.palette.text.secondary,
}));

export default function MortgageForm() {
  const [state, setState] = useState({
    loanAmount: '',
    term: 2,
    type: '',
    interestRate: '',
    disbursementDate: null,
    interestRateAdjusted: '',
    closingCosts: '',
  });

  const handleChange = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <Item>
      <Box sx={{ display: 'inline-block' }}>
        <br />
        <DatePicker
          label="Disbursement Date"
          value={state.disbursementDate}
          // @ts-ignore
          name="disbursementDate"
          onChange={m => setState({ ...state, disbursementDate: m })}
          renderInput={params => <TextField {...params} />}
        />
        <br />
        <TextField
          margin="normal"
          required
          value={state.loanAmount}
          name="loanAmount"
          onChange={handleChange}
          label="Loan Amount"
          fullWidth
        />
        <br />
        <TextField
          margin="normal"
          required
          value={state.interestRate}
          name="interestRate"
          onChange={handleChange}
          label="Interest Rate"
          fullWidth
        />
        <br />
        <FormControl sx={{ minWidth: 150 }} margin="normal" fullWidth>
          <InputLabel>Term</InputLabel>
          <Select
            label="Term"
            value={state.term}
            name="term"
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
        <FormControl sx={{ minWidth: 150 }} margin="normal" fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            value={state.type}
            label="Type"
            name="type"
            onChange={handleChange}
          >
            <MenuItem value={1}>Fixed-rate</MenuItem>
            <MenuItem value={2}>10/1 ARM</MenuItem>
            <MenuItem value={3}>7/1 ARM</MenuItem>
            <MenuItem value={4}>5/1 ARM</MenuItem>
            <MenuItem value={5}>3/1 ARM</MenuItem>
          </Select>
        </FormControl>
        <br />
        <TextField
          margin="normal"
          label="Adjusted Interest Rate"
          name="interestRateAdjusted"
          value={state.interestRateAdjusted}
          onChange={handleChange}
          fullWidth
        />
        <br />
        <TextField
          margin="normal"
          label="Closing Costs"
          name="closingCosts"
          value={state.closingCosts}
          onChange={handleChange}
          fullWidth
        />
      </Box>
    </Item>
  );
}
