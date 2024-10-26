import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';

function Dashboard() {

    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const [bookings, setBookings] = useState([]);

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


    if (loading) {
        return <div>Loading...</div>;
      } else {
        return (
          <>
            <div className='container-trips'>
                <h1>Welcome, {user.name}</h1>
                <h4>Bookings & Trips</h4>
                {bookings.map((booking) => {
                  return (
                    <div className='box-trip'>
                      <h2 className='text-box'>{booking.name}</h2>
                      <h4 className='text-box'>{booking.hotelName}</h4>
                      <img src={`${process.env.PUBLIC_URL}/roomImages/${booking.src}`}/>
                      {/** TODO sort out frontend, finish hotel property page and booking page */}
                    </div>
                  )
                })}
            </div>
          </>
          )
      } 



} 


export default Dashboard