import '../styles/globals.css'

export const metadata = {
  title: 'LoopLearn',
  description: 'Adaptive learning, continuously improving',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="light only" />
      </head>
      <body>{children}</body>
    </html>
  )
}
