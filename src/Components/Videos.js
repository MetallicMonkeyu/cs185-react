import React, { Component } from 'react';
import video1 from '../video/LOL_replay1.webm'
import video2 from '../video/LOL_replay2.webm'
import video3 from '../video/LOL_replay3.webm'


export class Videos extends Component{
  render(){

    return (
		<div class = "videos">
            
    <div class="videoslayout">
        <video src={video1} controls="controls" class = 'vid'></video>
        <video src={video2} controls="controls" class = 'vid'></video>
        <video src={video3} controls="controls" class = 'vid'></video>
        <iframe src="https://www.youtube.com/embed/IuS5huqOND4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <iframe src="https://www.youtube.com/embed/QJaLv7XTFTY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <iframe src="https://www.youtube.com/embed/wsey3HvBHic" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <iframe src="https://www.youtube.com/embed/_3YNL0OWio0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        
    </div>
    </div>
    	);


  }

}


export default Videos;
