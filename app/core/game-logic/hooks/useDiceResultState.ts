import { useState } from "react"

export interface DiceResultState {
  result: string
  timestamp: Date | null
}

export function useDiceResultState() {
  const [diceResult, setDiceResult] = useState<DiceResultState>({
    result: "",
    timestamp: null,
  })

  return {
    diceResult,
    setDiceResult,
  }
}
