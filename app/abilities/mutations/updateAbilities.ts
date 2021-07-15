import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { UpdateAbility } from "./updateAbility"

export const UpdateAbilities = z.array(UpdateAbility)

export default resolver.pipe(resolver.zod(UpdateAbilities), resolver.authorize(), async (data) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const ability = await db.ability.updateMany({ data })

  return ability
})
