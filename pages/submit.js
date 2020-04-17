import React, { Component } from 'react';
import dynamic from 'next/dynamic'
import Navbar from '../components/NavbarComponent'
import SubmitComponent from '../components/SubmitComponent'

import 'rodal/lib/rodal.css';
import '../styles/rsuite-table.css'; // or 'rsuite-table/dist/css/rsuite-table.css'

import '../styles/Reset.css'; // import css
import '../styles/Navbar.css'; // import css
import '../styles/IndexText.css'; // import css

import {Link} from '../routes'
import {Router} from '../routes'


export default class Submit extends Component{


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
<SubmitComponent/>
</div>
  

  
    )
 
  
 


}
}



