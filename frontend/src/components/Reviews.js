import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'

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

    /**TODO: Style component, media queries, get access for unauthorised user to reviews */
    
    
    
    if(reviews.length > 0){
        return (
            <>
            <h1>Reviews for {reviews[0].name}</h1>
            {reviews.map((r)=> {
                return (
                        <div className='review-box'>
                            <p>{r.rating}</p>
                            <p>{r.email} wrote:</p>
                            <h6>{r.comment}</h6>
                        </div>
                )

            })}
            </>
        )
    } else {
        return (
            <div>No review Available for this hotel</div>
        )
    }
}

export default Reviews