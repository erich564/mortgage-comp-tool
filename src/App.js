import {
  Box,
  Button,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
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
    roi: '',
  });

  const handleChange = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <CssBaseline />
      <Stack spacing={2} style={{ margin: 15 }}>
        <Box sx={{ display: 'inline-block', textAlign: 'center' }}>
          <Typography variant="h4" component="div" gutterBottom>
            Mortgage Comparison Tool
          </Typography>
          <FormControl>
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
            <br />
            <FormLabel
              sx={{
                '&.Mui-focused': {
                  color: 'rgba(0, 0, 0, 0.6)',
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
          <MortgageForm />
          <MortgageForm />
          <br />
          <br />
          <Button variant="contained">Compare</Button>
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
