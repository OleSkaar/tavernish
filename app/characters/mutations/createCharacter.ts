import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const CreateCharacter = z.object({
  userId: z.number(),
  name: z.string(),
  flaw: z.string().optional(),
  titles: z.string().optional(),
  rank: z.string().optional(),
})

export default resolver.pipe(resolver.zod(CreateCharacter), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const character = await db.character.create({ data: input })

  return character
})
