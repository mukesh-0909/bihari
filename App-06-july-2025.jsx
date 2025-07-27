import React, { useState } from 'react'

//import Search from "./components/Search";

import "./style.css"
import "./country.css"
import "./shimmer.css"

import { Outlet } from 'react-router';
import Home from './components/Home';
import Header from './components/Header';
import { ThemeContext } from './contexts/ThemeContext';

const App = ()=> {  
        
    /// Get the data from local storage
    const getIsDarkMode     = JSON.parse(localStorage.getItem('isDarkMode'));
    const [isDark,setDark]  = useState(getIsDarkMode);  

    let contain_value = <ThemeContext.Provider value={[isDark,setDark]}>  
        <Header theme={[isDark,setDark]}></Header>
        <Outlet context={[isDark,setDark]}></Outlet>
    </ThemeContext.Provider>
    return contain_value;
}

export default App;