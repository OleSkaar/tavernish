import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getGameSession from "app/game-sessions/queries/getGameSession"
import updateGameSession from "app/game-sessions/mutations/updateGameSession"
import { GameSessionForm, FORM_ERROR } from "app/game-sessions/components/GameSessionForm"

export const EditGameSession = () => {
  const router = useRouter()
  const gameSessionId = useParam("gameSessionId", "number")
  const [gameSession, { setQueryData }] = useQuery(
    getGameSession,
    { id: gameSessionId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateGameSessionMutation] = useMutation(updateGameSession)

  return (
    <>
      <Head>
        <title>Edit GameSession {gameSession.id}</title>
      </Head>

      <div>
        <h1>Edit GameSession {gameSession.id}</h1>
        <pre>{JSON.stringify(gameSession)}</pre>

        <GameSessionForm
          submitText="Update GameSession"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateGameSession}
          initialValues={gameSession}
          onSubmit={async (values) => {
            try {
              const updated = await updateGameSessionMutation({
                id: gameSession.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowGameSessionPage({ gameSessionId: updated.id }))
            } catch (error) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </div>
    </>
  )
}

const EditGameSessionPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Laster...</div>}>
        <EditGameSession />
      </Suspense>

      <p>
        <Link href={Routes.GameSessionsPage()}>
          <a>GameSessions</a>
        </Link>
      </p>
    </div>
  )
}

EditGameSessionPage.authenticate = true
EditGameSessionPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditGameSessionPage
