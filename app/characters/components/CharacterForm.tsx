import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"
import { AbilityRank } from "@prisma/client"
import { useAbilityRank } from "app/core/hooks/useAbilityRank"

export function CharacterForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Navn" />
      <LabeledTextField name="flaw" label="Lyte" placeholder="Lyte" />
      <LabeledTextField name="rank" label="Rang" placeholder="Rang" />
      <LabeledTextField name="titles" label="Titler" placeholder="Titler" />
      <h3>{useAbilityRank(AbilityRank.GREAT)}</h3>
      <h3>{useAbilityRank(AbilityRank.GOOD)}</h3>
      <h3>{useAbilityRank(AbilityRank.AVERAGE)}</h3>
      <h3>{useAbilityRank(AbilityRank.MEDICORE)}</h3>
      <h3>{useAbilityRank(AbilityRank.POOR)}</h3>
    </Form>
  )
}
