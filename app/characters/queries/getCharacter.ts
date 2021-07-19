import { resolver, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const GetCharacter = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetCharacter), async ({ id }) => {
  const character = await db.character.findFirst({ where: { id } })

  if (!character) throw new NotFoundError()

  return character
})
