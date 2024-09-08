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

  const [properties, setProperties] = useState([]);


  // Date function for date input, toISOString() returns the date in YYYY-MM-DD, parameter accepted by input
  let today = new Date();
  let localeDate = today.toISOString().split('T')[0];


  async function fetchPropertiesByCity(searchString)
  {
    /**TODO: fetch API  */

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




  return (
  <>
    <form className="form-inline my-2 my-lg-0" id='formSearch' onSubmit={handleSubmit}>
        <div className='searchbar'>
          <input className="form-control mr-sm-2 search-bar-blue" type="search" placeholder="Where are you going ?" aria-label="Search" onChange={(event) => {
            event.preventDefault();
            setSearchTerm(event.currentTarget.value);
          }}/>
          <input type='date' className='date-input' min={localeDate} onChange={(event) => {
            event.preventDefault();
            setStartDate(event.currentTarget.value);
          }}/>
          <input type='date' className='date-input' onChange={(event) => {
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
    {/** If user is searching, show properties, else show explore setion */}
    {!isSearch && <Explore/>}
    {isSearch && <ViewProperties properties={properties}/>}
  </>
  )
}

export default SearchBar