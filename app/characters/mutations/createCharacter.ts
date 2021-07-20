import { resolver } from "blitz"
import db from "db"
import { z } from "zod"
import { CreateAbility } from "app/abilities/mutations/createAbility"
import slugify from "slugify"

export const CreateCharacter = z.object({
  userId: z.number(),
  name: z.string(),
  flaw: z.string().optional(),
  titles: z.string().optional(),
  rank: z.string().optional(),
  abilities: z.array(CreateAbility).optional(),
})

export default resolver.pipe(resolver.zod(CreateCharacter), resolver.authorize(), async (input) => {
  const characterData = {
    userId: input.userId,
    name: input.name,
    slug: slugify(input.name, { lower: true }),
    flaw: input?.flaw,
    titles: input?.titles,
    rank: input?.rank,
  }

  const character = await db.character.create({ data: characterData })

  if (input?.abilities) {
    const abilities = input.abilities.map((ability) => ({ characterId: character.id, ...ability }))
    await db.ability.createMany({ data: abilities })
  }

  return character
})
