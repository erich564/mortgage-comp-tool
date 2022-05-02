const MortgageType = {
  FixedRate: '1',
  _10_1_Arm: '2',
  _7_1_Arm: '3',
  _5_1_Arm: '4',
  _3_1_Arm: '5',
  props: {
    1: { name: 'Fixed-rate' },
    2: { name: '10/1 ARM', yearsFixed: 10 },
    3: { name: '7/1 ARM', yearsFixed: 7 },
    4: { name: '5/1 ARM', yearsFixed: 5 },
    5: { name: '3/1 ARM', yearsFixed: 3 },
  },
};

export default MortgageType;
