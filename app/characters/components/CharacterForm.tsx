import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function CharacterForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="name" label="Name" placeholder="Navn" />
      <LabeledTextField name="flaw" label="Lyte" placeholder="Lyte" />
      <LabeledTextField name="rank" label="Rang" placeholder="Rang" />
      <LabeledTextField name="titles" label="Titler" placeholder="Titler" />
    </Form>
  )
}
