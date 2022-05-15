import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableRow,
  TextField,
} from '@mui/material';
import ItemizeForm from './ItemizeForm';
import MortgageForm from './MortgageForm';
import TooltipFormField from './TooltipFormField';
import { fieldWidth } from './common/constants';
import { TableCellLabel, TableCellValue } from './common/styled';

export default function InputForm({
  state,
  handleChange,
  handleMortgageChange,
  handleExplicitChange,
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
      <Box
        sx={{
          display: 'flex',
          textAlign: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '45px',
          my: 3,
        }}
      >
        {state.mortgages.map(m => (
          <MortgageForm
            key={m.id}
            handleMortgageChange={handleMortgageChange}
            state={m}
            isRefinance={state.isRefinance}
          />
        ))}
      </Box>

      <Table sx={{ margin: 'auto', width: 'auto' }}>
        <TableBody>
          <TableRow>
            <TableCellLabel sx={{ width: 'auto' }}>
              Return on investment (ROI):
            </TableCellLabel>
            <TableCellValue>
              <TooltipFormField
                tooltip="How much you expect investments to make
              per year, on average."
              >
                <TextField
                  required
                  name="roi"
                  value={state.roi}
                  placeholder="9"
                  sx={{ input: { textAlign: 'right' }, width: fieldWidth.s }}
                  onChange={handleChange}
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
        </TableBody>
      </Table>

      <br />
      <ItemizeForm
        state={state}
        handleChange={handleChange}
        handleExplicitChange={handleExplicitChange}
      />

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
