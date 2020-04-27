// change color
import React, { Component } from 'react';

export class Tab extends Component{

	addStyling = () =>{
		if(this.props.tab.id == this.props.activeTab){
			return {backgroundColor: 'rgb(240, 149, 205)'}
		}
		else{
			return {backgroundColor: '#eddde9'}
		}
	}
  render(){


    return(

      	<div className = 'tab'
      	style={this.addStyling()}
      	onClick={this.props.changeTab.bind(this, this.props.tab.id)}>
      		<a>{this.props.tab.title}</a>
      	</div>


      );
  }

}


export default Tab;
