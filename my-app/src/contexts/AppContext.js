// สร าง context สำหรับเก็บ state ของแอพ
// contexts จะช ่วยให ามารถแบ งป น state ระหว าง components ได 

'use client'
import { createContext, useContext, useState } from 'react'

const AppContext = createContext({})

export function AppProvider({ children }) {
  const [globalState, setGlobalState] = useState({
    // ใส่ state เริ่มต้นที่ต้องการ
  })

  return (
    <AppContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </AppContext.Provider>
  )
}

// สร าง hook สำหรับเรียกใช  context
// hook นี้จะช ่วยให ามารถเรียกใช  context ได จากที่ไหนก็ได  ในแอพ
export function useAppContext() {
  return useContext(AppContext)
} 