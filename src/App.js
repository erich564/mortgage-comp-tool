import { Stack, Typography } from '@mui/material';
import clone from 'clone';
import { Suspense, lazy, useState } from 'react';
import { formDefaults, sampleData } from './FormData';
import Header from './Header';
import InputForm from './InputForm';
import { queryStringToState } from './QueryStringUtil';

const Report = lazy(() => import('./Report'));

export default function App() {
  const isQueryString = window.location.search !== '';
  const initialFormState = isQueryString
    ? queryStringToState(clone(formDefaults))
    : clone(formDefaults);
  const [formState, setFormState] = useState(initialFormState);
  const [reportState, setReportState] = useState(clone(formDefaults));
  const [doShowReport, setDoShowReport] = useState(false);

  const handleSampleData = ndx => setFormState(sampleData[ndx]);

  const handleChange = e => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormState({
      ...clone(formState),
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

    const newState = clone(formState);
    // if true, then is start date field
    if (mortgageId !== undefined) {
      const mortgage = newState.mortgages.find(m => m.id === mortgageId);
      mortgage[name] = value;
      mortgage.isStartDateChanged = true;
      if (newState.isRefinance !== true)
        for (const m of newState.mortgages) {
          // set start date of other mortgage to same value if not refinance and
          // user has not changed it already
          if (!m.isStartDateChanged) {
            m[name] = value;
          }
        }
    } else {
      newState[name] = value;
    }

    setFormState(newState);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setDoShowReport(true);
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
        handleSubmit={handleSubmit}
      />
      {doShowReport && (
        <Suspense fallback={<p>Loading...</p>}>
          <Report reportState={reportState} />
        </Suspense>
      )}
    </Stack>
  );
}
