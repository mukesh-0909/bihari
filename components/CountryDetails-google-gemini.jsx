import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router'; // Import useNavigate for programmatic navigation

export default function CountryDetails() {
  const { country: countryNameParam } = useParams(); // Rename to avoid confusion with internal state
  const location = useLocation();
  const navigate = useNavigate(); // Hook for programmatic navigation

  // This will be the initially passed state from Link, if any
  const initialCountryDataFromState = location.state;

  const [countryInfo, setCountryInfo] = useState(null); // Initialize as null to clearly indicate no data yet
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [borderCountryNames, setBorderCountryNames] = useState([]); // State for border country names

  // Memoize get_country_data to prevent unnecessary re-creation
  const processCountryData = useCallback((data) => {
    let nativeName = data.name.nativeName
      ? Object.values(data.name.nativeName)[0]?.common || data.name.common
      : data.name.common;

    let subRegion = data.subregion || '';
    let capital = data.capital?.[0] || '';

    let topLevelDomain = data.tld?.join(', ') || ''; // Use optional chaining
    
    let currencies = '';
    if (data.currencies) {
      currencies = Object.values(data.currencies)
        .map((currency) => currency.name)
        .join(', ');
    }

    let languages = '';
    if (data.languages) {
      languages = Object.values(data.languages).join(', ');
    }

    setCountryInfo({
      flag: data.flags?.svg, // Optional chaining for flags
      name: data.name.common,
      nativeName: nativeName,
      population: data.population?.toLocaleString('en-IN') || 'N/A', // Add N/A fallback
      region: data.region,
      subRegion: subRegion,
      capital: capital,
      topLevelDomain: topLevelDomain,
      currencies: currencies,
      languages: languages,
      // Do NOT set borders here; it will be fetched separately
    });

    return data.borders || []; // Return borders for the next step
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setCountryInfo(null); // Clear previous country info
    setBorderCountryNames([]); // Clear previous border names

    const fetchCountryAndBorders = async (countryToFetch) => {
      try {
        let currentCountryData;

        // Prioritize data passed via location state
        if (initialCountryDataFromState && initialCountryDataFromState.cca3 === countryToFetch) {
            currentCountryData = initialCountryDataFromState;
        } else {
            // Fetch if not available in state or if URL param changed
            const res = await fetch(`https://restcountries.com/v3.1/name/${countryToFetch}?fullText=true&fields=name,population,region,subregion,capital,tld,currencies,languages,flags,borders,cca3`);
            if (!res.ok) {
                // If 404, it means country not found
                if (res.status === 404) {
                    throw new Error('Country not found.');
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const [data] = await res.json();
            if (!data) {
                throw new Error('No data received for the country.');
            }
            currentCountryData = data;
        }

        // Process the main country data
        const borders = processCountryData(currentCountryData);

        // Fetch border countries if they exist
        if (borders.length > 0) {
          const borderPromises = borders.map(async (borderCode) => {
            const res = await fetch(`https://restcountries.com/v3.1/alpha/${borderCode}?fields=name,cca3`);
            if (!res.ok) {
              console.warn(`Failed to fetch border country ${borderCode}. Status: ${res.status}`);
              return null; // Return null or handle error for individual border
            }
            const [borderCountry] = await res.json();
            return borderCountry?.name?.common; // Return common name, ensure it exists
          });

          // Use Promise.allSettled to handle individual border fetch failures gracefully
          const results = await Promise.allSettled(borderPromises);
          const fetchedNames = results
            .filter(result => result.status === 'fulfilled' && result.value)
            .map(result => result.value);
          
          setBorderCountryNames(fetchedNames);
        }

      } catch (err) {
        console.error("Error in CountryDetails:", err);
        setError(err); // Set the error state
      } finally {
        setLoading(false); // Always set loading to false
      }
    };

    fetchCountryAndBorders(countryNameParam);

  }, [countryNameParam, initialCountryDataFromState, processCountryData]); // Depend on countryNameParam and initial state

  // --- Render Logic ---
  if (loading) {
    return (
      <main>
        <div className="country-details-container">
          <p>Loading country details...</p> {/* Or a shimmer component */}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className="country-details-container record_not_found">
          <b>Error: {error.message}</b>
          <p>Please try navigating back or searching for another country.</p>
        </div>
      </main>
    );
  }

  // If not loading and no error, but countryInfo is null (e.g., API returned no data)
  if (!countryInfo) {
    return (
      <main>
        <div className="country-details-container record_not_found">
          <b>Country data not available.</b>
          <p>Could not load details for this country.</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="country-details-container">
        <span className="back-button" onClick={() => navigate(-1)}> {/* Use navigate(-1) for going back */}
          <i className="fa-solid fa-arrow-left"></i>&nbsp; Back
        </span>
        <div className="country-details">
          <img src={countryInfo.flag} alt={`${countryInfo.name} flag`} />
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
              {
                borderCountryNames.length > 0 ? (
                  borderCountryNames.map((borderName) => (
                    <Link
                      key={borderName} // Use borderName as key if unique, otherwise find a stable ID
                      to={`/${borderName}`} // Assuming your route is /:countryName
                      // Optionally pass state to avoid refetching main country data
                      state={{ name: borderName }} // This might be an issue if your route needs full country object
                    >
                      {borderName}
                    </Link>
                  ))
                ) : (
                  <p>No border countries.</p>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}