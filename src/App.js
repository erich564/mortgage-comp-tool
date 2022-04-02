import './App.css';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Report from './Report';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function App() {
  const [state, setState] = React.useState({
    term: '',
    type: '',
    interestRate: '',
    disbursementDate: null,
    roi: '',
  });

  const handleChange = e => {
    const value = e.target.value;
    setState({
      ...state,
      [e.target.name]: value
    });
  }

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
        <CssBaseline />
        <Stack spacing={2} style={{margin: 15}}>
          <Item>
            <Box sx={{display: 'inline-block'}}>
              <br />
              <DatePicker
                label="Disbursement Date"
                value={state.disbursementDate}
                name="disbursementDate"
                onChange={m => setState({...state, 'disbursementDate': m})}
                renderInput={params => <TextField {...params} />}
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
              <FormControl sx={{minWidth: 150}} margin="normal" fullWidth>
                <InputLabel>Term</InputLabel>
                <Select
                  label="Term"
                  value={state.term}
                  name="term"
                  onChange={handleChange}
                  defaultValue=""
                >
                  <MenuItem value={1}>40 years</MenuItem>
                  <MenuItem value={2}>30 years</MenuItem>
                  <MenuItem value={3}>20 years</MenuItem>
                  <MenuItem value={4}>15 years</MenuItem>
                  <MenuItem value={5}>10 years</MenuItem>
                </Select>
              </FormControl>
              <br />
              <FormControl sx={{minWidth: 150}} margin="normal" fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={state.type}
                  label="Type"
                  name="type"
                  onChange={handleChange}
                  defaultValue=""
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
                required
                margin="normal"
                label="ROI"
                name="roi"
                value={state.roi}
                onChange={handleChange}
                fullWidth
              />
            </Box>
            <br /><br />
            <Button variant="contained">Compare</Button>
            <br /><br />
          </Item>
          <Item>
            <Report></Report>
          </Item>
        </Stack>
    </LocalizationProvider>
  );
}