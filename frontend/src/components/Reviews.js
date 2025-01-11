import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import './styles/Reviews.css';

function Reviews() {

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
    
    if(reviews.length > 0){
        return (
            <>
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
            <div>No review Available for this hotel</div>
        )
    }
}

export default Reviews