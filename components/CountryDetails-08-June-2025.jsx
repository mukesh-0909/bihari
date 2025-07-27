
import React, { useEffect, useState } from 'react'

import { Link, useLocation, useParams } from 'react-router';

export default function CountryDetails() {

  //const countryName = new URLSearchParams(location.search).get('name');

  let params                              = useParams();
  const countryName                       = params['country'];
  const location                          = useLocation()

  const get_country                       = location.state;

  const [countryInfo,setCountryData]      = useState({});
  const [countryExists,setCountryExists]  = useState(false);

  function get_country_data(data) {

    let nativeName = "";
    if (data.name.nativeName) {
      nativeName = Object.values(data.name.nativeName)[0].common
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
        name:data.name.common,
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

      if(data.borders) {
        setTimeout(() => {
          data.borders.map((border)=> { 
            fetch(`https://restcountries.com/v3.1/alpha/${border}`)
              .then((res) => res.json())
              .then(([borderCountry]) => {                 
                setCountryData((prevState)=>({...prevState,borders:[...prevState.borders,borderCountry.name.common] }))
            }) 
          }
        )
      }, '');
      }
  }
    
  useEffect(()=>{

    if(get_country) {
      get_country_data(get_country);
      return;
    }
    
    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
    .then((res) => res.json())
    .then(([data]) => {

      //getCountry_information(data)

      get_country_data(data);     

    }).catch((error)=>{
      setCountryExists(true);
    }) 
  },[countryName])
  
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
    <main>
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