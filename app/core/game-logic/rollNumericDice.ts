export const AllNumericDice = [10, 100, 20, 12, 8, 6, 4] as const
type NumericDiceTuple = typeof AllNumericDice
export type NumericDice = NumericDiceTuple[number]

export const rollNumericDice = (die: NumericDice) => Math.floor(Math.random() * die) + 1
