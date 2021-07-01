import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getCharacter from "app/characters/queries/getCharacter"
import deleteCharacter from "app/characters/mutations/deleteCharacter"

export const Character = () => {
  const router = useRouter()
  const characterId = useParam("characterId", "number")
  const [deleteCharacterMutation] = useMutation(deleteCharacter)
  const [character] = useQuery(getCharacter, { id: characterId })

  return (
    <>
      <Head>
        <title>Character {character.id}</title>
      </Head>

      <div>
        <h1>Character {character.id}</h1>
        <pre>{JSON.stringify(character, null, 2)}</pre>

        <Link href={Routes.EditCharacterPage({ characterId: character.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteCharacterMutation({ id: character.id })
              router.push(Routes.CharactersPage())
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

const ShowCharacterPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.CharactersPage()}>
          <a>Characters</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Character />
      </Suspense>
    </div>
  )
}

ShowCharacterPage.authenticate = true
ShowCharacterPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowCharacterPage
