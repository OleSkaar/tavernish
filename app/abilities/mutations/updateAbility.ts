import { resolver } from "blitz"
import db, { AbilityRank } from "db"
import { z } from "zod"

export const UpdateAbility = z.object({
  id: z.number().optional(),
  name: z.string().optional().nullable(),
  ranking: z.nativeEnum(AbilityRank),
  isBioAbility: z.boolean(),
})

export default resolver.pipe(
  resolver.zod(UpdateAbility),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const ability = await db.ability.update({ where: { id }, data })

    return ability
  }
)
