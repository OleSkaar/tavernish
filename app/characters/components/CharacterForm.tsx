import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"
import { AbilityRank } from "@prisma/client"
import { parseAbilityRank } from "app/core/utils/parseAbilityRank"
import { useState } from "react"
import { AbilityInput } from "app/core/types/ability"

// See https://goshakkk.name/array-form-inputs/

export function CharacterForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [state, setState] = useState(Array<AbilityInput>())

  const newCharacterAbilityRanks = [
    AbilityRank.GREAT,
    AbilityRank.GOOD,
    AbilityRank.AVERAGE,
    AbilityRank.MEDICORE,
    AbilityRank.POOR,
  ]

  const handleInputChange = (idx) => (evt) => {
    const isCheckbox = evt.target.type === "checkbox"
    const newAbilities = state.map((ability, abilityIdx) => {
      if (idx !== abilityIdx) return ability
      if (isCheckbox) return { ...ability, isBioAbility: evt.target.checked }
      else return { ...ability, name: evt.target.value }
    })

    setState(newAbilities)
  }

  const handleAddAbility = (ranking: AbilityRank) => {
    setState(state.concat([{ name: "", ranking: ranking, isBioAbility: false }]))
    return undefined
  }

  const handleRemoveAbility = (idx) => () => {
    setState(state.filter((s, sidx) => idx !== sidx))
  }

  const renderAbilities = (rank: AbilityRank) => {
    const abilitiesOfRank = state.filter((ability) => ability.ranking === rank)

    return (
      <div key={rank}>
        <h3>{parseAbilityRank(rank)}</h3>
        {abilitiesOfRank.map((ability, idx) => {
          const indexInState = state.indexOf(ability)

          return (
            <div key={idx}>
              <input
                type="text"
                placeholder={"Kort beskrivelse"}
                value={ability.name}
                onChange={handleInputChange(indexInState)}
              />
              <input type="checkbox" onChange={handleInputChange(indexInState)} />
              <button type="button" onClick={handleRemoveAbility(indexInState)} className="small">
                -
              </button>
            </div>
          )
        })}
        <button type="button" onClick={() => handleAddAbility(rank)} className="small">
          ➕
        </button>
      </div>
    )
  }

  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Navn" placeholder="Navn" />
      <LabeledTextField name="flaw" label="Lyte" placeholder="Lyte" />
      <LabeledTextField name="rank" label="Rang" placeholder="Rang" />
      <LabeledTextField name="titles" label="Titler" placeholder="Titler" />
      <hr />
      {newCharacterAbilityRanks.map((rank) => renderAbilities(rank))}
    </Form>
  )
}
