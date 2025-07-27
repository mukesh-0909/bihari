import React from 'react'

export default function Search({updateColor,query}) {   
  return (
            <div className="search-container">
                <i className="fa-solid fa-magnifying-glass" />
                <input type="text" name="search_country"  id="search_country" onChange={updateColor}></input>
            </div>
        )
}
