import { Suspense } from "react"
import { Link, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import { CharactersList } from "app/pages/characters/index"
import GeneralDiceRoller from "app/core/game-logic/components/GeneralDiceRoller"
import { useDiceResultState } from "app/core/game-logic/hooks/useDiceResultState"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser()

  if (currentUser) {
    return null
  }

  return (
    <>
      <p>Ikke laget bruker enda? Trykk her!</p>
      <Link href={Routes.SignupPage()}>
        <a className="p-4 border border-double border-black rounded-md inline-block">Meld deg på</a>
      </Link>
    </>
  )
}

const Home: BlitzPage = () => {
  const { diceResult, setDiceResult } = useDiceResultState()

  return (
    <div className="container">
      <main className="space-y-8">
        <h1 className="text-4xl">Velkommen til Tavernish 2.0!</h1>
        <p>Du kan nå lage din egen bruker, opprette karakterer, og oppdatere character sheets.</p>
        <div className="space-y-4">
          <Suspense fallback="Laster...">
            <UserInfo />
          </Suspense>
        </div>
        <h2 className="text-4xl">Karakterer</h2>
        <CharactersList />
        {diceResult.result}
        <GeneralDiceRoller setDiceResult={setDiceResult} />
      </main>
    </div>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
