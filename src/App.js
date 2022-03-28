import logo from './logo.svg';
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

function App() {
  const [age, setAge] = React.useState('');
  const [value, setValue] = React.useState(null);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <Container>
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
      </Container>
    </LocalizationProvider>
    /*<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Button variant="contained">Hello World</Button>
      </header>
    </div>*/
  );
}

export default App;
