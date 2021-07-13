import { AbilityRank } from "@prisma/client"

export const useAbilityRank = (rank: AbilityRank) => {
  switch (rank) {
    case AbilityRank.NO:
      return "Nei"
    case AbilityRank.HORRIBLE:
      return "Ynkelig"
    case AbilityRank.PATHETIC:
      return "Patetisk"
    case AbilityRank.TERRIBLE:
      return "Elendig"
    case AbilityRank.POOR:
      return "Dårlig"
    case AbilityRank.MEDICORE:
      return "Måtelig"
    case AbilityRank.AVERAGE:
      return "Middels"
    case AbilityRank.GOOD:
      return "God"
    case AbilityRank.GREAT:
      return "Dugelig"
    case AbilityRank.EXCELLENT:
      return "Fremragende"
    case AbilityRank.GODLIKE:
      return "Gudommelig"
  }
}
