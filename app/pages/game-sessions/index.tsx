import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getGameSessions from "app/game-sessions/queries/getGameSessions"

const ITEMS_PER_PAGE = 100

export const GameSessionsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ gameSessions, hasMore }] = usePaginatedQuery(getGameSessions, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {gameSessions.map((gameSession) => (
          <li key={gameSession.id}>
            <Link href={Routes.ShowGameSessionPage({ gameSessionId: gameSession.id })}>
              <a>{gameSession.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const GameSessionsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>GameSessions</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewGameSessionPage()}>
            <a>Create GameSession</a>
          </Link>
        </p>

        <Suspense fallback={<div>Laster...</div>}>
          <GameSessionsList />
        </Suspense>
      </div>
    </>
  )
}

GameSessionsPage.authenticate = true
GameSessionsPage.getLayout = (page) => <Layout>{page}</Layout>

export default GameSessionsPage
