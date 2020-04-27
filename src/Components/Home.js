import React, { Component } from 'react';

import view1 from '../image/View1.jpg'


export class Home extends Component{
  render(){

    return (

    	<div className="home">
			<div className="mainImg">
				<img src= {view1} alt="185"/>
			</div>
			
			<div className='description'>
				<h1>Introducing myself</h1>


				<p>
				My name is Shengjia Yu. I am a graduating senior in Computer Science major. 
				<br></br>I love playing sports, cooking, and playing video games. 
				
				<br></br>Due to quarantine, I can now only cook or play games. 
				<br></br>My favorite game is pokemon. My favorite character is Magikarp, 
				and my friends use it as my nickname. 
				<br></br>Thus, I put Magikarp with graduation suit to represent my very last quarter of college life! :)
				</p>

				

			</div>

		</div>

    	);


  }

}


export default Home;
