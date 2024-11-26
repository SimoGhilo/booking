import React, {useEffect} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

function Review() {

    const location = useLocation();
    const navigate = useNavigate();
    const previousPage = location.state?.from;
    const data = location.state?.data;
  
    // If we do not come from book or we do not have anything in the data object (i.e. we have not chosen anything in the book component, redirect to login)

    useEffect(() => {
        // Redirect if conditions are not met
        if (!data || previousPage !== '/dashboard' || data.length < 1) {
          navigate('/');
        }
      }, [data, previousPage, navigate]);


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


// TODO: review component, allow post reviews
  return (
    <div>Review</div> 
  )
}

export default Review