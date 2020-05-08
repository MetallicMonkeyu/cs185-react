import React, { Component } from 'react';
import { SRLWrapper } from "simple-react-lightbox"; // Import SRLWrapper

import image1 from '../image/View5.jpg'
import image2 from '../image/View4.jpg'
import image3 from '../image/View3.jpg'
import image4 from '../image/View6.jpg'
import image5 from '../image/View7.jpg'
import image6 from '../image/View8.jpg'
import image7 from '../image/View9.jpg'
import image8 from '../image/View10.jpg'

function MyComponent() {
  return (
    <div className="MyComponent">
      <SRLWrapper>

		  <div className="imagesP images">
		  <img src={image1} width="300px" height="360px" alt="Stir-fried Squid"/>
		  <img src={image2} width="300px" height="360px" alt="Mountain View"/>
		  <img src={image3} width="300px" height="360px" alt="Chinese Noodles"/>
		  <img src={image4} width="300px" height="360px" alt="Online Pictures"/>
		  <img src={image5} width="300px" height="360px" alt="Online Pictures"/>
		  <img src={image6} width="300px" height="360px" alt="Online Pictures"/>
		  <img src={image7} width="300px" height="360px" alt="Online Pictures"/>
		  <img src={image8} width="300px" height="360px" alt="Online Pictures"/>
		  </div>
      </SRLWrapper>
    </div>
  );
}

export default MyComponent;
