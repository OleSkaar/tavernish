import { resolver, useMutation } from "blitz"
import db from "db"
import { z } from "zod"
import { AbilityRank } from "@prisma/client"
import createAbility, { CreateAbility } from "app/abilities/mutations/createAbility"

export const CreateCharacter = z.object({
  userId: z.number(),
  name: z.string(),
  flaw: z.string().optional(),
  titles: z.string().optional(),
  rank: z.string().optional(),
  abilities: z.array(CreateAbility),
})

export default resolver.pipe(resolver.zod(CreateCharacter), resolver.authorize(), async (input) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const characterData = {
    userId: input.userId,
    name: input.name,
    flaw: input?.flaw,
    titles: input?.titles,
    rank: input?.rank,
  }

  const character = await db.character.create({ data: characterData })

  const abilities = input.abilities.map((ability) => ({ characterId: character.id, ...ability }))

  const newAbilities = await db.ability.createMany({ data: abilities })

  return character
})
