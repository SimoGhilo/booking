import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import default styles

// Array of image sources
const srcs = [
  "../img/66355.jpg",
  "../img/976997.jpg",
  "../img/977262.jpg",
  "../img/140012002.jpg",
  "../img/140012293.jpg"
];

let image = document.querySelector('img');

console.log(image);

function Explore() {
  return (
    <div className='grid-container'>
      <div className="box">
        <h2>Explore</h2>

        <Carousel
          autoPlay
          infiniteLoop
          showArrows
          showThumbs={false}
          showStatus={false}
          dynamicHeight
          centerMode
          centerSlidePercentage={35}
          swipeable
        >
          {srcs.map((src, index) => (
            <div className="carousel-slide" key={index}>
              <img src={src[index]} alt={`Slide ${index + 1}`} />
              <p className="legend">Sample text for Slide {index + 1}.</p>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default Explore;
