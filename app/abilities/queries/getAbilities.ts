import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetAbilitiesInput
  extends Pick<Prisma.AbilityFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetAbilitiesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: abilities,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.ability.count({ where }),
      query: (paginateArgs) => db.ability.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      abilities,
      nextPage,
      hasMore,
      count,
    }
  }
)
