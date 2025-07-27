
import React, { useContext, useEffect, useState } from 'react'

import { Link, useLocation, useParams } from 'react-router';
import { ThemeContext } from '../contexts/ThemeContext';

export default function CountryDetails() {

  //const countryName = new URLSearchParams(location.search).get('name');

  let params                              = useParams();
  const countryName                       = params['country'];
  const location                          = useLocation()

  const get_country                       = location.state;

  const [countryInfo,setCountryData]      = useState({});
  const [countryExists,setCountryExists]  = useState(false);
  const [loading, setLoading]             = useState(true); // Add loading state

  //const [isDark]                          = useOutletContext();

  const [isDark]                          = useContext(ThemeContext);

  function get_country_data(data) {

    let nativeName = "";
    if (data.name && data.name.nativeName) {
        const nativeNames = Object.values(data.name.nativeName);        
        if (nativeNames.length > 0 && nativeNames[0].common) {
            nativeName = nativeNames[0].common;
        } else {
            // Fallback if nativeName exists but doesn't have a common property in the first entry
            nativeName = data.name.common;
        }
    } else {
      nativeName = data.name.common
    }

    let subRegion ="";
    if (data.subregion) {
      subRegion = data.subregion
    }

    let capital="";
    if (data.capital) {
      capital = data.capital?.[0]
    }
    
    let topLevelDomain = data.tld.join(', ')

    let currencies='';
    if (data.currencies) {
      currencies = Object.values(data.currencies)
        .map((currency) => currency.name)
        .join(', ')
    }

    let languages= "";
    if (data.languages) {
      languages = Object.values(data.languages).join(', ')
    }

    setCountryData({
        flag:data.flags.svg,
        name:data.name.common || data.name,
        nativeName:nativeName,
        population: data.population.toLocaleString('en-IN'),
        region: data.region,
        subRegion:subRegion,
        capital:capital,
        topLevelDomain:topLevelDomain,
        currencies:currencies,
        languages:languages,
        borders:[]
    });

      if(data.borders) 
      {
        setTimeout(() => {
          data.borders.map((border)=> { 
            fetch(`https://restcountries.com/v3.1/alpha/${border}`)
              .then((res) => res.json())
              .then(([borderCountry]) => {                 
                setCountryData((prevState)=>({...prevState,borders:[...prevState.borders,borderCountry.name.common] }))
              }) 
            })
          },'');
      }

      setLoading(false);
  }
    
  useEffect(()=>{

    if(get_country) {
      get_country_data(get_country);
      return;
    }
    
    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
      .then((res) => {
        if (!res.ok) {
            // Throw an error if the response is not OK (e.g., 404, 500)
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(([data]) => {
        if (data) {          
          get_country_data(data);
          setLoading(false);
        } else {
            // If data is not an array, it's an unexpected response
            throw new Error("Fetched data is not an array.");
        }        
      })
      .catch((error)=>{
        setCountryExists(true);
      })
      .finally(() => {
        setLoading(false); // Set loading to false when fetch completes (success or failure)
      });
  },[countryName])
  
  if (loading) {
    return <main>
      <div className="country-details-container record_not_found">
        <b>Country Data Loading..............</b>        
      </div>
    </main>;
  }
  
  if(countryExists) {
    return (
      <main>
        <div className="country-details-container record_not_found">
          <b>Country Not Found</b>        
        </div>
      </main>
    )
  }

  let borders = ['No Country Found'];
  
  if(countryExists==false) {
    if(countryInfo.borders) {
      borders = countryInfo.borders;
    }
  }  

  return (   
    <main className={`${isDark? 'dark':''}`}>
      <div className="country-details-container">
        <span className="back-button" onClick={() => history.back() }>
          <i className="fa-solid fa-arrow-left"></i>&nbsp; Back
        </span>
        <div className="country-details">
          <img src={countryInfo.flag} alt={countryInfo.nativeName} />
          <div className="details-text-container">
            <h1>{countryInfo.name}</h1>
            
            <div className="details-text">
              <p><b>Native Name: </b><span className="native-name">{countryInfo.nativeName}</span></p>
              <p><b>Population: </b><span className="population">{countryInfo.population}</span></p>
              <p><b>Region: </b><span className="region">{countryInfo.region}</span></p>
              <p><b>Sub Region: </b><span className="sub-region">{countryInfo.subRegion}</span></p>
              <p><b>Capital: </b><span className="capital">{countryInfo.capital}</span></p>
              <p><b>Top Level Domain: </b><span className="top-level-domain">{countryInfo.topLevelDomain}</span></p>
              <p><b>Currencies: </b><span className="currencies">{countryInfo.currencies}</span></p>
              <p><b>Languages: </b><span className="languages">{countryInfo.languages}</span></p>
            </div>
            
            <div className="border-countries">
              <b>Border Countries: </b>               
              { borders.map((border,i)=><Link key={`${border}`} to={`/${border}`}>{border}</Link>) }               
            </div>

          </div>
        </div>
      </div>
    </main>
  ) 
}