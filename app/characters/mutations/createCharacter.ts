import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { AbilityRank } from "@prisma/client"

export const CreateCharacter = z.object({
  userId: z.number(),
  name: z.string(),
  flaw: z.string().optional(),
  titles: z.string().optional(),
  rank: z.string().optional(),
  abilities: z
    .array(
      z.object({
        name: z.string(),
        ranking: z.nativeEnum(AbilityRank),
        isBioAbility: z.boolean(),
      })
    )
    .optional(),
})

export default resolver.pipe(resolver.zod(CreateCharacter), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const character = await db.character.create({ data: input })

  return character
})
