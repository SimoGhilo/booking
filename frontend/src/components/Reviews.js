import React, {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './styles/Reviews.css';

function Reviews() {

    /**navigate hook */
    const navigate = useNavigate();

    const {hotel_id} = useParams();

    /**Local state */
    const [reviews, setReviews] = useState([]);
    
    /**fetch all reviews for one hotel id */

    useEffect(()=> {
        
        async function fetchReviews(hotel_id) {
            if(!hotel_id) return false;

            try {

                let jsonRes = await fetch(`http://localhost:5000/api/review/${hotel_id}`);

                let decodedData = await jsonRes.json();

                return decodedData;

            } catch (error) {
                console.log("Error in try catch: ", error);
            }
        }

        // Perform async function to set state

        fetchReviews(hotel_id).then((r)=> {
            setReviews(r);
        })


    }, []);

    /**Function to maintain the search term when user goes back + redux useSelecto hooks*/

    let previousPage = useSelector((state) => state.history.previousPage);
    let previousSearchTerm = useSelector((state) => state.history.searchTerm);
    let previousDate = useSelector((state) => state.history.previousDate);
    let previousGuests = useSelector((state) => state.history.previousGuests);

    function goBack(){
      navigate(previousPage || '/search', { state: { searchTerm: previousSearchTerm, previousDate, previousGuests } });
    }
    
    if(reviews.length > 0){
        return (
            <>
            <div className='cont-box'>
            <button className='btn-outline-light' onClick={()=> goBack()}>Go back to search</button>
            </div>
            <div className='outer-box'>
                <h1>Reviews for {reviews[0].name}</h1>
                {reviews.map((r)=> {
                    const stars = Array(r.rating).fill('⭐');
                    return (
                            <div className='review-box'>
                                <div className='rating-box'>
                                    <p><span>⭐</span></p>
                                    <p>{r.rating}</p>
                                </div>
                                <div className='text-box'>
                                    <p>{r.email} wrote:</p>
                                    <h6>{r.comment}</h6>
                                    <p className='on'>On: {r.created_at.slice(0,10)}</p>
                                </div>
                            </div>
                    )

                })}
            </div>
            </>
        )
    } else {
        return (
            <div>
                <p>No review Available for this hotel</p>
                <button className='btn-outline-light' onClick={()=> goBack()}>Go back to search</button>
            </div>
        )
    }
}

/** TODOs: home page, final check media queries, sort out modal styles */

export default Reviews