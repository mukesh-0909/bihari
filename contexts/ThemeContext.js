import { createContext, useState } from "react";

export const ThemeContext =  createContext('Mukesh Kumar');

export function ThemeProvider({children}) {

    //console.log(children);
    const getIsDarkMode     = JSON.parse(localStorage.getItem('isDarkMode'));
    
    const [isDark,setDark]  = useState(getIsDarkMode);  

    return <ThemeContext.Provider value={[isDark,setDark]}>{children}</ThemeContext.Provider>

}