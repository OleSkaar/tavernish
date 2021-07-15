import { UpdateAbility } from "app/abilities/mutations/updateAbility"
import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateCharacter = z.object({
  id: z.number(),
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
    console.log("DATA", data)
    console.log(data.abilities.map((ability) => ability.id))

    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const character = await db.character.update({
      where: { id },
      data: {
        ...data,
        abilities: {
          deleteMany: {
            // ---> It will delete all "other" data not included in "others" list
            characterId: id,
            NOT: data.abilities.map(({ id }) => ({ id })),
          },
          upsert: data.abilities.map((ability) => ({
            // Appears to be a prisma bug,
            // because `|| 0` shouldn't be needed
            where: { id: ability.id || 0 },
            create: {
              name: ability.name,
              isBioAbility: ability.isBioAbility,
              ranking: ability.ranking,
            },
            update: {
              name: ability.name,
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
