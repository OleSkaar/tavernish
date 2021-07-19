import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getGameSession from "app/game-sessions/queries/getGameSession"
import deleteGameSession from "app/game-sessions/mutations/deleteGameSession"

export const GameSession = () => {
  const router = useRouter()
  const gameSessionId = useParam("gameSessionId", "number")
  const [deleteGameSessionMutation] = useMutation(deleteGameSession)
  const [gameSession] = useQuery(getGameSession, { id: gameSessionId })

  return (
    <>
      <Head>
        <title>GameSession {gameSession.id}</title>
      </Head>

      <div>
        <h1>GameSession {gameSession.id}</h1>
        <pre>{JSON.stringify(gameSession, null, 2)}</pre>

        <Link href={Routes.EditGameSessionPage({ gameSessionId: gameSession.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteGameSessionMutation({ id: gameSession.id })
              router.push(Routes.GameSessionsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowGameSessionPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.GameSessionsPage()}>
          <a>GameSessions</a>
        </Link>
      </p>

      <Suspense fallback={<div>Laster...</div>}>
        <GameSession />
      </Suspense>
    </div>
  )
}

ShowGameSessionPage.authenticate = true
ShowGameSessionPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowGameSessionPage
