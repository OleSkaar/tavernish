import { Ability } from "@prisma/client"

export type AbilityInput = Pick<Ability, "name" | "ranking" | "isBioAbility">
