import deepmerge from 'deepmerge';

const moment = require('moment');

/**
 * Array merging strategy do deepmerge mergable objects at each index.
 */
const combineMerge = (target, source, options) => {
  const destination = target.slice();

  source.forEach((item, index) => {
    if (typeof destination[index] === 'undefined') {
      destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
    } else if (options.isMergeableObject(item)) {
      destination[index] = deepmerge(target[index], item, options);
    } else if (target.indexOf(item) === -1) {
      destination.push(item);
    }
  });
  return destination;
};

export default function merge(x, y) {
  return deepmerge(x, y, { arrayMerge: combineMerge });
}

export const getStartDate = (month, year) => {
  if (
    month !== undefined &&
    year !== undefined &&
    month !== '' &&
    year !== ''
  ) {
    return moment(`${month}/${year}`, 'MM/YYYY');
  }
  return undefined;
};
