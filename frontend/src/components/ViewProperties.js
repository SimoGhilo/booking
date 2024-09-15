import React, { useEffect, useState } from 'react'

function ViewProperties(props) {

  /** local state */

  const [properties, setProperties] = useState([]);
  const [numberProp, setNumberProp] = useState(0);
  const [actualCity, setActualCity] = useState('');

 // const[hideProperties, setHidePreview]



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



  
  return (
    <div className='grid-box'>

        <section className='grid-section' id="sidebar">
          <h4>Filters</h4>
        </section>

        <section className='grid-section' id="main-content">
          <h2>{actualCity}: {numberProp} properties found</h2>
          {properties.length > 0 && properties.map((p)=> (
            <>
              <div className='card-property'>
              {console.log(`${process.env.PUBLIC_URL}roomImages/la.jpg`, 'Image Source')}
              <img src={`${process.env.PUBLIC_URL}roomImages/${p.src}`} alt="Hotel" />
                <div className='description-hotel-box'>
                  <h1>{p.name}</h1>
                  <p>{p.address}</p>
                  <p>{p.amenities}</p>
                  <p>{p.description}</p>
                </div>
                <div className='description-hotel-box'>
                  <p>Feedback here</p>
                  <p>£ 200</p>
                  <button className="btn btn-book" type="submit">Book</button>
                </div>
              </div>
            </>
          ))}
          <div>
            {/** TODO: filters, src in DB , style and media queries  */}

        </div>
      </section>
    </div>
  )
}

export default ViewProperties