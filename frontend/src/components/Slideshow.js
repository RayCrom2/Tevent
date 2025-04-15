// src/Slideshow.js
import React from "react";
import Slider from "react-slick"; // Importing the Slider component from react-slick

{/* Import Images */}
import rave from '../assets/images/rave.jpg';
import motox from '../assets/images/motox.jfif';
import pottery from '../assets/images/pottery.jpeg';
import mclaren from '../assets/images/mclarenrace.webp';
import fleaMkt from '../assets/images/fleamkt.jpg';

{/* Styling */}
import '../styles/Slideshow.css';  // Update the path as necessary based on your file structure


const Slideshow = () => {

  const eventsUrl = `${window.location.href}events`; // Append '/events' to the current path
  console.log(eventsUrl);

  const images = [
    { image: rave, 
      text: "Feel the pulse of the night! 🎉 Dive into the electric atmosphere of our raves.", 
      linkText: "Click here",
      postLinkText: "to discover the most exhilarating parties near you. Don't miss out on the beat!",
    },
    { image: motox, 
      text: "Get dirty, get fast! 🏍️ Feel the rush of motor cross races. Join the mud-slinging action by", 
      linkText: "clicking here",
      postLinkText: "to find events that rev your engine. Race into the adventure!",
    },
    { image: pottery, 
      text: "Unleash your creativity with clay! 🏺 Explore pottery workshops near you.", 
      linkText: "Click here",
      postLinkText: "to start your journey into arts and crafts. Shape your first masterpiece today!",
    },
    { image: mclaren, 
      text: "Ready, set, thrill! 🏁 Experience the adrenaline of super sport races. Join the excitement and witness the speed live.", 
      linkText: "Click here",
      postLinkText: "to find races speeding your way!",
    },
    { image: fleaMkt, 
      text: "Treasure awaits! 🛍️ Wander through vibrant flea markets filled with surprises.", 
      linkText: "Click here",
      postLinkText: "to discover unique finds and hidden gems at a market near you. Happy hunting!",
    }
  ];

  
  const settings = {
    dots: false,           // Show dots for navigation
    infinite: true,       // Loop the images
    speed: 1000,           // Transition speed
    slidesToShow: 1,      // Show 1 image at a time
    slidesToScroll: 1,    // Scroll 1 image at a time
    autoplay: true,       // Enable autoplay
    autoplaySpeed: 8000,  // Speed of autoplay in ms
  };
  
  return (
    <div className="slideshow-container">
  <Slider {...settings}>
    {images.map((slide, index) => (
      <div key={index} className="slide">
        <img src={slide.image} alt={`Slide ${index + 1}`} />
        <div className="overlay-text">
          {slide.text}
          {' '}
          <a href={eventsUrl} className="overlay-link">{slide.linkText}</a>
          {' '}
          {slide.postLinkText}
        </div>
      </div>
    ))}
  </Slider>
</div>

  );
};

export default Slideshow;
