import { Alert, Snackbar, Stack } from '@mui/material';
import clone from 'clone';
import { useFormik } from 'formik';
import { Suspense, lazy, useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import Form from './Form';
import { formDefaults, sampleData } from './FormData';
import { queryStringToState } from './common/QueryStringUtil';
import { formPadding } from './common/constants';
import { getStartDate } from './common/utility';
import Header from './header/Header';
import { validationSchema } from './validation';

const reportPromise = import('./Report');
const Report = lazy(() => reportPromise);

export default function App() {
  const initialFormState =
    window.location.search !== ''
      ? queryStringToState(clone(formDefaults))
      : clone(formDefaults);
  const [reportState, setReportState] = useState(initialFormState);
  const [showReport, setShowReport] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
  const [reportCount, setReportCount] = useState(0);

  const handleError = () => {
    setShowSuccessSnackbar(false);
    setShowErrorSnackbar(true);
  };

  const formik = useFormik({
    initialValues: initialFormState,
    validationSchema,
    onSubmit: (values, actions) => {
      setReportCount(reportCount + 1);
      setReportState(clone(values));
      setShowSuccessSnackbar(true);
      setShowReport(true);
      actions.setSubmitting(false);
    },
  });

  const handleSampleData = ndx => {
    const data = sampleData[ndx];
    data.mortgage1.startDate = getStartDate(
      data.mortgage1.startDateMonth,
      data.mortgage1.startDateYear
    );
    data.mortgage2.startDate = getStartDate(
      data.mortgage2.startDateMonth,
      data.mortgage2.startDateYear
    );
    formik.setValues(data);
    setShowReport(false);
    setReportCount(reportCount + 1);
    setReportState(clone(data));
    // setTimeout to allow UI to catch up before showing report
    setTimeout(() => {
      setShowSuccessSnackbar(true);
      setShowReport(true);
    }, 0);
  };

  const handleChange = e => {
    const { name } = e.target;
    let { value } = e.target;

    if (e.target.type === 'radio') {
      value = value === 'true';
    } else if (e.target.type === 'checkbox') {
      value = e.target.checked;
    } else if (typeof value === 'string' || value instanceof String) {
      value = value.replace(/[^0-9.]/g, '');
    }

    formik.setFieldValue(name, value);

    if (name.endsWith('startDateMonth') || name.endsWith('startDateYear')) {
      const [mortgageName, fieldName] = name.split('.');
      const mortgage = formik.values[mortgageName];
      mortgage[fieldName] = value;
      const startDate = getStartDate(
        mortgage.startDateMonth,
        mortgage.startDateYear
      );
      formik.setFieldValue(`${mortgageName}.startDate`, startDate);
    }
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
      <Header formState={formik.values} handleSampleData={handleSampleData} />
      <Form formik={formik} handleChange={handleChange} />

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
