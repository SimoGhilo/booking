import React, {useState, useEffect} from 'react'
import { useNavigate, useLocation, redirect } from 'react-router-dom';
import './styles/Dashboard.css';

function Dashboard() {

    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const [bookings, setBookings] = useState([]);


    // utility today's date to display the bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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
                setIsAuthenticated(true);
                setLoading(false)
                setUser(data.user.user);  // Set the user from the response
                } else {
                    setIsAuthenticated(false);
                    navigate('/login');
                }

          } catch (error) {
            setIsAuthenticated(false);
          } 
        };

        checkAuth();
    }, []);

    /** End auth check */

    /**Log out */

    async function logout() {
      try {
        const response = await fetch('http://localhost:5000/api/logout', {
          method: 'GET',
          credentials: 'include' 
        });
    
        if (!response.ok) {
          throw new Error(`Logout failed: ${response.statusText}`);
        }
    
        navigate('/login');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    

    /** API call to fetch all bookings for the given user */

    async function fetchBookings(user_id) {

      try {
        const response = await fetch(`http://localhost:5000/api/reservations/${user_id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonRes = await response.json(); // Await the JSON parsing
        return jsonRes;
          } catch (error) {
              console.error("Error fetching bookings:", error);
              return []; // Return an empty array on error
          }
      
    }

    /** Below use effect is to load all the bookings for the given user */

    useEffect(() => {
      async function getBookings() {
          if (user && user.id) { // Ensure user.id exists
              const data = await fetchBookings(user.id);
              setBookings(data);
          }
      }

      getBookings(); // Call the function directly
  }, [user]); 

  /** Function that redirects the user to review component and sends down the data for leaving the review */

  function redirectToReview(booking_id){
    navigate('/review', { state: { from: window.location.pathname, data:  { user, booking_id } }})
  }


    if (loading) {
        return <div>Loading...</div>;
      } else {
        return (
          <>
            <div className='container-trips'>
                <h1>Welcome, {user.name}</h1>
                <h4>Bookings & Trips</h4>
                <button className='btn-outline-red' onClick={()=> logout()}>Log out</button>
                <br/>
                <h1>Past trips</h1>
                {bookings.map((booking) => {
                  if(new Date(booking.end_date) < today){
                    return (
                      <>
                        <div className='box-trip'>
                          <div className='text-div'>
                            <p className='text-box'>{booking.name}</p>
                            <p className='text-box'>{booking.hotelName}</p>
                          </div>
                            <img src={`${process.env.PUBLIC_URL}/roomImages/${booking.src}`}/>
                            <button className='btn-outline-light' onClick={() => redirectToReview(booking.id)}>Review</button>
                          <div>
                            <p>{booking.start_date.slice(0,10)}</p>
                            <p>{booking.end_date.slice(0,10)}</p>
                          </div>
                        </div>
                      </>
                    )
                  } 
                })}
            </div>
            <div className='container-trips'>
              <h1>Upcoming trips</h1>
                {bookings.map((booking) => {
                  if(new Date(booking.end_date) > today){
                    return (
                      <>
                        <div className='box-trip'>
                          <div className='text-div'>
                            <p className='text-box'>{booking.name}</p>
                            <p className='text-box'>{booking.hotelName}</p>
                          </div>
                          <img src={`${process.env.PUBLIC_URL}/roomImages/${booking.src}`}/>
                          <button className='btn-outline-red'>Cancel</button>
                          <div>
                            <p>{booking.start_date.slice(0,10)}</p>
                            <p>{booking.end_date.slice(0,10)}</p>
                          </div>
                        </div>
                      </>
                    )
                  } 
                })}
            </div>
          </>
          )
      } 



} 


export default Dashboard