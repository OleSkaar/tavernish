import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetAbility = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetAbility), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const ability = await db.ability.findFirst({ where: { id } })

  if (!ability) throw new NotFoundError()

  return ability
})
