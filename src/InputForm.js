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
            '&.MuiFormLabel-root': {
              color: 'rgba(0, 0, 0, 0.87)',
            },
          }}
        >
          Are you purchasing a home or refinancing?
        </FormLabel>
        <RadioGroup
          row
          name="isRefinance"
          value={String(state.isRefinance)}
          onChange={handleChange}
        >
          <FormControlLabel
            value="false"
            control={<Radio required />}
            label="Purchasing"
          />
          <FormControlLabel
            value="true"
            control={<Radio required />}
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
