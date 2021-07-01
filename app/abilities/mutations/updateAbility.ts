import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateAbility = z.object({
  id: z.number(),
  name: z.string(),
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
