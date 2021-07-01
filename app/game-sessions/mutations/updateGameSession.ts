import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateGameSession = z.object({
  id: z.number(),
  name: z.string(),
})

export default resolver.pipe(
  resolver.zod(UpdateGameSession),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const gameSession = await db.gameSession.update({ where: { id }, data })

    return gameSession
  }
)
