import Head from 'next/head'

const Layout = ({ title, children }) => (
  <>
    {title && (
      <Head>
        <title>{`${title} - :DIIPIKS`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="og:title" content={title} />
      </Head>
    )}
    {children}
  </>
)

export default Layout
