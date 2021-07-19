import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized } from "blitz"
import { User, UserRole } from "db"

// Note: You should switch to Postgres and then use a DB enum for role type

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<UserRole>
    PublicData: {
      userId: User["id"]
      role: UserRole
    }
  }
}
