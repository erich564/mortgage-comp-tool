export const MortgageType = {
  FixedRate: 'Fixed-rate',
  _10_1_Arm: '10/1 ARM',
  _7_1_Arm: '7/1 ARM',
  _5_1_Arm: '5/1 ARM',
  _3_1_Arm: '3/1 ARM',
};

export const yearsUntilFirstAdjust = t => {
  switch (t) {
    case MortgageType._10_1_Arm:
      return 10;
    case MortgageType._7_1_Arm:
      return 7;
    case MortgageType._5_1_Arm:
      return 5;
    case MortgageType._3_1_Arm:
      return 3;
    default:
      throw new Error('invalid MortgageType!');
  }
};
