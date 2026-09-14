import { createContext, useContext, useState } from 'react'

const Ctx = createContext({ isDark: true, toggle: () => {} })
export const useTheme = () => useContext(Ctx)

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)
  return (
    <Ctx.Provider value={{ isDark, toggle: () => setIsDark(d => !d) }}>
      {children}
    </Ctx.Provider>
  )
}
