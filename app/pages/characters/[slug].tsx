import { Suspense } from "react"
import {
  Head,
  Link,
  useRouter,
  useQuery,
  useParam,
  BlitzPage,
  useMutation,
  Routes,
  usePaginatedQuery,
} from "blitz"
import Layout from "app/core/layouts/Layout"
import getCharacter from "app/characters/queries/getCharacter"
import deleteCharacter from "app/characters/mutations/deleteCharacter"
import getUserById from "app/users/queries/getUserById"
import getAbilities from "app/abilities/queries/getAbilities"
import getCharacterBySlug from "app/characters/queries/getCharacterBySlug"

export const Character = () => {
  const router = useRouter()
  const slug = useParam("slug", "string")
  const [deleteCharacterMutation] = useMutation(deleteCharacter)
  //const [character] = useQuery(getCharacter, { id: slug })
  const [character] = useQuery(getCharacterBySlug, { slug: slug })
  const [{ abilities }] = usePaginatedQuery(getAbilities, {
    where: { characterId: character.id },
  })
  const [user] = useQuery(getUserById, { id: character.userId })

  return (
    <>
      <Head>
        <title>Tavernish | {character.name}</title>
      </Head>

      <div>
        <h1>{character.name}</h1>
        <p>Spiller: {user?.name}</p>
        <pre>{JSON.stringify(character, null, 2)}</pre>
        <pre>{JSON.stringify(abilities, null, 2)}</pre>

        <Link href={Routes.EditCharacterPage({ slug: character.slug })}>
          <a>Edit</a>
        </Link>

        <hr />
        <h2>Evner</h2>
        <hr />

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
          Slett
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

      <Suspense fallback={<div>Laster...</div>}>
        <Character />
      </Suspense>
    </div>
  )
}

ShowCharacterPage.authenticate = false
ShowCharacterPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowCharacterPage
