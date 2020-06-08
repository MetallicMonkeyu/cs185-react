import React, { Component } from 'react';
import Home from './Home'
import Images from './Images'
import Videos from './Videos'
import Projects from './Projects'
import Form from './Form'
import Movies from './Movies';
import AddMovie from './AddMovie';
import Graph from './Graph';



export class Body extends Component{
	displayContent =() => {
		var activeTab = this.props.activeTab

		if(activeTab===1)
		
			return <Home/>;
		else if (activeTab==2)
			return <Images/>

		else if (activeTab==3)
			return <Videos/>
		else if (activeTab == 4)
			return <Projects/>
		else if (activeTab == 5)
			return <Form/>
		else if (activeTab == 6)
			return <Movies/>
		else if (activeTab == 7)
			return <AddMovie/>
		else
			return <Graph/>

	}
	 
  render(){

    return (this.displayContent());

  }

}


export default Body;
