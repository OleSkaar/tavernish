import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createCharacter, { CreateCharacter } from "app/characters/mutations/createCharacter"
import { CharacterForm, FORM_ERROR } from "app/characters/components/CharacterForm"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { UserRole } from "db"

const NewCharacterPage: BlitzPage = () => {
  const router = useRouter()
  const [createCharacterMutation] = useMutation(createCharacter)
  const user = useCurrentUser()

  if (!user) {
    return null
  }

  return (
    <div>
      <h1>Ny karakter</h1>

      <CharacterForm
        submitText="Lag karakter"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        schema={CreateCharacter}
        initialValues={{}}
        onSubmit={async (values) => {
          try {
            if (user.role === UserRole.GM) {
              values.userId = values.userId ?? user.id
            } else {
              values.userId = user.id
            }
            const character = await createCharacterMutation(values)
            router.push(Routes.ShowCharacterPage({ slug: character.slug }))
          } catch (error) {
            console.error(error)
            return {
              [FORM_ERROR]: error.toString(),
            }
          }
        }}
      />

      <p>
        <Link href={Routes.CharactersPage()}>
          <a>Characters</a>
        </Link>
      </p>
    </div>
  )
}

NewCharacterPage.authenticate = true
NewCharacterPage.getLayout = (page) => <Layout title={"Create New Character"}>{page}</Layout>

export default NewCharacterPage
