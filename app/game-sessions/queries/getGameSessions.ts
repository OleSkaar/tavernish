import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetGameSessionsInput
  extends Pick<Prisma.GameSessionFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetGameSessionsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: gameSessions,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.gameSession.count({ where }),
      query: (paginateArgs) => db.gameSession.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      gameSessions,
      nextPage,
      hasMore,
      count,
    }
  }
)
