import { Button } from "app/core/components/Button"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { sendMessageToDiscord } from "app/core/webhooks/discord"
import React, { useState } from "react"
import { DiceResultState } from "../hooks/useDiceResultState"
import { parseGeneralFudgeDiceResult } from "../parseFudgeDice"
import { parseNumericDiceResult } from "../parseNumericDice"
import { rollFudgeDice } from "../rollFudgeDice"
import { AllNumericDice, NumericDice, rollNumericDice } from "../rollNumericDice"

interface GeneralDiceRollerProps {
  characterName?: string
  setDiceResult: (state: DiceResultState) => void
}

const GeneralDiceRoller = ({ characterName, setDiceResult }: GeneralDiceRollerProps) => {
  const currentUser = useCurrentUser()

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
    <div className="space-y-4">
      <h2 className="text-2xl">Generelle terninger</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button text={"2df"} onClick={() => handleFudgeDiceRoll()} color={"grey"} />
        {AllNumericDice.map((die) => (
          <Button
            key={`d${die}`}
            text={`d${die}`}
            onClick={() => handleDiceRoll(die)}
            color={"grey"}
          />
        ))}
      </div>
    </div>
  )
}

export default GeneralDiceRoller
