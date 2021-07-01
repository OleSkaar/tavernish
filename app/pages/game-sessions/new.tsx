import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createGameSession from "app/game-sessions/mutations/createGameSession"
import { GameSessionForm, FORM_ERROR } from "app/game-sessions/components/GameSessionForm"

const NewGameSessionPage: BlitzPage = () => {
  const router = useRouter()
  const [createGameSessionMutation] = useMutation(createGameSession)

  return (
    <div>
      <h1>Create New GameSession</h1>

      <GameSessionForm
        submitText="Create GameSession"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateGameSession}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const gameSession = await createGameSessionMutation(values)
            router.push(Routes.ShowGameSessionPage({ gameSessionId: gameSession.id }))
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.GameSessionsPage()}>
          <a>GameSessions</a>
        </Link>
      </p>
    </div>
  )
}

NewGameSessionPage.authenticate = true
NewGameSessionPage.getLayout = (page) => <Layout title={"Create New GameSession"}>{page}</Layout>

export default NewGameSessionPage
