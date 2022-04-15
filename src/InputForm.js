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
  TextField,
} from '@mui/material';
import MortgageForm from './MortgageForm';
import MortgageTerm from './MortgageTerm';

// const mortgageTemplate = {
//   loanAmount: '417000',
//   term: MortgageTerm._30_years,
//   type: MortgageType._7_1_Arm,
//   interestRate: 2.75,
//   startDate: moment(),
//   interestRateAdjusted: 5.75,
//   closingCosts: 2005,
// };

// const [state, setState] = useState({
//   purchaseOrRefinance: 'purchase',
//   roi: '9',
//   doItemize: true,
//   marginalTaxRate: '40',
//   mortgages: [1, 2].map(n => ({
//     ...mortgageTemplate,
//     id: n,
//   })),
//   doShowReport: false,
// });

const mortgageTemplate = {
  loanAmount: '',
  term: MortgageTerm._30_years,
  type: '',
  interestRate: '',
  startDate: null,
  interestRateAdjusted: '',
  closingCosts: '',
};

export const formDefaults = {
  purchaseOrRefinance: '',
  roi: '9',
  doItemize: true,
  marginalTaxRate: '40',
  mortgages: [1, 2].map(n => ({
    ...mortgageTemplate,
    id: n,
  })),
  doGenerateReport: false,
};

const inputWidth = '120px';

export default function InputForm({
  state,
  handleChange,
  handleMortgageChange,
  handleSubmit,
}) {
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
          sx={{ input: { textAlign: 'right' }, width: inputWidth }}
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
          sx={{ input: { textAlign: 'right' }, width: inputWidth }}
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
  );
}
