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

    /** Below is a function to fetch all the info by a property id, it will be called after the property id and user are fetched */

    async function getPropertyInfo(propertyId) {
        let resJson = await fetch(`http://localhost:5000/api/hotels/${propertyId}`);
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
                let info = await getPropertyInfo(propertyId)
                setInfo(info);
                } else {
                    navigate('/login');
                }

          } catch (error) {
            console.log(error);
          } 
        };

        checkAuth();
    }, []);

    console.log(info, 'info');

  return (
    <div>
        {info && (
          <div className="propBox">
          <div className='col1'>
              { <img className="img-prop"src={`${process.env.PUBLIC_URL}/roomImages/${info[0].src}`}  /> }
          </div>
          <div className='col2'>
              <h3>You are booking in at {info[0].name}</h3>
              <h5>Number of guests: {guests}</h5>
              <h5>Check in: {startDate} from 15:00</h5>
              <h5>Check out: {endDate} before 12:00</h5>
          </div>
      </div>
      )}
    </div>
  )
}

export default Book