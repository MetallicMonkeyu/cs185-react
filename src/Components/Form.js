import React, { Component } from 'react';
import config from '../config.js';
const firebase = require('firebase')

export class Form extends Component {
  constructor(props) {
    super();
    this.state = {
      name: '',
      desc: '',
      msg: '',
      visibility: 'private',
      email: '',
      shouldUpdate: false,
      data: [],
    }
  }

  componentDidMount(){
    document.title = 'Guest Message Form';
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    let ref = firebase.database().ref('data');
    ref.on('value', snapshot => {
      let data = snapshot.val();
        let newData = [];
        let months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
        for (let entry in data) {
          let d = new Date(data[entry].date);
          let date = months[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear()+" ("+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+")";
          newData.push({
            id: entry,
            name: data[entry].name,
            desc: data[entry].desc,
            msg: data[entry].msg,
            visibility: data[entry].visibility,
            email: data[entry].email,
            date: date,
          })
        }
        this.setState({data: newData});
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot){
    if(this.state.shouldUpdate !== prevState.shouldUpdate){
      //same code as above to retrieve the data 
      let ref = firebase.database().ref('data');
      ref.on('value', snapshot => {
        let data = snapshot.val();
        let newData = [];
        let months = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
        for (let entry in data) {
          let d = new Date(data[entry].date);
          let date = months[d.getMonth()]+" "+d.getDate()+", "+d.getFullYear()+" ("+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+")";
          newData.push({
            id: entry,
            name: data[entry].name,
            desc: data[entry].desc,
            msg: data[entry].msg,
            visibility: data[entry].visibility,
            email: data[entry].email,
            date: date,
          })
        }
        this.setState({data: newData});
      })
    }
  }

  myFormHandler = (event) => {
    event.preventDefault();
    if (this.state.name === '') {
      alert("Missing the following required field: name");
    } else if (this.state.msg === '') {
      alert("Missing the following required field: message");
    } else if (this.state.visibility === '') {
      alert("Missing the following required field: visibility");
    } else {
      let formObj = {
        name: this.state.name, 
        desc: this.state.desc,
        msg: this.state.msg,
        visibility: this.state.visibility,
        email: this.state.email,
        date: firebase.database.ServerValue.TIMESTAMP,
      };
      firebase.database().ref('data').push().set(formObj);
      this.setState({shouldUpdate: true});
      alert("Message successfully delivered!");
    }
    this.state = {
      name: '',
      desc: '',
      msg: '',
      visibility: 'private',
      email: '',
      shouldUpdate: false,
      data: [],
    }
  }

  myChangeHandler = (event) => {
    let field = event.target.name;
    let value = event.target.value;
    this.setState({[field]: value});
  }

  render() {
    return (
      <div>
        <div className='content'>
          <div id='form-section'>
            <div className='form'>
            <form onSubmit={this.myFormHandler}>
              <h2>Guest Message Form</h2>
              <span className='note'>You don't need to fill out fields marked by <b>*</b> </span><br></br>
              
              <p> Enter your name:&nbsp;
              <input name='name' placeholder="longer than 5 characters, less than 20" type='text' minLength='6' maxLength='19' required onChange={this.myChangeHandler} /></p>
              <p><b>*</b>Give a brief description about yourself:<br/>
              <input name='desc' placeholder="less than 100 character" type='text' size='50' maxLength='99' onChange={this.myChangeHandler}/>
              </p>
              <p> Leave your message:<br/>
                <textarea name='msg' placeholder="longer than 15 characters, less than 500 characters" minLength='16' maxLength='499' required onChange={this.myChangeHandler}></textarea>
              </p>
              <p> Would you like your name and message to be public to view?<br/>
                  <input type="radio" id="yes" name="visibility" required onChange={this.myChangeHandler} value='public'/>
			            <label for="yes">Yes</label>
							    <input type="radio" id="no" name="visibility" required onChange={this.myChangeHandler} value='private'/>
							    <label for="no">No</label>
            
              </p>
              <p><b>*</b>Your email:
              <input name='email' placeholder="...@examples.com" type='text' size='30' onChange={this.myChangeHandler}/>
              </p>
              <div>
              
              
              </div>
              

              <div className='submitButton'>
                <input type='submit' id='submit' name='submit' value='Submit'></input>
              </div>
            </form>
            </div>
            <div className='responses'>
              <h2 className = 'sections'>Public Messages</h2>
              {this.state.data.map((entry) => {
                if(entry.visibility !== 'private') {
                  if(entry.desc !== '') {
                    return (
                      <div className='response' id={entry.id}>
                        <div>
                          <span className='name'>{entry.name}</span>
                         
                        </div>
                        
                        <div>
                          
                          <span className='date'>{entry.date}</span>
                        </div>
                        <br></br>
                        <span><span>Writer's bio: </span>{entry.desc}</span><br/>
                        <span className='message'><span>Message: </span>{entry.msg}</span><br/>
                      </div>
                    )
                  } else {
                    return (
                      <div className='response' id={entry.id}>
                        <div>
                          <span className='name'>{entry.name}</span>
                         
                        </div>
                        <div>
                        
                          <span className='date'>{entry.date}</span>
                        </div>
                        <br></br>
                        <span className='message'><span>Message: </span>{entry.msg}</span><br/>
                      </div>
                    )
                  }
                }
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Form;