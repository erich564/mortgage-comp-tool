import { Alert, Snackbar, Stack, Typography } from '@mui/material';
import clone from 'clone';
import { Suspense, lazy, useState } from 'react';
import { formDefaults, sampleData } from './FormData';
import InputForm from './InputForm';
import { queryStringToState } from './QueryStringUtil';
import Header from './header/Header';

const reportPromise = import('./Report');
const Report = lazy(() => reportPromise);

export default function App() {
  const isQueryString = window.location.search !== '';
  const initialFormState = isQueryString
    ? queryStringToState(clone(formDefaults))
    : clone(formDefaults);
  const [formState, setFormState] = useState(initialFormState);
  const [reportState, setReportState] = useState(clone(formDefaults));
  const [showReport, setShowReport] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleSampleData = ndx => setFormState(sampleData[ndx]);

  const handleCloseSnackbar = () => setShowSnackbar(false);

  /** Crude constraint validation. */
  const stripIllegalCharacters = str =>
    str === 'false' || str === 'true' ? str : str.replace(/[^0-9.]/g, '');

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
   *
   * @param mortgageId
   * @param data This could be an input event or a moment.
   * @param key Key in state object.
   */
  const handleMortgageChange = (mortgageId, data, key) => {
    const name = key ?? data.target.name;
    let value;
    // if true, then is start date field and data is a moment
    if (key) {
      value = data;
    } else if (data.target.type === 'checkbox') {
      value = data.target.checked;
    } else {
      value = stripIllegalCharacters(data.target.value);
    }

    const newState = clone(formState);

    if (mortgageId !== undefined) {
      const mortgage = newState.mortgages.find(m => m.id === mortgageId);
      mortgage[name] = value;

      // if key, data is a moment
      if (key) {
        mortgage.isStartDateChanged = true;
        if (newState.isRefinance !== true) {
          for (const m of newState.mortgages) {
            // set start date of other mortgage to same value if not refinance and
            // user has not changed it already
            if (!m.isStartDateChanged) {
              m[name] = value;
            }
          }
        }
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
    <Stack spacing={2} style={{ margin: 25, textAlign: 'center' }}>
      <Typography variant="h4" component="div">
        Mortgage Comparison Tool
      </Typography>
      <Header handleSampleData={handleSampleData} state={formState} />
      <InputForm
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
