export const AllNumericDice = [4, 6, 8, 10, 12, 20, 100] as const
type NumericDiceTuple = typeof AllNumericDice
export type NumericDice = NumericDiceTuple[number]

export const rollNumericDice = (die: NumericDice) => Math.floor(Math.random() * die) + 1
