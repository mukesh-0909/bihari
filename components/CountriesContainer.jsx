import React, { useEffect, useState } from 'react';

import CountryCard from './CountryCard';
import CountriesListShimmer from './CountriesListShimmer';
import { BeatLoader } from 'react-spinners';



export default function CountriesContainer({ query }) {
    const [countryData, setCountryData] = useState([]);
    const [loading, setLoading]         = useState(true); // Add loading state
    const [error, setError]             = useState(null);   // Add error state

    useEffect(() => {
        setLoading(true); // Set loading to true when fetch starts
        setError(null);   // Clear any previous errors

        fetch('https://restcountries.com/v3.1/all?fields=name,population,region,flags,capital,cca3,borders,tld')
            .then((res) => {
                if (!res.ok) {
                    // Throw an error if the response is not OK (e.g., 404, 500)
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                // Check if the fetched data is an array
                if (Array.isArray(data)) {
                    setCountryData(data);
                } else {
                    // If data is not an array, it's an unexpected response
                    throw new Error("Fetched data is not an array.");
                }
            })
            .catch((err) => {
                console.log("Error fetching country data:", err);
                setError(err); // Store the error
                setCountryData([]); // Ensure countryData is an empty array on error
            })
            .finally(() => {
                setLoading(false); // Set loading to false when fetch completes (success or failure)
            });
    }, []); // Empty dependency array means this effect runs once after the initial render

    // Conditional filtering only when countryData is an array

    const SelectedCountry = countryData.filter((countryDetails) => {
        // Ensure countryDetails.name and countryDetails.name.common exist
        return countryDetails?.name?.common?.toLowerCase().includes(query.toLowerCase()) || countryDetails?.region?.toLowerCase().includes(query.toLowerCase());
    });

    let country_lists;
    let class_country_name = 'countries-container';


    if (loading) {
       // return <CountriesListShimmer />;

       //return <div><BeatLoader></BeatLoader></div>

       return <CountriesListShimmer></CountriesListShimmer>
    }

    if (error) {

        return <div className="error-message">Error: {error.message}. Please try again later.</div>;
    }

    // If no error and not loading, process the data
    if (SelectedCountry.length === 0 && query !== "") {
        // Only show "No Country Records Found" if a query was made and no results
        class_country_name  = 'countries-not-found';
        country_lists       = "No Country Records Found";
    } else if (SelectedCountry.length === 0 && query === "" && !loading) {
        // This case handles when the initial fetch completes but no countries are displayed
        // (e.g., if the API returned an empty array, which is unlikely for /all)
        class_country_name  = 'countries-not-found';
        country_lists       = "No countries to display.";
    }
    else {
        country_lists = SelectedCountry.map((countryDetails, i) => {
            const country_name  = countryDetails.name.common;
            const population    = countryDetails.population;
            const region        = countryDetails.region;
            const flags         = countryDetails.flags?.svg; // Use optional chaining for flags.svg
            const capital       = countryDetails.capital?.[0] || ""; // Use optional chaining and default to empty string

            return (
                <CountryCard
                    key={countryDetails.cca3 || i} // Use a unique identifier like cca3 if available, fallback to index
                    country_name={country_name}
                    population={population}
                    region={region}
                    flags={flags}
                    capital={capital}
                    data={countryDetails}
                />
            );
        });
    }

    return (
        <div className={class_country_name}>
            {country_lists}
        </div>
    );
}