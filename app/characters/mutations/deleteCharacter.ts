import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteCharacter = z.object({
  id: z.number(),
})

export default resolver.pipe(
  resolver.zod(DeleteCharacter),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    await db.ability.deleteMany({ where: { characterId: id } })
    const character = await db.character.deleteMany({ where: { id } })

    return character
  }
)
