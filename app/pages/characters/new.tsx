import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createCharacter from "app/characters/mutations/createCharacter"
import { CharacterForm, FORM_ERROR } from "app/characters/components/CharacterForm"

const NewCharacterPage: BlitzPage = () => {
  const router = useRouter()
  const [createCharacterMutation] = useMutation(createCharacter)

  return (
    <div>
      <h1>Create New Character</h1>

      <CharacterForm
        submitText="Create Character"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateCharacter}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const character = await createCharacterMutation(values)
            router.push(Routes.ShowCharacterPage({ characterId: character.id }))
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
