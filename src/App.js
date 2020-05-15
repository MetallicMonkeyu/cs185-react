import React, { Component } from 'react';

import './App.css'
import Body from './Components/Body'
import TabList from './Components/TabList'


export class App extends Component{
  constructor(){
    super();
    this.state ={
      activeTab: 1
    }
    this.changeTab = (id) => {
      this.setState({
        activeTab: id
      })
    }
  }
  render(){
    const tabs = [
    {
      id:1,
      title: 'Home'
    },

    {
      id:2,
      title: 'Images'
    },

    {
      id:3,
      title: 'Videos'
    },

    {
      id:4,
      title: 'Projects'
    },
    {
      id:5,
      title: 'Guest Form'
    },
    {
      id:6,
      title: 'Favorite movies'
    }

    ]


    return(



      <div className= "body">

        <div className = "header">
          <h1>Welcome to Shengjia's Webpage! </h1>
        </div>



        <div className ="navheader">


          < TabList tabs={tabs}
          changeTab={this.changeTab}

          activeTab={this.state.activeTab} />


        </div>


        <div className ="main-body">
          <Body activeTab={this.state.activeTab}/>
        </div>

        <div >
        <table className="table">
        <tr>
					<th>Name</th>
					<th>Major</th>
					<th>Class</th>
					<th>Email</th>
				</tr>
        <tr>
					<td>Shengjia Yu</td>
					<td>Computer Science</td>
					<td>Senior</td>
					<td>shengjia@ucsb.edu</td>
				</tr>
              </table>
        </div>


      </div>

      );
  }
}


export default App;