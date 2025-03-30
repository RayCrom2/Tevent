// src/Slideshow.js
import React from "react";
import Slider from "react-slick"; // Importing the Slider component from react-slick
import './Slideshow.css';  // Update the path as necessary based on your file structure
import rave from '../assets/images/rave.jpg';

import pottery from '../assets/images/pottery.jpeg';





const Slideshow = () => {
  const images = [
    { image: rave, text: 'First Slide', link: 'https://example.com/1' },
    { image: pottery, text: 'Second Slide', link: 'https://example.com/2' },
    // { image: rave2, text: 'Third Slide', link: 'https://example.com/2' },
    // { image: coastpic1, text: 'Fourth Slide', link: 'https://example.com/2' },
    // { image: coastpic1, text: 'Fifth Slide', link: 'https://example.com/2' },
  ];

  
  const settings = {
    dots: true,           // Show dots for navigation
    infinite: true,       // Loop the images
    speed: 500,           // Transition speed
    slidesToShow: 1,      // Show 1 image at a time
    slidesToScroll: 1,    // Scroll 1 image at a time
    autoplay: true,       // Enable autoplay
    autoplaySpeed: 2000,  // Speed of autoplay in ms
  };
  console.log(images);
  return (
    
    <div className="slideshow-container">
      <Slider {...settings}>
  {images.map((slide, index) => (
    <div key={index} className="slide">
      <img src={slide.image} alt={`Slide ${index + 1}`} />
      <div className="overlay-text">{slide.text}</div>
      <a href={slide.link} className="overlay-button">Learn More</a>
    </div>
  ))}
</Slider>
    </div>
  );
};

export default Slideshow;
