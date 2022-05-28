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
import TooltipFormField from './common/TooltipFormField';
import { fieldWidth } from './common/constants';
import { FieldError, TableCellLabel, TableCellValue } from './common/styled';

export default function Form({ formik, handleChange }) {
  const { values, touched, errors } = formik;
  const hasError = name => touched[name] && !!errors[name];
  const getError = name => errors[name];

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
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
          value={String(values.isRefinance)}
          onChange={handleChange}
        >
          <FormControlLabel
            value="false"
            control={<Radio />}
            label="Purchasing"
          />
          <FormControlLabel
            value="true"
            control={<Radio />}
            label="Refinancing"
          />
        </RadioGroup>
        <FieldError display={hasError('isRefinance')}>
          {getError('isRefinance')}
        </FieldError>
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
        {[1, 2].map(m => (
          <MortgageForm
            formik={formik}
            key={m}
            id={m}
            handleChange={handleChange}
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
                on average per year."
              >
                <TextField
                  name="roi"
                  value={values.roi}
                  placeholder="9"
                  sx={{ input: { textAlign: 'right' }, width: fieldWidth.s }}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                  error={hasError('roi')}
                />
              </TooltipFormField>
              <FieldError display={hasError('roi')}>
                {getError('roi')}
              </FieldError>
            </TableCellValue>
          </TableRow>
        </TableBody>
      </Table>

      <br />
      <ItemizeForm
        formik={formik}
        handleChange={handleChange}
        hasError={hasError}
        getError={getError}
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
