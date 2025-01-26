import React, {useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/Success.css';

function Success() {

  const location = useLocation();
  const navigate = useNavigate();
  const previousPage = location.state?.from;
  const data = location.state?.data;

  // If we do not come from book or we do not have anything in the data object (i.e. we have not chosen anything in the book component, redirect to login)
    
  if(previousPage != '/book' || data.length < 1){
    navigate('/login');
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

          if (!data.authenticated) {
            navigate('/login');
              } 

        } catch (error) {
          navigate('/login');
        } 
      };

      checkAuth();
  }, []);

  /** End auth check */

  return (
  <>
    <div className='Booking-Resume'>
      <img src={`${process.env.PUBLIC_URL}/roomImages/${data.info[0].src}`} />
      <br/>
      <div className='content'>
        <h1>Your booking at {data.info[0].name}</h1>
        <div className='overflow'>
          <table className='upper-table'>
            <thead>
                <th>Check in</th>
                <th>Check-out</th>
                <th>Subtotal</th>
                <th>Room type</th>
            </thead>
            <tbody>
              <tr>
                <td>{data.startDate}</td>
                <td>{data.endDate}</td>
                <td>£ {data.subtotal}</td>
                <td>{data.roomType}</td>
              </tr>
            </tbody>
          </table>
          <br/>
          <table className='lower-table'>
            <thead>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
            </thead>
            <tbody>
              <tr>
                <td>{data.user.name}</td>
                <td>{data.user.surname}</td>
                <td>{data.user.email}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <br/>
    <div className='button-container'>
      <button onClick={()=> navigate('/dashboard')}>Back to dashboard</button>
      <button onClick={()=> navigate('/')}>Back to Home</button>
    </div>
  </>
  )
}

export default Success