import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { sendMessageToDiscord } from "app/core/webhooks/discord"
import React, { useState } from "react"
import { parseGeneralFudgeDiceResult } from "../parseFudgeDice"
import { parseNumericDiceResult } from "../parseNumericDice"
import { rollFudgeDice } from "../rollFudgeDice"
import { AllNumericDice, NumericDice, rollNumericDice } from "../rollNumericDice"

interface NumericDiceRollerProps {
  characterName?: string
}

interface NumericDiceRollerState {
  result: string
  timestamp: Date | null
}

const NumericDiceRoller = ({ characterName }: NumericDiceRollerProps) => {
  const currentUser = useCurrentUser()
  const [diceResult, setDiceResult] = useState<NumericDiceRollerState>({
    result: "",
    timestamp: null,
  })

  const handleDiceRoll = (die: NumericDice) => {
    const total = rollNumericDice(die)
    const timestamp = new Date()
    const result = parseNumericDiceResult({
      userName: currentUser?.name,
      characterName,
      total,
      die,
      timestamp,
    })

    setDiceResult({ result, timestamp })

    sendMessageToDiscord(result)

    return undefined
  }

  const handleFudgeDiceRoll = () => {
    const roll = rollFudgeDice()
    const timestamp = new Date()

    const result = parseGeneralFudgeDiceResult(roll, characterName, currentUser?.name)

    setDiceResult({ result, timestamp })
    sendMessageToDiscord(result)
  }

  return (
    <div>
      {diceResult && (
        <div>
          {diceResult?.timestamp && (
            <p>
              {diceResult.timestamp.toLocaleDateString("no-nb")}{" "}
              {diceResult.timestamp.toLocaleTimeString("no-nb")}
            </p>
          )}
          <p>{diceResult.result}</p>
        </div>
      )}
      {<button onClick={() => handleFudgeDiceRoll()}>2df</button>}
      {AllNumericDice.map((die) => (
        <button key={`${die}`} onClick={() => handleDiceRoll(die)}>
          d{die}
        </button>
      ))}
    </div>
  )
}

export default NumericDiceRoller
