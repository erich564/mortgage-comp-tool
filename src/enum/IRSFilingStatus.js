const IRSFilingStatus = {
  Single: '1',
  MarriedFilingJointly: '2',
  MarriedFilingSeparately: '3',
  HeadOfHousehold: '4',
  Widower: '5',
  props: {
    1: { name: 'Single', saltLimit: 10000 },
    2: { name: 'Married, Filing Jointly', saltLimit: 10000 },
    3: { name: 'Married, Filing Separately', saltLimit: 5000 },
    4: { name: 'Head of Household', saltLimit: 10000 },
    5: { name: 'Qualifying Widower', saltLimit: 10000 },
  },
};

export default IRSFilingStatus;
