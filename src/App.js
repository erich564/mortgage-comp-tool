import { Alert, Snackbar, Stack, Typography } from '@mui/material';
import clone from 'clone';
import { Suspense, lazy, useState } from 'react';
import Form from './Form';
import { formDefaults, sampleData } from './FormData';
import { setStartDate } from './MortgageForm';
import { queryStringToState } from './common/QueryStringUtil';
import { formPadding } from './common/constants';
import Header from './header/Header';

const reportPromise = import('./Report');
const Report = lazy(() => reportPromise);

const isQueryString = () => window.location.search !== '';
const getInitialFormState = () =>
  isQueryString()
    ? queryStringToState(clone(formDefaults))
    : clone(formDefaults);

export default function App() {
  const [formState, setFormState] = useState(getInitialFormState());
  const [reportState, setReportState] = useState(clone(formState));
  const [showReport, setShowReport] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleSampleData = ndx => {
    const state = sampleData[ndx];
    for (const m of state.mortgages) setStartDate(m);
    setFormState(state);
    setShowSnackbar(true);
    setTimeout(() => {
      setReportState(clone(state));
      setShowReport(true);
    }, 0);
  };

  const handleCloseSnackbar = () => setShowSnackbar(false);

  /**
   * Crude constraint validation. Converts true/false strings to booleans,
   * and strips non-numeric characters otherwise.
   */
  const stripIllegalCharacters = str =>
    str === 'false' || str === 'true'
      ? str === 'true'
      : str.replace(/[^0-9.]/g, '');

  const handleChange = e => {
    const value =
      e.target.type === 'checkbox'
        ? e.target.checked
        : stripIllegalCharacters(e.target.value);
    setFormState({
      ...clone(formState),
      [e.target.name]: value,
    });
  };

  const handleExplicitChange = (name, value) => {
    setFormState({
      ...clone(formState),
      [name]: value,
    });
  };

  /**
   * @param data This could be an input event or a moment.
   * @param key Key in state object.
   */
  const handleMortgageChange = (mortgageId, data, key) => {
    const name = key ?? data.target.name;
    const value =
      typeof data.target.value === 'string'
        ? stripIllegalCharacters(data.target.value)
        : data.target.value;
    const newState = clone(formState);

    if (mortgageId !== undefined) {
      const mortgage = newState.mortgages.find(m => m.id === mortgageId);
      mortgage[name] = value;
      if (name === 'startDateMonth' || name === 'startDateYear') {
        setStartDate(mortgage);
      }
    } else {
      newState[name] = stripIllegalCharacters(value);
    }

    setFormState(newState);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setShowSnackbar(true);
    setShowReport(true);
    setReportState(clone(formState));
  };

  return (
    <Stack
      spacing={2}
      sx={{
        m: {
          xs: '10px',
          sm: `${formPadding}px`,
        },
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" component="div">
        <a href=".">Mortgage Comparison Tool</a>
      </Typography>
      <Header handleSampleData={handleSampleData} state={formState} />
      <br />
      This tool enables you to compare the overall value between two mortgages.
      It takes into account the time value of money and itemization of mortgage
      interest. Look at an example to better understand how this tool works.
      Each graph an explanation below it.
      <Form
        state={formState}
        handleChange={handleChange}
        handleMortgageChange={handleMortgageChange}
        handleExplicitChange={handleExplicitChange}
        handleSubmit={handleSubmit}
      />
      {showReport && (
        <Suspense fallback={<p>Loading...</p>}>
          <Report reportState={reportState} />
        </Suspense>
      )}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
      >
        <Alert elevation={6} onClose={handleCloseSnackbar} severity="success">
          Created report!
        </Alert>
      </Snackbar>
    </Stack>
  );
}
