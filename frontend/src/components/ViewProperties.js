import React, { useEffect, useState } from 'react'

function ViewProperties(props) {

  /** local state */

  const [properties, setProperties] = useState([]);
  const [numberProp, setNumberProp] = useState(0);
  const [actualCity, setActualCity] = useState('');
  const [budget, setBudget] = useState(50); 
  const [rates, setRates] = useState([]);
  const [filterPrice, setFilterPrice] = useState(999999999999);



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
              <input type='checkbox' id="wifi"/>
              <br/>
              <label for="pool">Pool</label>
              <input type='checkbox' id="pool"/>
              <br/>
              <label for="pool">Gym</label>
              <input type='checkbox' id="gym"/>
              <br/>
              <label for="pool">Restaurant/Bar</label>
              <input type='checkbox' id="F&B"/>
              <br/>
              <label for="pool">Free parking</label>
              <input type='checkbox' id="parking"/>
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

        // Only render the property if the minimum rate is less than or equal to the filter price
        if (minRate <= filterPrice) {
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
        // If the property rate is higher than the filter price, don't render it
        return null;
      })}
      <div>
        {/** TODO: 1 fetch feedback  2 filter amenities*/}
      </div>
    </section>
    </div>
  )
}

export default ViewProperties