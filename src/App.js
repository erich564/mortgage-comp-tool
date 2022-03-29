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

function App() {
  const [age, setAge] = React.useState('');
  const [value, setValue] = React.useState(null);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      
        <Stack spacing={2} style={{margin: 15}}>
          <Item>
          <br />
          <CssBaseline />
          Loan origination date
          
          <DatePicker
            label="Basic example"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
          <br />
          <FormControl sx={{  minWidth: 150 }}>
            <InputLabel>Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
              defaultValue={2}
            >
              <MenuItem value={1}>15-year fixed</MenuItem>
              <MenuItem value={2}>30-year fixed</MenuItem>
              <MenuItem value={3}>10/1 ARM</MenuItem>
              <MenuItem value={4}>7/1 ARM</MenuItem>
              <MenuItem value={5}>5/1 ARM</MenuItem>
              <MenuItem value={6}>3/1 ARM</MenuItem>
            </Select>
          </FormControl>
          <br />
          <TextField
            margin="normal"
            required
            id="interest"
            label="Interest Rate"
            name="interest"
            autoComplete="interest"
          />
          <br />
          <TextField
            margin="normal"
            required
            id="term"
            label="Term"
            name="term"
            autoComplete="term"
          />
          <br /><br />
          <Button variant="contained">Compare</Button>
          </Item>
          <Item>
            <Report></Report>
          </Item>
        </Stack>
    </LocalizationProvider>
  );
}

export default App;
