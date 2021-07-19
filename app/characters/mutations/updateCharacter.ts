import { UpdateAbility } from "app/abilities/mutations/updateAbility"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateCharacter = z.object({
  id: z.number(),
  userId: z.number().optional(),
  name: z.string(),
  flaw: z.string().optional().nullable(),
  rank: z.string().optional().nullable(),
  titles: z.string().optional().nullable(),
  abilities: z.array(UpdateAbility),
})

export default resolver.pipe(
  resolver.zod(UpdateCharacter),
  resolver.authorize(),
  async ({ id, ...data }) => {
    const character = await db.character.update({
      where: { id },
      data: {
        ...data,
        abilities: {
          deleteMany: {
            // Will delete all Ability data not included in abilities list
            characterId: id,
            NOT: data.abilities.map(({ id }) => ({ id })),
          },
          upsert: data.abilities.map((ability) => ({
            // Appears to be a prisma bug,
            // because `|| 0` shouldn't be needed
            where: { id: ability.id || 0 },
            create: {
              name: ability?.name || "",
              isBioAbility: ability.isBioAbility,
              ranking: ability.ranking,
            },
            update: {
              name: ability?.name || "",
              isBioAbility: ability.isBioAbility,
              ranking: ability.ranking,
            },
          })),
        },
      },
      include: {
        abilities: true,
      },
    })

    return character
  }
)
