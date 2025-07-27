import React from 'react'
import { Link, useOutletContext } from 'react-router'

export default function CountryCard(props) {

//export default function CountryCard({country_name,population,region,flags,capital,data}) {

  return (
    <Link className="country-card" to={`/${props.country_name}`} state={props.data}>
      <div>
        <img src={props.flags} alt={props.country_name} />
      </div>
      <div className="card-text">
          <h3 className="card-title">{props.country_name}</h3>
          <p><b>Population: </b>{props.population}</p>
          <p><b>Region: </b>{props.region}</p>
          <p><b>Capital: </b>{props.capital}</p>
      </div> 
    </Link>      
  )

  /* return (
    <Link className="country-card" to={`/${country_name}`} state={data}>
    <img src={flags} alt={country_name} />
        <div className="card-text">
            <h3 className="card-title">{country_name}</h3>
            <p><b>Population: </b>{population}</p>
            <p><b>Region: </b>{region}</p>
            <p><b>Capital: </b>{capital}</p>
        </div> 
    </Link>      
  ) */

}
