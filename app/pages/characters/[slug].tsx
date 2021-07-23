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
import { Button } from "app/core/components/Button"

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

      <div className="space-y-4">
        <div className="flex items-end">
          <span className="text-sm inline-block align-baseline">Navn</span>
          <h1 className="text-2xl border-b-2 border-dotted border-black pl-2 inline w-full">
            {character.name}
          </h1>
        </div>

        <span className="text-sm m-auto w-full block text-center">Spiller</span>
        <div className="flex items-center">
          <div className="w-full flex justify-evenly border border-dotted border-gray-700 p-4">
            <div className="border-dashed border-2 border-blue-900 p-4 p y-2">{user?.name}</div>
            {currentUser && (
              <Link href={Routes.EditCharacterPage({ slug: character.slug })}>
                <a className="border-dashed border-2 border-red-900 p-4 p y-2">✏️ Rediger</a>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-end">
          <span className="text-sm inline-block align-baseline">Rang</span>
          <p className="border-b-2 border-dotted border-black pl-2 inline w-full">
            {character.rank ?? ""}
          </p>
        </div>

        <div className="flex items-end">
          <span className="text-sm inline-block align-baseline">Titler</span>
          <p className="border-b-2 border-dotted border-black pl-2 inline w-full">
            {character.titles ?? ""}
          </p>
        </div>

        <div className="flex items-end">
          <span className="text-sm inline-block align-baseline">Lyte</span>
          <p className="border-b-2 border-dotted border-black pl-2 inline w-full">
            {character.flaw ?? ""}
          </p>
        </div>

        <h2 className="text-2xl">Evner</h2>
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
            <div key={rank} className="space-y-2">
              <h3 className="text-lg">{parseAbilityRank(AbilityRank[rank])}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {abilities
                  .filter((ability) => ability.ranking === rank)
                  .map((ability) => (
                    <Button
                      key={ability.id}
                      text={ability.name}
                      onClick={() => handleDiceRoll(rank as AbilityRank, ability.name)}
                      color={ability.isBioAbility ? "orange" : "green"}
                    />
                  ))}
              </div>
            </div>
          )
        })}

        <GeneralDiceRoller characterName={character.name} setDiceResult={setDiceResult} />
      </div>
    </>
  )
}

const ShowCharacterPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Laster...</div>}>
        <Character />
      </Suspense>
    </div>
  )
}

ShowCharacterPage.authenticate = false
ShowCharacterPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowCharacterPage
