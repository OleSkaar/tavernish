import { AbilityRank } from "db"
import { FudgeDiceRankToValue, FudgeDiceResult } from "./parseFudgeDice"

export type FudgeDiceRange = -1 | 0 | 1

export type FudgeResultOutputRange = -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6

export type FudgeDicePair = {
  dieOne: FudgeDiceRange
  dieTwo: FudgeDiceRange
}

function fudgeDice(): FudgeDicePair {
  const roll = () => (Math.floor(Math.random() * 3) - 1) as FudgeDiceRange

  return {
    dieOne: roll(),
    dieTwo: roll(),
  }
}

export interface FudgeDiceOutput {
  firstRoll: FudgeDicePair
  secondRoll?: FudgeDicePair
  secondRollRequired: boolean
  total: FudgeResultOutputRange
}

export function rollFudgeDice(rank: AbilityRank): FudgeDiceOutput {
  const firstRoll = fudgeDice()
  const { dieOne, dieTwo } = firstRoll

  return {
    firstRoll,
    secondRollRequired: dieOne === dieTwo && dieOne !== 0 && dieTwo !== 0,
    total: (dieOne + dieTwo + FudgeDiceRankToValue(rank)) as FudgeResultOutputRange,
  }
}

export function rollDoubleFudgeDice(previousResult: FudgeDiceResult): FudgeDiceResult {
  const secondRoll = fudgeDice()
  const { dieOne, dieTwo } = secondRoll
  const sum = dieOne + dieTwo
  const total = (
    sum === previousResult.total ? sum * 1.5 : previousResult.total
  ) as FudgeResultOutputRange

  return {
    ...previousResult,
    secondRoll,
    secondRollRequired: false,
    total,
  }
}
