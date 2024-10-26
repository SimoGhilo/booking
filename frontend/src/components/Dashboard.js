import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

function Dashboard() {

    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState([]);


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


    if (loading) {
        return <div>Loading...</div>;
      } else {
        return (
            <>
                <h1>Welcome {user.name}</h1>
                <h4>Bookings & Trips</h4>
            </>
          )
      } 



} 


export default Dashboard