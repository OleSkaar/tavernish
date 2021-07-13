import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

export const CreateCharacter = z.object({
  userId: z.number(),
  name: z.string(),
  flaw: z.string(),
  titles: z.string(),
  rank: z.string(),
})

export default resolver.pipe(resolver.zod(CreateCharacter), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const character = await db.character.create({ data: input })

  return character
})
