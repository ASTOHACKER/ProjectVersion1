'use client'

import {NextUIProvider} from "@nextui-org/react"
import {ThemeProvider as NextThemesProvider} from "next-themes"
import { SessionProvider } from "next-auth/react"

export function Providers({children}) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      <NextThemesProvider defaultTheme="system" enableSystem attribute="class" enableColorScheme>
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </NextThemesProvider>
    </SessionProvider>
  )
}
