import React, { ReactNode } from "react"
import { Head, Routes, Link } from "blitz"

type LayoutProps = {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "tavernish"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <Link href={Routes.Home()}>
          <a>Tavernish</a>
        </Link>
      </header>

      {children}
    </>
  )
}

export default Layout
