import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



function SearchBar() {

  /**Local state */

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [open, setOpen] = useState(false);
  const datePickerRef = useRef(null);


  return (
  <>
    <form className="form-inline my-2 my-lg-0">
        <div className='searchbar'>
          <input className="form-control mr-sm-2 search-bar-blue" type="search" placeholder="Where are you going ?" aria-label="Search"/>
          <DatePicker
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setOpen(false);
              }}
              open={open}
              onClickOutside={() => setOpen(false)}
              onClickInside={() => setOpen(true)}
              ref={datePickerRef}
              dateFormat="MM/dd/yyyy"
              className="startDateInput"
              placeholderText="Check in"
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
            />
          <DatePicker
              selected={endDate}
              onChange={(date) => {
                setEndDate(date);
                setOpen(false);
              }}
              open={open}
              onClickOutside={() => setOpen(false)}
              onClickInside={() => setOpen(true)}
              ref={datePickerRef}
              dateFormat="MM/dd/yyyy"
              className="endDateInput"
              placeholderText="Check out"
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
            />
          <div class="guests-box">
              <p>Guests ?</p>
              <button className='btn btn-primary'>+</button>
              <button className='btn btn-primary'>-</button>
          </div>
          <button className="btn btn-outline-light my-2 my-sm-0" type="submit">Search</button>
        </div>
    </form>
  </>
  )
}

export default SearchBar