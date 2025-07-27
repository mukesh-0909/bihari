    import React, { useEffect, useState } from 'react'
    //import data from '../data'
    import CountryCard from './CountryCard';
    
    import CountriesListShimmer from './CountriesListShimmer';

    export default function CountriesContainer({query}) { 

        //let countryData = [];

        const [countryData,setCountryData] = useState([]);

        useEffect(() => {
          fetch('https://restcountries.com/v3.1/all')
          .then((res) => res.json())
          .then((data) => {        
              setCountryData(data);
          })
        },[]);

        const SelectedCountry = countryData.filter((countryDetails)=>
          {
            return countryDetails.name.common.toLowerCase().includes(query);
          }
        )

        let country_lists = SelectedCountry.map((countryDetails,i)=> {
            const country_name = countryDetails.name.common;
            const population   = countryDetails.population;
            const region       = countryDetails.region;
            const flags        = countryDetails.flags.svg;
            const capital      = countryDetails.capital?countryDetails.capital[0]:"";
            return <CountryCard key={i} country_name={country_name} population={population} region={region} flags={flags} capital={capital} data={countryDetails} ></CountryCard>;               
        })

        //console.log("This is the Country Lists",country_lists);
        //if(countryData.length===0) {
          //return <CountriesListShimmer></CountriesListShimmer>
        //}

        let class_country_name = 'countries-container';

        if(country_lists.length==0) {
          class_country_name = 'countries-not-found';
          country_lists="No Country Records Found"
        }

      return (
        <>
          { 
            !countryData.length ? <CountriesListShimmer></CountriesListShimmer> : 
            <div className={class_country_name}> { country_lists } </div> 
          }          
        </>
      )
    }