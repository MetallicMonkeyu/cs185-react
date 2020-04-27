import React, { Component } from 'react';

import proj1 from '../project/android.png'
import proj2 from '../project/Snake.png'



export class Projects extends Component{
  render(){

    return (
    	<div className="projects">
			<div className="exlinks">
				<a href="https://github.com/ShengjiaYu/GourmetSB" >
					<img src={proj1} /></a>
					<div className="projectName">
					<span> <b>Snake Game:</b> <em>Self-made python snake game during Freshman year</em></span>
					</div>
					
			</div>

			<div className="exlinks">
				<a href="https://github.com/ShengjiaYu/snake_revised_v">
					<img src={proj2}/>
				</a>
				<div className="projectName">
				<span><b>CS48 project:</b> <em>CMPSC48 project, which provides daily menus for UCSB dining commons and preference functions </em></span>
				</div>

			</div>

			

		</div>

    	);


  }

}


export default Projects;
