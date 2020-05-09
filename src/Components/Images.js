import React, { Component } from 'react';

import MyComponent from "./MyComponent";
import SimpleReactLightbox from "simple-react-lightbox";

export class Images extends Component{
	componentDidMount(){
		document.title = 'Shengjia Gallery';
	}
  render(){

    return (
    	<div className="gallary">

			<SimpleReactLightbox>

					<MyComponent />

			</SimpleReactLightbox>


    	</div>
    	);


  }

}


export default Images;
