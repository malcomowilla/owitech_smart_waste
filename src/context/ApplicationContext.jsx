import { useState, createContext, useContext,
     useEffect, useCallback } from "react"


const AppContext = createContext(null)


const ApplicationContext = ({children}) => {

  
  return (
    <>
    <AppContext.Provider  value={{
    
     }}  >
    {children}
   </AppContext.Provider>

   </>
  )
}
export default ApplicationContext
export const useApplicationContext = (()=> useContext(AppContext))
