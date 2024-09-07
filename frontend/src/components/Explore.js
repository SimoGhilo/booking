import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import default styles
import img1 from "../img/66355.jpg";
import img2 from "../img/976997.jpg";
import img3 from "../img/977262.jpg";
import img4 from "../img/140012002.jpg";
import img5 from "../img/140012293.jpg";

// Array of image sources
const srcs = [img1, img2, img3, img4, img5];
const names = ['Cornwall', 'Edinburgh', 'London', 'Leeds', 'Portsmouth'];




function Explore() {
  return (
    <div className='grid-container'>
      <div className="box">
        <h2>Explore the UK</h2>

        <Carousel
          autoPlay
          infiniteLoop
          showArrows
          showThumbs={false}
          showStatus={false}
          dynamicHeight
          centerMode
          centerSlidePercentage={25}
          swipeable
        >
          {srcs.map((src, index) => (
            <div className="carousel-slide" key={index}>
              <img src={src}/>
              <p className='legend'>{names[index]}</p>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default Explore;
