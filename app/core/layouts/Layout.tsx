import React, { ReactNode } from "react"
import { Head, Routes, Link, useMutation } from "blitz"
import logout from "app/auth/mutations/logout"
import { useCurrentUser } from "../hooks/useCurrentUser"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  return (
    <>
      <Head>
        <title>{title || "tavernish"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="font-mono p-4 border-b border-black">
        <div className="flex justify-between md:max-w-4xl md:m-auto">
          <Link href={Routes.Home()}>
            <a className="text-xl">🎖️ Tavernish</a>
          </Link>
          {currentUser ? (
            <button
              className="button small"
              onClick={async () => {
                await logoutMutation()
              }}
            >
              {currentUser.name} | Logg ut
            </button>
          ) : (
            <Link href={Routes.LoginPage()}>
              <a className="button small">Logg in</a>
            </Link>
          )}
        </div>
      </header>

      <main className="font-mono p-4 md:px-0 md:max-w-4xl md:m-auto">{children}</main>
    </>
  )
}

export default Layout
