import React, { useEffect, useState } from 'react'

function ViewProperties(props) {

  console.log(props);

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

  
  
  return (
    <div className='container'></div>
  )
}

export default ViewProperties