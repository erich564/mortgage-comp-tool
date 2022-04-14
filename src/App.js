import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useState } from 'react';
import './App.css';
import MortgageForm from './MortgageForm';
import Report from './Report';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function App() {
  const [state, setState] = useState({
    purchaseOrRefinance: '',
    roi: '9',
    doItemize: true,
    marginalTaxRate: '40',
  });

  const handleChange = e => {
    let { value } = e.target;
    if (e.target.type === 'checkbox') value = e.target.checked;
    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(state);
  };

  const percentWidth = '120px';

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <CssBaseline />
      <Stack spacing={2} style={{ margin: 15 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'inline-block', textAlign: 'center' }}
        >
          <Typography variant="h4" component="div" gutterBottom>
            Mortgage Comparison Tool
          </Typography>
          <br />
          <FormControl>
            <FormLabel
              sx={{
                '&.Mui-focused': {
                  color: 'rgba(0, 0, 0, 0.87)',
                },
              }}
            >
              Are you purchasing a home or refinancing?
            </FormLabel>
            <RadioGroup
              row
              name="purchaseOrRefinance"
              value={state.purchaseOrRefinance}
              onChange={handleChange}
            >
              <FormControlLabel
                value="purchasing"
                control={<Radio />}
                label="Purchasing"
              />
              <FormControlLabel
                value="refinancing"
                control={<Radio />}
                label="Refinancing"
              />
            </RadioGroup>
          </FormControl>

          <br />
          <MortgageForm id="1" />
          <MortgageForm id="2" />

          <br />
          <FormControl>
            How much do you expect investments to make on average?
            <TextField
              required
              margin="normal"
              label="ROI"
              name="roi"
              value={state.roi}
              placeholder="9"
              sx={{ input: { textAlign: 'right' }, width: percentWidth }}
              onChange={handleChange}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              InputLabelProps={{ required: false }}
            />
          </FormControl>
          <br />
          <br />
          <FormControl>
            Will you be itemizing mortgage interest?
            <br />
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
            <TextField
              margin="normal"
              label="Marginal Tax Rate"
              name="marginalTaxRate"
              value={state.marginalTaxRate}
              onChange={handleChange}
              sx={{ input: { textAlign: 'right' }, width: percentWidth }}
              placeholder="40"
              disabled={!state.doItemize}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </FormControl>

          <br />
          <br />
          <Button variant="contained" type="submit">
            Compare
          </Button>
          <br />
          <br />
        </Box>

        <Item>
          <Report />
        </Item>
      </Stack>
    </LocalizationProvider>
  );
}
