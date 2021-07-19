import { ReactNode } from "react"
import { Head } from "blitz"

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
      <header>Tavernish</header>

      {children}
    </>
  )
}

export default Layout
