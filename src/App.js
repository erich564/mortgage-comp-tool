import { Alert, Snackbar, Stack, Typography } from '@mui/material';
import clone from 'clone';
import { Suspense, lazy, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
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
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [reportCount, setReportCount] = useState(0);

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

  const handleSampleData = ndx => {
    const state = sampleData[ndx];
    for (const m of state.mortgages) setStartDate(m);
    setFormState(state);
    setShowReport(false);
    setReportCount(reportCount + 1);
    setReportState(clone(state));
    // setTimeout to allow UI to catch up before showing report
    setTimeout(() => {
      setShowSuccessSnackbar(true);
      setShowReport(true);
    }, 0);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setReportCount(reportCount + 1);
    setReportState(clone(formState));
    setShowSuccessSnackbar(true);
    setShowReport(true);
  };

  const handleError = () => {
    setShowSuccessSnackbar(false);
    setShowErrorSnackbar(true);
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
        <a href="." target="_blank" className="animated-hover">
          Mortgage Comparison Tool
        </a>
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
      <ErrorBoundary key={reportCount} handleError={handleError}>
        {showReport && (
          <Suspense fallback={<p>Loading...</p>}>
            <Report reportState={reportState} />
          </Suspense>
        )}
      </ErrorBoundary>
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSuccessSnackbar(false)}
      >
        <Alert
          elevation={6}
          onClose={() => setShowSuccessSnackbar(false)}
          severity="success"
        >
          Created report!
        </Alert>
      </Snackbar>
      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowErrorSnackbar(false)}
      >
        <Alert
          elevation={6}
          onClose={() => setShowErrorSnackbar(false)}
          severity="error"
        >
          An error occurred.
        </Alert>
      </Snackbar>
    </Stack>
  );
}
