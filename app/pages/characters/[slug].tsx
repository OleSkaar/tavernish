import { Suspense, useState } from "react"
import { Head, Link, useQuery, useParam, BlitzPage, Routes, usePaginatedQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import getUserById from "app/users/queries/getUserById"
import getAbilities from "app/abilities/queries/getAbilities"
import getCharacterBySlug from "app/characters/queries/getCharacterBySlug"
import { AbilityRank } from "db"
import { parseAbilityRank } from "app/core/utils/parseAbilityRank"
import { rollFudgeDice, rollDoubleFudgeDice } from "app/core/game-logic/rollFudgeDice"
import {
  printFudgeDiceResult,
  FudgeDiceResult,
  fudgeDiceResultToSymbols,
} from "app/core/game-logic/parseFudgeDice"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { sendMessageToDiscord } from "app/core/webhooks/discord"
import GeneralDiceRoller from "app/core/game-logic/components/GeneralDiceRoller"
import { useDiceResultState } from "app/core/game-logic/hooks/useDiceResultState"

export const Character = () => {
  const slug = useParam("slug", "string")
  const [fudgeDiceResult, setFudgeDiceResult] = useState<FudgeDiceResult | undefined>(undefined)
  const { diceResult, setDiceResult } = useDiceResultState()
  const [character] = useQuery(getCharacterBySlug, { slug: slug })
  const [{ abilities }] = usePaginatedQuery(getAbilities, {
    where: { characterId: character.id },
  })
  const currentUser = useCurrentUser()
  const [user] = useQuery(getUserById, { id: character.userId })
  const ranks = Array.from(new Set<string>(abilities.map((ability) => ability.ranking)))

  const handleDiceRoll = (rank: AbilityRank, abilityName: string) => {
    const roll = rollFudgeDice(rank)
    const result = {
      ...roll,
      userName: currentUser?.name,
      characterName: character.name,
      abilityName,
    }
    setFudgeDiceResult(result)
    const parsedResult = printFudgeDiceResult(result)
    setDiceResult({ result: parsedResult, timestamp: new Date() })

    if (!result.secondRollRequired) {
      sendMessageToDiscord(printFudgeDiceResult(result))
    }
    return undefined
  }

  const handleDoubleDiceRoll = () => {
    if (fudgeDiceResult) {
      const newResult = rollDoubleFudgeDice(fudgeDiceResult)
      const parsedResult = printFudgeDiceResult(newResult)
      console.log(newResult)

      setFudgeDiceResult(newResult)
      setDiceResult({ result: parsedResult, timestamp: new Date() })
      sendMessageToDiscord(printFudgeDiceResult(newResult))
    }

    return undefined
  }

  return (
    <>
      <Head>
        <title>Tavernish | {character.name}</title>
      </Head>

      <div>
        <h1>{character.name}</h1>
        <p>Spiller: {user?.name}</p>
        <pre>{JSON.stringify(character, null, 2)}</pre>

        <Link href={Routes.EditCharacterPage({ slug: character.slug })}>
          <a>Rediger</a>
        </Link>

        <hr />
        <h2>Evner</h2>
        {diceResult && (
          <div>
            {diceResult?.timestamp && (
              <p>
                {diceResult.timestamp.toLocaleDateString("no-nb")}{" "}
                {diceResult.timestamp.toLocaleTimeString("no-nb")}
              </p>
            )}
            {
              <div>
                {fudgeDiceResult && fudgeDiceResult.secondRollRequired
                  ? `Du trillet ${fudgeDiceResultToSymbols(fudgeDiceResult.firstRoll)} i ${
                      fudgeDiceResult.abilityName
                    }. Trill igjen!`
                  : diceResult.result}
                {fudgeDiceResult && fudgeDiceResult.secondRollRequired && (
                  <button onClick={handleDoubleDiceRoll}>Trill igjen!</button>
                )}
              </div>
            }
          </div>
        )}
        {ranks.map((rank) => {
          return (
            <div key={rank}>
              <h3>{parseAbilityRank(AbilityRank[rank])}</h3>
              <div>
                {abilities
                  .filter((ability) => ability.ranking === rank)
                  .map((ability) => (
                    <button
                      key={ability.id}
                      onClick={() => handleDiceRoll(rank as AbilityRank, ability.name)}
                    >
                      {ability.name}
                    </button>
                  ))}
              </div>
            </div>
          )
        })}
        <hr />
        <h2>Generelt</h2>
        <GeneralDiceRoller characterName={character.name} setDiceResult={setDiceResult} />
      </div>
    </>
  )
}

const ShowCharacterPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.CharactersPage()}>
          <a>Karakterer</a>
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
