import { PropsWithChildren } from "@lyra-js/core"
import { Footer } from "@templates/layout/Footer"
import { Header } from "@templates/layout/Header"

export function Base({ children }: PropsWithChildren) {
  return (
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>LyraJS App</title>
        <link rel="stylesheet" href="/assets/styles/app.css" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
