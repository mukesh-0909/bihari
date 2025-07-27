import React, { useContext, useState } from 'react'

import CountriesContainer from "./CountriesContainer";

import CountryFilter from "./CountryFilter";
import Search from "./Search";
import { useOutletContext } from 'react-router';
import { ThemeContext } from '../contexts/ThemeContext';

export default function Home() {

    const [query,countryFunction]   = useState('');
    //const [isDark]                  = useOutletContext();
    //const context_value             = useContext(ThemeContext);
    
    const [isDark]                  = useContext(ThemeContext);

    const updateColor = (e) => {
        const searchCountry = e.target.value;
        countryFunction(searchCountry);
    }

    return (
        <main className={`${isDark? 'dark':''}`}>
            <div className="search-filter-container">
                <Search updateColor={updateColor} query={query}></Search>
                <CountryFilter updateColor={updateColor}></CountryFilter>
            </div>
            <CountriesContainer query={query}></CountriesContainer>
        </main>       
    )

}