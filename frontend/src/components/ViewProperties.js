import React, { useEffect, useState } from 'react'

function ViewProperties(props) {

  /** local state */

  const [properties, setProperties] = useState([]);
  const [numberProp, setNumberProp] = useState(0);
  const [actualCity, setActualCity] = useState('');
  const [budget, setBudget] = useState(50); 
  const [rates, setRates] = useState([]);
  // Filter states
  const [filterPrice, setFilterPrice] = useState(999999999999);
  const [filterWifi, setFilterWifi] = useState(false);
  const [filterPool, setFilterPool] = useState(false);
  const [filterGym, setFilterGym] = useState(false);
  const [filterFB, setFilterFB] = useState(false);
  const [filterParking, setFilterParking] = useState(false);



  /** Date stuff */

  // Date function for date input, toISOString() returns the date in YYYY-MM-DD, parameter accepted by input
  let today = new Date();
  let localeDateStart = today.toISOString().split('T')[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  let localeDateEnd =  tomorrow.toISOString().split('T')[0];


  /** Check props if they are valid */

  useEffect(()=> {
    if(!props.startDate || !props.endDate)
      {
        props.setStartDate(localeDateStart);
        props.setEndDate(localeDateEnd);
      }

      /** The below states are in the parent component (SearchBar.js), it's used to re-allow preview of cities */

    if(props.searchTerm <= 3 && props.hidePreview)
      {
        props.setHidePreview(false);
      }
    
  }, [props.searchTerm])



/*** APIs, fetch all properties for the search term passed down */

/** helper function to get the properties by searchTerm */

async function fetchProperties(searchTerm) {
  let resJson = await fetch(`http://localhost:5000/api/hotels/city/${searchTerm}`);
  let res = await resJson.json();
  return res;
}

useEffect(() => {
  const getProperties = async () => {
    setProperties(await fetchProperties(props.searchTerm));
  };
  getProperties();
}, [props.searchTerm]);

/*** Hook used only once to save the previous search term and length of properties */

useEffect(()=> {
  setNumberProp(properties.length);
  setActualCity(props.searchTerm);
},[fetchProperties])


async function fetchRates() {
  let resJson = await fetch(`http://localhost:5000/api/rates/`);
  let res = await resJson.json();
  return res;
}

useEffect(() => {
  const getRates = async () => {
    setRates(await fetchRates());
  };
  getRates();
}, [props.searchTerm]);


/** Handle event handlers */

/**Handle filter selections */

const handlePriceFilterChange = (e) => {
  setFilterPrice(e.target.value);
}

/*Handle change of budget */

const handleBudgetChange = (e) => {
  setBudget(e.target.value);
};

/** handle change filters checkbox */
const handleWifiFilter = (e) => {
  setFilterWifi(e.target.checked);
}

const handlePoolFilter = (e) => {
  setFilterPool(e.target.checked);
}

const handleGymFilter = (e) => {
  setFilterGym(e.target.checked);
}

const handleFBFilter = (e) => {
  setFilterFB(e.target.checked);
}

const handleParkingFilter = (e) => {
  setFilterParking(e.target.checked);
}

  
  return (
    <div className='grid-box'>

        <section className='grid-section' id="sidebar">
          <h2>Filter by</h2> 
          <div className='filter-box'>
              <p>Budget per night: £{budget}</p>
              <input 
            type='range' 
            min={50} 
            max={350} 
            value={budget} 
            onChange= {(e) => {
              handleBudgetChange(e);
              handlePriceFilterChange(e);
            }}
          />
          </div>
          <br/>
          <div className='filter-box'>
              <p>Amenities</p>
              <label for="wifi">Wifi</label>
              <input type='checkbox' id="wifi" checked={filterWifi} onChange={handleWifiFilter} />
              <br/>
              <label for="pool">Pool</label>
              <input type='checkbox' id="pool" checked={filterPool} onChange={handlePoolFilter}/>
              <br/>
              <label for="gym">Gym</label>
              <input type='checkbox' id="gym" checked={filterGym} onChange={handleGymFilter}/>
              <br/>
              <label for="F&B">Restaurant/Bar</label>
              <input type='checkbox' id="F&B" checked={filterFB} onChange={handleFBFilter}/>
              <br/>
              <label for="parking">Free parking</label>
              <input type='checkbox' id="parking" checked={filterParking} onChange={handleParkingFilter}/>
              <br/>
          </div>
        </section>

        <section className='grid-section' id="main-content">
      <h2>{actualCity}: {numberProp} properties found</h2>
      {properties.length > 0 && properties.map((p) => {
        // Find the rate for the current property
        const propertyRates = rates.filter((r) => r.hotel_id === p.id);

        // Find the minimum rate for the property to compare with the filter price
        const minRate = Math.min(...propertyRates.map(r => r.rate));

        // Check amenities string for each filter
        const hasWifi = !filterWifi ? true :  (p.amenities).toLowerCase().includes("wifi");
        const hasPool = !filterPool ? true :  (p.amenities).toLowerCase().includes("pool");
        const hasGym = !filterGym ? true :  (p.amenities).toLowerCase().includes("gym");
        const hasFB = !filterFB ? true : p.amenities.toLowerCase().includes("bar") || p.amenities.toLowerCase().includes("restaurant")
        const hasParking = !filterParking ? true : p.amenities.includes("Free parking");

        // Only render the property if all selected filters match
        if ((minRate <= filterPrice) && hasWifi && hasPool && hasGym && hasFB && hasParking) {
          return (
            <div className='card-property' key={p.id}>
              <img src={`${process.env.PUBLIC_URL}/roomImages/${p.src}`} alt="Hotel" />
              <div className='description-hotel-box'>
                <h1>{p.name}</h1>
                <p>{p.address}</p>
                <p>{p.amenities}</p>
                <p>{p.description}</p>
              </div>
              <div className='description-hotel-box'>
                {propertyRates.map((r) => (
                  <div key={r.id}>
                    <p>Room type: {r.room_type}</p>
                    <p>Price per night £{r.rate}</p>
                  </div>
                ))}
                <button className="btn btn-book" type="submit">Book</button>
              </div>
            </div>
          );
        }
        return null;
      })}
      <div>
        {/** TODO: 1 fetch feedback (after users)*/}
      </div>
    </section>
    </div>
  )
}

export default ViewProperties