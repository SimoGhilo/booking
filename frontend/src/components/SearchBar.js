import React, { useState, useRef, useEffect } from 'react';
import Explore from './Explore';
import ViewProperties from './ViewProperties';



function SearchBar() {

  /**Local state */

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [guests, setGuests] = useState(1);
  const [isSearch, setIsSearch] = useState(false);
  const [preview, setPreview] = useState([]);
  const [properties, setProperties] = useState([]);

  /** Date stuff */


  // Date function for date input, toISOString() returns the date in YYYY-MM-DD, parameter accepted by input
  let today = new Date();
  let localeDateStart = today.toISOString().split('T')[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  let localeDateEnd =  tomorrow.toISOString().split('T')[0];

  // Ensure the end date is always after the start date
  useEffect(() => {
    if (startDate && endDate && endDate < startDate) {
      setEndDate('');
    }
  }, [startDate, endDate]);

  // Helper function to get startDate + 1 day for endDate min
  const getMinEndDate = (startDate) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };



  /** API calls, fetch data */


  async function fetchPropertiesByCity(searchString)
  {

    try {
      let res = await fetch(`http://localhost:5000/api/hotels/city/${searchString}`);

      let data = await res.json();

      return data;
      
    } catch (error) {
      console.log(error);
    }

  }

  async function handleSubmit(event){
    event.preventDefault();
    setIsSearch(true);
    let properties = await fetchPropertiesByCity(searchTerm);
    setProperties(properties);
  }


  /** fetch cities to preview them to the user in the searchbar */
    /** Preview search term */


  function fetchPreview(searchTerm){

    fetch(`http://localhost:5000/api/cities/${searchTerm}`).
    then((resJson)=> {
      return resJson.json();
    }).then((res)=> {
      setPreview(res);
    }).catch((err)=> console.log(err));

  }


  useEffect(()=> {
    if(searchTerm.length >= 3)
      {
        let resCities = fetchPreview(searchTerm)  
        setPreview(resCities)
      } else {
        setPreview([])
      }
  }, [searchTerm]);




  return (
  <>
    <form className="form-inline my-2 my-lg-0" id='formSearch' onSubmit={handleSubmit}>
        <div className='searchbar'>
          <input className="form-control mr-sm-2 search-bar-blue" type="search" placeholder="Where are you going ?" aria-label="Search" onChange={(event) => {
            event.preventDefault();
            setSearchTerm(event.currentTarget.value);
          }}/>
          <input type='date' className='date-input' min={localeDateStart} value={startDate || ''} onChange={(event) => {
            event.preventDefault();
            setStartDate(event.currentTarget.value);
          }}/>
          <input type='date' className='date-input' min={startDate ? getMinEndDate(startDate) : localeDateEnd}
            value={endDate || ''} onChange={(event) => {
            event.preventDefault();
            setEndDate(event.currentTarget.value);
          }}/>
          <div class="guests-box">
              <p>Guests ?</p>
              <button className='btn btn-primary plusminus' onClick={(event) => {
                event.preventDefault();
                 if(guests <= 3)
                  {
                    setGuests(guests + 1);
                  }
              }}>+</button>
              <p className='guestsP'>{guests}</p>
              <button className='btn btn-primary plusminus' onClick={(event) => {
                event.preventDefault();
                 if(guests > 1)
                  {
                    setGuests(guests - 1);
                  }
              }}>-</button>
          </div>
          <button className="btn btn-outline-light my-2 my-sm-0" type="submit">Search</button>
        </div>
    </form>
    {
            preview && preview.length > 0 && (
              <>
                {preview.map((p) => (
                  <div className='boxPreview' key={p.name}>
                    <h2><a>{p.name}</a></h2>
                    <span>{p.country}</span>
                  </div>
                ))}
              </>
            )
          }
    {/** If user is searching, show properties, else show explore setion */}
    {!isSearch && <Explore/>} 
    {isSearch && <ViewProperties startDate={startDate} endDate={endDate} properties={properties} guests={guests}/>}
  </>
  )
}

export default SearchBar