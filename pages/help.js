import React, { Component } from 'react';
import dynamic from 'next/dynamic'
import Navbar from '../components/NavbarComponent'
import '../styles/Reset.css'; // import css
import '../styles/Navbar.css'; // import css

import {Link} from '../routes'
import {Router} from '../routes'


export default class Help extends Component{


  constructor(props) {
    super(props);
 


    this.state = { 
  
    };
  }  

  componentDidMount(){



  }



render(){

    return(


        <div>
        <Navbar/>
              <span>help page</span>
        
        </div>
    )
 
  
 


}
}



