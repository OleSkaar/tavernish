import { resolver } from "blitz"
import db, { AbilityRank } from "db"
import { z } from "zod"

const CreateAbility = z.object({
  name: z.string(),
  ranking: z.nativeEnum(AbilityRank),
  isBioAbility: z.boolean(),
})

export default resolver.pipe(resolver.zod(CreateAbility), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const ability = await db.ability.create({ data: input })

  return ability
})
