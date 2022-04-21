import clone from 'clone';
import flat, { unflatten } from 'flat';
import moment from 'moment';
import queryString from 'query-string';
import { MOMENT_FORMAT } from './FormData';
import merge from './Merge';

const { url: baseUrl } = queryString.parseUrl(window.location.href);

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
  let newState = formDefaults;
  const qsState = unflatten(
    queryString.parse(window.location.search, { parseBooleans: true })
  );
  newState = merge(newState, qsState);
  for (const m of newState.mortgages) {
    m.isStartDateChanged = m.startDate !== null;
    m.startDate = moment(m.startDate, MOMENT_FORMAT);
    m.id = +m.id;
  }
  newState.mortgages = newState.mortgages.sort((a, b) => a.id - b.id);
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
