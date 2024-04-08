import './globals.sass'

export const metadata = {
  title: 'A computer game',
}

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
