import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getCharacters from "app/characters/queries/getCharacters"

const ITEMS_PER_PAGE = 100

export const CharactersList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ characters, hasMore }] = usePaginatedQuery(getCharacters, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  return (
    <div>
      <ul>
        {characters.map((character) => (
          <li key={character.id}>
            <Link href={Routes.ShowCharacterPage({ characterId: character.id })}>
              <a>{character.name}</a>
            </Link>
          </li>
        ))}
      </ul>

      {characters.length > ITEMS_PER_PAGE && (
        <nav>
          <button disabled={page === 0} onClick={goToPreviousPage}>
            Previous
          </button>
          <button disabled={!hasMore} onClick={goToNextPage}>
            Next
          </button>
        </nav>
      )}
    </div>
  )
}

const CharactersPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Karakterer</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewCharacterPage()}>
            <a>Lag en karakter</a>
          </Link>
        </p>

        <Suspense fallback={<div>Laster...</div>}>
          <CharactersList />
        </Suspense>
      </div>
    </>
  )
}

CharactersPage.authenticate = false
CharactersPage.getLayout = (page) => <Layout>{page}</Layout>

export default CharactersPage
