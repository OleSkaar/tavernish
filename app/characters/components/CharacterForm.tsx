import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"
import { AbilityRank } from "@prisma/client"
import { parseAbilityRank } from "app/core/utils/parseAbilityRank"
import React from "react"
import { FieldArray } from "react-final-form-arrays"
import { Field } from "react-final-form"

export function CharacterForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const newCharacterAbilityRanks = ["GREAT", "GOOD", "AVERAGE", "MEDICORE", "POOR"]

  // as any used as workaround here for TypeScript error
  const { abilities } = props.initialValues as any

  const renderFieldArray = () => {
    return (
      <>
        <FieldArray name="abilities">
          {({ fields }) => (
            <div>
              {abilities && abilities.forEach((ability) => () => fields.push({ ability }))}
              {newCharacterAbilityRanks.map((rank, index) => (
                <div key={index}>
                  <h3>{parseAbilityRank(AbilityRank[rank])}</h3>
                  {fields.map(
                    (fieldArrayName, index) =>
                      fields.value[index].ranking === rank && (
                        <div key={fieldArrayName}>
                          <div>
                            <label>Evne</label>
                            <Field name={`${fieldArrayName}.name`} component="input" />
                          </div>
                          <div>
                            <label>Bioevne?</label>
                            <Field
                              name={`${fieldArrayName}.isBioAbility`}
                              component="input"
                              type="checkbox"
                            />
                          </div>
                          {/* TODO Style this hidden field properly */}
                          <Field
                            name={`${fieldArrayName}.ranking`}
                            component="input"
                            initialValue={rank}
                            style={{ display: "none" }}
                          />
                          <button type="button" onClick={() => fields.remove(index)}>
                            ✖️
                          </button>
                        </div>
                      )
                  )}
                  <button
                    type="button"
                    onClick={() => fields.push({ name: "", isBioAbility: false, ranking: rank })}
                  >
                    ➕
                  </button>
                </div>
              ))}
            </div>
          )}
        </FieldArray>
      </>
    )
  }

  return (
    <Form<S> {...props} renderExtraFields={renderFieldArray}>
      <LabeledTextField name="name" label="Navn" placeholder="Navn" />
      <LabeledTextField name="flaw" label="Lyte" placeholder="Lyte" />
      <LabeledTextField name="rank" label="Rang" placeholder="Rang" />
      <LabeledTextField name="titles" label="Titler" placeholder="Titler" />
      <hr />
      <h2>Evner</h2>
    </Form>
  )
}
