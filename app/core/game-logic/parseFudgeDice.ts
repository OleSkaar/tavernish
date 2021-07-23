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

export const fudgeDiceRankToValue = (rank: AbilityRank) => FudgeDiceRankValueMap[rank]

export const fudgeDiceValueToRank = (value: FudgeResultOutputRange) => {
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

export const fudgeDiceResultToSymbols = (roll: FudgeDicePair) =>
  `${printFudgeDiceRoll(roll.dieOne)}${printFudgeDiceRoll(roll.dieTwo)}`

export interface FudgeDiceResult extends FudgeDiceOutput {
  userName?: string | null
  characterName: string
  abilityName: string
}

export const printFudgeDiceResult = (result: FudgeDiceResult) => {
  const { characterName, total, abilityName, firstRoll, userName } = result
  const rank = printFudgeRank(fudgeDiceValueToRank(total))
  const firstRollSymbols = fudgeDiceResultToSymbols(firstRoll)
  const secondRollSymbols = result?.secondRoll
    ? ` & ${fudgeDiceResultToSymbols(result.secondRoll)}`
    : ""

  return `${characterName} fikk ${rank} i ${abilityName} (${firstRollSymbols}${secondRollSymbols}), trillet av: ${
    userName ?? "Anonym bruker"
  }.`
}

export const parseGeneralFudgeDiceResult = (
  output: FudgeDiceOutput,
  characterName?: string,
  userName?: string | null
) => {
  const { firstRoll, total } = output
  const rank = printFudgeRank(fudgeDiceValueToRank(total))
  const rollSymbols = fudgeDiceResultToSymbols(firstRoll)
  const parsedResult = `${rank} på 2df (${rollSymbols})`
  const user = userName ? userName : "Anonym bruker"

  if (characterName) {
    return `${characterName} fikk ${parsedResult}, trillet av ${user}.`
  } else {
    return `${user} trillet ${parsedResult}.`
  }
}
