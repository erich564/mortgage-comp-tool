import { Stack, Typography } from '@mui/material';
import { Suspense, lazy, useState } from 'react';
import Header from './Header';
import InputForm, { formDefaults } from './InputForm';

const Report = lazy(() => import('./Report'));

export default function App() {
  const [formState, setFormState] = useState(formDefaults);
  const [doShowReport, setDoShowReport] = useState(false);

  const handleChange = e => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormState({
      ...formState,
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

    const newState = { ...formState };
    if (mortgageId !== undefined) {
      newState.mortgages.find(m => m.id === mortgageId)[name] = value;
    } else {
      newState[name] = value;
    }

    setFormState(newState);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setDoShowReport(true);
  };

  return (
    <Stack spacing={2} style={{ margin: 25, textAlign: 'center' }}>
      <Typography variant="h4" component="div">
        Mortgage Comparison Tool
      </Typography>
      <Header />
      <InputForm
        state={formState}
        handleChange={handleChange}
        handleMortgageChange={handleMortgageChange}
        handleSubmit={handleSubmit}
      />
      {doShowReport && (
        <Suspense fallback={<p>Loading...</p>}>
          <Report />
        </Suspense>
      )}
    </Stack>
  );
}
