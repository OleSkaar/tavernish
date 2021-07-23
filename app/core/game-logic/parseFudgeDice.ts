import { AbilityRank } from "db"
import {
  FudgeDiceOutput,
  FudgeDiceRange,
  FudgeDicePair,
  FudgeResultOutputRange,
} from "./rollFudgeDice"

const FudgeDiceRankValueMap: { [key in AbilityRank]: FudgeResultOutputRange } = {
  NO: -4,
  PATHETIC: -3,
  HORRIBLE: -2,
  TERRIBLE: -1,
  POOR: 0,
  MEDIOCRE: 1,
  AVERAGE: 2,
  GOOD: 3,
  GREAT: 4,
  EXCELLENT: 5,
  GODLIKE: 6,
}

const printFudgeRank = (rank: AbilityRank) => {
  switch (rank) {
    case AbilityRank.NO:
      return "nei."
    case AbilityRank.PATHETIC:
      return "patetisk"
    case AbilityRank.HORRIBLE:
      return "ynkelig"
    case AbilityRank.TERRIBLE:
      return "elendig"
    case AbilityRank.POOR:
      return "dårlig"
    case AbilityRank.MEDIOCRE:
      return "måtelig"
    case AbilityRank.AVERAGE:
      return "middels"
    case AbilityRank.GOOD:
      return "god"
    case AbilityRank.GREAT:
      return "dugelig"
    case AbilityRank.EXCELLENT:
      return "fremragende"
    case AbilityRank.GODLIKE:
      return "gudommelig"
  }
}

export const FudgeDiceRankToValue = (rank: AbilityRank) => FudgeDiceRankValueMap[rank]

export const FudgeDiceValueToRank = (value: FudgeResultOutputRange) => {
  if (value < -4) return AbilityRank.NO
  if (value > 6) return AbilityRank.GODLIKE

  return Object.keys(FudgeDiceRankValueMap).find(
    (key) => FudgeDiceRankValueMap[key] === value
  ) as AbilityRank
}

const printFudgeDiceRoll = (roll: FudgeDiceRange) => {
  switch (roll) {
    case -1:
      return "[-]"
    case 0:
      return "[ ]"
    case 1:
      return "[+]"
  }
}

const FudgeDiceResultToSymbols = (roll: FudgeDicePair) =>
  `${printFudgeDiceRoll(roll.dieOne)}${printFudgeDiceRoll(roll.dieTwo)}`

export interface FudgeDiceResult extends FudgeDiceOutput {
  userName?: string | null
  characterName: string
  abilityName: string
  timestamp: Date
}

export const printFudgeDiceResult = (result: FudgeDiceResult) => {
  const { characterName, total, abilityName, firstRoll, userName } = result
  const rank = printFudgeRank(FudgeDiceValueToRank(total))
  const firstRollSymbols = FudgeDiceResultToSymbols(firstRoll)
  const secondRollSymbols = result?.secondRoll
    ? ` & ${FudgeDiceResultToSymbols(result.secondRoll)}`
    : ""

  return `${characterName} fikk ${rank} i ${abilityName} (${firstRollSymbols}${secondRollSymbols}), trillet av: ${
    userName ?? "Anonym bruker"
  }.`
}
