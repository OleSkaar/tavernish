import { Suspense } from "react"
import {
  Head,
  Link,
  useRouter,
  useQuery,
  useMutation,
  useParam,
  BlitzPage,
  Routes,
  usePaginatedQuery,
  useSession,
} from "blitz"

import Layout from "app/core/layouts/Layout"
import getCharacter from "app/characters/queries/getCharacter"
import updateCharacter from "app/characters/mutations/updateCharacter"
import { CharacterForm, FORM_ERROR } from "app/characters/components/CharacterForm"
import getAbilities from "app/abilities/queries/getAbilities"
import { UserRole } from "db"

export const EditCharacter = () => {
  const router = useRouter()
  const characterId = useParam("characterId", "number")
  const [character, { setQueryData }] = useQuery(
    getCharacter,
    { id: characterId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [{ abilities }] = usePaginatedQuery(getAbilities, {
    where: { characterId: characterId },
  })
  const [updateCharacterMutation] = useMutation(updateCharacter)

  const session = useSession()

  return session.userId === character.userId || session.role === UserRole.GM ? (
    <>
      <Head>
        <title>Tavernish | Rediger {character.name}</title>
      </Head>

      <div>
        <h1>Rediger {character.name}</h1>
        <pre>{JSON.stringify(character)}</pre>
        <pre>{JSON.stringify(abilities)}</pre>

        <CharacterForm
          submitText="Oppdater karakter"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateCharacter}
          initialValues={{ ...character, abilities }}
          onSubmit={async (values) => {
            try {
              const updated = await updateCharacterMutation({
                id: character.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowCharacterPage({ characterId: updated.id }))
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
  ) : (
    <div>
      <p>Du har ikke tilgang til å redigere denne karakteren.</p>
      <Link href={Routes.Home()}>
        <a>Forside</a>
      </Link>
    </div>
  )
}

const EditCharacterPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Laster...</div>}>
        <EditCharacter />
      </Suspense>

      <p>
        <Link href={Routes.CharactersPage()}>
          <a>Characters</a>
        </Link>
      </p>
    </div>
  )
}

EditCharacterPage.authenticate = true
EditCharacterPage.getLayout = (page) => <Layout>{page}</Layout>

export default EditCharacterPage
