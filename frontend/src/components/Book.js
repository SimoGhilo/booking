import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
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

    console.log(rate, 'rate');

  return (
    <div>

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
          </div>
      </div>
      )}

      {rate && (
      <div className='roomBox'>
        { rate.map((r)=> {
          return (
            <div>
              {/* fetch images, style boxes and choose rooms*/ }
              <h2>{r.room_type}</h2>
              <p>Subtotal £ {r.rate * Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)  )}</p>
            </div>
          )
        })

        }
      </div> )}

    </div>
  )
}

export default Book