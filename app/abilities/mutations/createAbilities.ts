import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { CreateAbility } from "./createAbility"

export const CreateAbilities = z.array(CreateAbility)

export default resolver.pipe(resolver.zod(CreateAbilities), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const ability = await db.ability.createMany({ data: input })

  return ability
})
