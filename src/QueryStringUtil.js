import clone from 'clone';
import flat, { unflatten } from 'flat';
import { merge } from 'highcharts';
import moment from 'moment';
import queryString from 'query-string';
import { MOMENT_FORMAT } from './FormData';

// eslint-disable-next-line no-unused-vars
const { url: baseUrl, query: initialQuery } = queryString.parseUrl(
  window.location.href
);

/*
const map = new Map();

const mappings = [
  ['isRefinance', 're'],
  ['roi', 'r'],
  ['mortgages', 'm'],
  ['doItemize', 'i'],
  ['marginalTaxRate', 'mtr'],
  ['id', 'id'],
  ['loanAmount', 'la'],
  ['term', 't'],
  ['type', 'y'],
  ['interestRate', 'ir'],
  ['startDate', 'sd'],
  ['interestRateAdjusted', 'ira'],
  ['closingCosts', 'cc'],
];

for (const arr of mappings) {
  map.set(arr[0], arr[1]);
  map.set(arr[1], arr[0]);
}

const translatePropertyNames = state => {
  const newState = {};
  // eslint-disable-next-line guard-for-in
  for (const prop in state) {
    if (map.has(prop)) {
      let value;
      if (Array.isArray(state[prop])) {
        value = state[prop].map(obj => translatePropertyNames(obj));
      } else {
        value = state[prop];
      }

      newState[map.get(prop)] = value;
    } else throw new Error(`Property ${prop} not in mappings.`);
  }
  return newState;
};
*/

export const queryStringToState = formDefaults => {
  const newState = formDefaults;
  const qsState = unflatten(
    queryString.parse(window.location.search, { parseBooleans: true })
  );
  merge(true, newState, qsState);
  for (const m of newState.mortgages) {
    m.isStartDateChanged = m.startDate !== null;
    m.startDate = moment(m.startDate, MOMENT_FORMAT);
    m.id = +m.id;
    m.interestRateAdjusted ??= '';
  }
  return newState;
};

export const stateToQueryStringUrl = pState => {
  const state = clone(pState);
  for (const m of state.mortgages) {
    if (m.startDate) {
      m.startDate = m.startDate.format(MOMENT_FORMAT);
    }
    delete m.isStartDateChanged;
  }
  const flatState = flat(state);
  const qs = queryString.stringify(flatState, {
    skipEmptyString: true,
    skipNull: true,
  });
  return `${baseUrl}?${qs}`;
};
