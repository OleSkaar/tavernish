import { NumericDice } from "./rollNumericDice"

export interface NumericDiceResult {
  userName?: string | null
  characterName?: string
  timestamp: Date
  total: number
  die: NumericDice
}

export const parseNumericDiceResult = (result: NumericDiceResult) => {
  const { total, die } = result
  const user = result?.userName ? result.userName : "Anonym bruker"
  const parsedResult = `[${total}] på en d${die}`

  if (result?.characterName) {
    return `${result.characterName} fikk ${parsedResult}, trillet av ${user}.`
  } else {
    return `${user} trillet ${parsedResult}.`
  }
}
