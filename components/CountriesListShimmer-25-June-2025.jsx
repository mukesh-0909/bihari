import React from 'react'

export default function CountriesListShimmer() {

    return (
        <div className="countries-container">
            { Array.from({length:10}).map((el,i)=>
            { return <div key={i} className="country-card country-card-shimmer"></div> }
        ) }
        </div>
    )

}