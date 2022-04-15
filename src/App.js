import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import { Suspense, lazy, useState } from 'react';
import Header from './Header';
import MortgageForm from './MortgageForm';
import MortgageTerm from './MortgageTerm';
import MortgageType from './MortgageType';

const Report = lazy(() => import('./Report'));

export default function App() {
  // const mortgageTemplate = {
  //   loanAmount: '',
  //   term: MortgageTerm._30_years,
  //   type: '',
  //   interestRate: '',
  //   startDate: null,
  //   interestRateAdjusted: '',
  //   closingCosts: '',
  // };

  // const [state, setState] = useState({
  //   purchaseOrRefinance: '',
  //   roi: '9',
  //   doItemize: true,
  //   marginalTaxRate: '40',
  //   mortgages: [1, 2].map(n => ({
  //     ...mortgageTemplate,
  //     id: n,
  //   })),
  //   doGenerateReport: false,
  // });
  const mortgageTemplate = {
    loanAmount: '417000',
    term: MortgageTerm._30_years,
    type: MortgageType._7_1_Arm,
    interestRate: 2.75,
    startDate: moment(),
    interestRateAdjusted: 5.75,
    closingCosts: 2005,
  };

  const [state, setState] = useState({
    purchaseOrRefinance: 'purchase',
    roi: '9',
    doItemize: true,
    marginalTaxRate: '40',
    mortgages: [1, 2].map(n => ({
      ...mortgageTemplate,
      id: n,
    })),
    doShowReport: false,
  });

  const handleChange = e => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  /**
   *
   * @param mortgageId
   * @param data This could be an input event or a moment.
   * @param key Key in state object.
   */
  const handleMortgageChange = (mortgageId, data, key) => {
    const name = key ?? data.target.name;
    let value;
    if (key) {
      value = data;
    } else if (data.target.type === 'checkbox') {
      value = data.target.checked;
    } else {
      value = data.target.value;
    }

    const newState = { ...state };
    if (mortgageId !== undefined) {
      newState.mortgages.find(m => m.id === mortgageId)[name] = value;
    } else {
      newState[name] = value;
    }

    setState(newState);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setState({
      ...state,
      doShowReport: true,
    });
  };

  const percentWidth = '120px';

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
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
          <Header />
          <br />
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
          {state.mortgages.map(m => (
            <MortgageForm
              key={m.id}
              handleMortgageChange={handleMortgageChange}
              state={m}
            />
          ))}
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
        {state.doShowReport && (
          <Suspense fallback={<p>Loading...</p>}>
            <Report />
          </Suspense>
        )}
      </Stack>
    </LocalizationProvider>
  );
}
