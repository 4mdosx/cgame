import './globals.sass'

export const metadata = {
  title: 'Idle game of a adrowned world',
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
