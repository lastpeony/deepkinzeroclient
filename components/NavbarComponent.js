import React, { Component } from 'react';
import '../styles/Navbar.css'; // import css
import {Link} from '../routes'


export default class NavbarComponent extends Component{

  constructor(props) {
    super(props);
    
    this.state = { 
    };
  }  
  componentDidMount(){
    


  }







  render(){
  
        return(
          <div className="navbar-container">
          <Link route="index">

          <div className="logo-text">
          <span style={{color:"blue"}}>Deep</span>
<span style={{color:"green"}}>KinZero</span>


          </div>
</Link>

<div className="navbar-menu">

<Link route="submit">
<span className="submit-item">Submit</span>
</Link>
<Link route="help">
<span  className="help-item" >Help</span>
</Link>
<Link route="about">
<span className = "about-item">About</span>
</Link>

</div>


          </div>

            
            
            )
    

    



  }




}

