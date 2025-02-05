import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './styles/Book.css';

function Book() {

    /** Fetch the property id clicked */
    const location = useLocation();
    const propertyId = location.state?.propertyId;
    const startDate = location.state?.start;
    const endDate = location.state?.end;
    const guests = location.state?.guests;

    // Use navigate
    const navigate = useNavigate();

    // Local state
    const [user, setUser] = useState(null);
    const [info, setInfo] = useState(null); 
    const [rate, setRate] = useState(0);
    const [showModal, setShowModal] = useState(false);


    // Local state that holds chosen rate in the table
    const [chosenRate, setChosenRate] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [roomType, setRoomType] = useState(""); 

    /** Below is a function to fetch all the info by a property id, it will be called after the property id and user are fetched */

    async function getPropertyInfo(propertyId) {
        let resJson = await fetch(`http://localhost:5000/api/hotels/${propertyId}`);
        let res = await resJson.json();
        return res;
      }


      async function getRate(propertyId) {
        let resJson = await fetch(`http://localhost:5000/api/rates/${propertyId}`);
        let res = await resJson.json();
        return res;
      }

    /** Redirect user to success page for success method with data from this component */

    const handleRedirect = () => {
      navigate('/success', { state: { from: window.location.pathname, data:  {chosenRate, subtotal,roomType, user, info, startDate, endDate} }})
    };


    /** Book user */

    async function book(){

      try {

          let send = await fetch('http://localhost:5000/api/reservations/book', {
            method: 'POST',
            body: JSON.stringify({
              user_id: user.id,
              hotel_id: info[0].id,
              rate_id: chosenRate,
              start_date:startDate,
              end_date:endDate
            }),
            headers: { 'Content-Type' : 'application/json'}
          });
    
          let res = await send.json();

          if(res.success){
            handleRedirect();
          } else {
            navigate('/error');
          }
        
      } catch (error) {
        console.log(error);
      }

    }


    /**Below Use effect is to check on whether the user is authenticated or not */
    useEffect(() => {
        const checkAuth = async () => {
          try {
            const response = await fetch('http://localhost:5000/auth/check', {
              method: 'GET',
              credentials: 'include'  // Sends session cookies along with the request
            });

            if(!response.ok){
                navigate('/login');
            }

            const data = await response.json();
            // If the user is authenticated, set the state
            if (data.authenticated) {
                setUser(data.user.user);  // Set the user from the response

                /** Set the info of the given property */
                let info = await getPropertyInfo(propertyId);
                let rate = await getRate(propertyId);
                setInfo(info);
                setRate(rate);
                } else {
                    navigate('/login');
                }

          } catch (error) {
            console.log(error);
          } 
        };

        checkAuth();
    }, []);

    /** Modal opening confirm booking hook */

    useEffect(()=> {
      let modal = document.getElementById('modal-confirm');

      if(showModal){
        if(modal)
          {
            modal.style.display = 'block';
          }
      } else {
        if(modal)
          {
            modal.style.display = 'none';
          }
      }
    }, [showModal]);

    /**Function to maintain the search term when user goes back + redux useSelecto hooks*/

    let previousPage = useSelector((state) => state.history.previousPage);
    let previousSearchTerm = useSelector((state) => state.history.searchTerm);
    let previousDate = useSelector((state) => state.history.previousDate);
    let previousGuests = useSelector((state) => state.history.previousGuests);

    function goBack(){
      navigate(previousPage || '/search', { state: { searchTerm: previousSearchTerm, previousDate, previousGuests } });
    }
    

  return (
    <>
        {showModal && (
        <div id="modal-confirm" className="modal-overlay">
          <div className="modal">
            <h3>Are you sure you want to confirm this booking ?</h3>
              <div>
                <p>Check-in: {startDate}</p>
                <p>Check-out: {endDate}</p>
                <h3>{info[0].name}</h3>
                <p>Address: {info[0].address}</p>
                <p>Room type: {roomType}</p>
                <p>Subtotal: £ {subtotal}</p>
              </div>
            <button className='btn-outline-light' onClick={() => book()}>Confirm</button>
            <button className='btn-outline-light' onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
        )}
        <div className='cont-box'>
          <button className='btn-outline-light' onClick={()=> goBack()}>Go back to search</button>
        </div>
        
        {info && (
      <div className="propBox">
          <div className='col1'>
              { <img className="img-prop"src={`${process.env.PUBLIC_URL}/roomImages/${info[0].src}`}  /> }
          </div>
          <div className='col2'>
              <h3>You are booking in at {info[0].name}</h3>
              <p>Address: {info[0].address}</p>
              <h5>Number of guests: {guests}</h5>
              <h5>Check in: {startDate} from 15:00</h5>
              <h5>Check out: {endDate} before 12:00</h5>
              <h3>Amenities:</h3>
              {info[0].amenities.split(',').map((a) => {
                if(a.toLowerCase().includes('wifi')){
                  return <div className='flex'><img className='icon-amenities' src={`${process.env.PUBLIC_URL}/icons/wifi.png`} /><p className='pDescr'>Wifi</p></div>
                } else if(a.toLowerCase().includes('gym')){
                  return <div className='flex'><img className='icon-amenities'  src={`${process.env.PUBLIC_URL}/icons/weight.png`} /><p className='pDescr'>Gym</p></div>
                } else if(a.toLowerCase().includes('pool')){
                  return <div className='flex'><img className='icon-amenities'  src={`${process.env.PUBLIC_URL}/icons/swimmer.png`} /><p className='pDescr'>Swimming Pool</p></div>
                } else if(a.toLowerCase().includes('sea')){
                  return <div className='flex'><img className='icon-amenities'  src={`${process.env.PUBLIC_URL}/icons/sun-umbrella.png`} /><p className='pDescr'>Sea Front</p></div>
                } else if(a.toLowerCase().includes('bar') || a.toLowerCase().includes('restaurant')){
                  return <div className='flex'><img className='icon-amenities'  src={`${process.env.PUBLIC_URL}/icons/restaurant.png`} /><p className='pDescr'>Food and Drinks outlets</p></div>
                } else if(a.toLowerCase().includes('park')){
                  return <div className='flex'><img className='icon-amenities'  src={`${process.env.PUBLIC_URL}/icons/parked-car.png`} /><p className='pDescr'>Free parking</p></div>
                } else if(a.toLowerCase().includes('conference')){
                  return <div className='flex'><img className='icon-amenities'  src={`${process.env.PUBLIC_URL}/icons/meeting.png`} /><p className='pDescr'>Meeting Room</p></div>
                } else if(a.toLowerCase().includes('hik')){
                  return <div className='flex'><img src={`${process.env.PUBLIC_URL}/icons/hiking.png`} /><p className='pDescr'>hiking trails</p></div>
                } else if(a.toLowerCase().includes('fireplace')){
                  return <div className='flex'><img className='icon-amenities'  src={`${process.env.PUBLIC_URL}/icons/fireplace.png`} /><p className='pDescr'>Fireplace</p></div>
                } else if(a.toLowerCase().includes('spa')){
                  return <div className='flex'><img className='icon-amenities'  src={`${process.env.PUBLIC_URL}/icons/facial-treatment.png`} /><p className='pDescr'>Spa</p></div>
                } else if(a.toLowerCase().includes('tour')){
                  return <div className='flex'><img className='icon-amenities'  src={`${process.env.PUBLIC_URL}/icons/destination.png`} /><p className='pDescr'>Guided tours</p></div>
                }
              })}
          </div>
      </div>
      )}

      <div className='overflow'>
        {rate && (
        <div className='roomBox'>
          <table>
            <thead className='headerTable'>
              <th><h3>Room Type</h3></th>
              <th><h3>Number of guests</h3></th>
              <th><h3>Price</h3></th>
              <th><h3></h3></th>
            </thead>
            <tbody>
            { rate.filter(r => !(guests > 1 && r.room_type.toLowerCase() === 'single')).map((r) => {
              let srcIcon = r.room_type.toLowerCase() == 'single' ? 'two.png' : 'user.png';
              return (
                <tr>
                  <td><p>{r.room_type}</p></td>
                  <td><img className='icon' src={`${process.env.PUBLIC_URL}/icons/${srcIcon}`}  /></td>
                  <td><p>Subtotal £ {r.rate * Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)  )}</p></td>
                  <td><button style={{width:150}} className='btn-outline-light' onClick={()=> {setShowModal(true); setChosenRate(r.id); setSubtotal(r.rate * Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)  )); setRoomType(r.room_type)}}>I will reserve</button></td>
                </tr>
              )
              })
            }
            </tbody>
          </table>
        </div> )}

      </div>
    </>
  )
}

export default Book