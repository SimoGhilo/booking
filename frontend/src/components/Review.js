import React, {useEffect, useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/Review.css';

function Review() {

    const location = useLocation();
    const navigate = useNavigate();
    const previousPage = location.state?.from;
    const data = location.state?.data;

    /** Local states */
    const [booking, setBooking] = useState([]);
    const [rating, setRating] = useState(3); 
    const [comment, setComment] = useState("Type your review here...");

    /** Handle start rating change */

    // Function to handle changes in slider value
    const handleChange = (event) => {
      setRating(Number(event.target.value));
    };

    // Function to render stars based on rating
    const renderStars = () => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {  // Assuming a 5-star rating system
        stars.push(
          <span key={i} style={{ color: i <= rating ? '#FFD700' : '#ccc', fontSize: '24px' }}>
            {i <= rating ? '★' : '☆'}
          </span>
        );
      }
      return stars;
    };
  
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

    /** Fetch Booking info */

    useEffect(()=> {

      if (!data) {
        console.log('Data not available, skipping fetch.');
        return;
      }

      const getBookingInfo = async (booking_id) => {
        
        try {
          let data = await fetch(`http://localhost:5000/api/reservations/booking/${booking_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',  // Optional: Set the content type
            },
          });

          if (!data.ok) {
            throw new Error('Failed to fetch booking');
          }
      
          const res = await data.json();
          console.log(res);  // Log to verify data structure
          setBooking(res);

        } catch (error) {
          console.log(error);
        }

      }

      if (data.booking_id) {
        getBookingInfo(data.booking_id);
      }
      

    },[data])


    /** API functions */

    function createReview(user_id, hotel_id, event){

      event.preventDefault();  

      /** TODO: POST review, create route in API */

    }


    return (
      <>
        {booking.length > 0 && (
          <div className='outer-box'>
            <h1>Leave a review for {booking[0].name}</h1>
            <img
              src={`${process.env.PUBLIC_URL}/roomImages/${booking[0].src}`}
              alt={`${booking[0].name} room`}
            />
            <form
              className='review-form'
              id='form-create-review'
              onSubmit={(event) =>
                createReview(data.user.id, booking[0].hotel_id, event)
              }
            >
              <div className='form-group' id='stars-box'>
                <br />
                <label htmlFor='inputText'>Rate your experience from 1 to 5:</label>
                <div style={{ textAlign: 'center' }}>
                  <div>{renderStars()}</div> {/* Display stars */}
                  <input
                    type='range'
                    min='1'
                    max='5'
                    value={rating}
                    onChange={handleChange}
                    style={{ width: '40%', marginTop: '10px' }}
                  />
                  <p>Rating: {rating}/5</p>
                </div>
              </div>
              <div className='form-group fcolumn' id='text-box'>
                <label htmlFor='inputText'>
                  Describe your stay at {booking[0].name}:
                </label>
                <textarea
                  id='inputText'
                  type='text'
                  minLength={30}
                  maxLength={500}
                  value={comment}
                  onChange={(event) => {setComment(event.target.value)}}
                ></textarea>
                <button className='btn-outline-light' type='submit'>
                  Leave review
                </button>
              </div>
            </form>
          </div>
        )}
      </>
    );

}

export default Review