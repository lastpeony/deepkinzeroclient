import React, { Component } from 'react';
import '../styles/IndexText.css'; // import css
import {Link} from '../routes'


export default class IndexTextComponent extends Component{

  constructor(props) {
    super(props);
    
    this.state = { 
    };
  }  
  componentDidMount(){
    


  }







  render(){
  
        return(
        <div className="index-text-container">
        <span className="index-text-title">

          Zero-shot learning approach to predict<br></br> the kinase acting on a phosphosite.
        </span>
        <p className="index-text-text">
      DeepKinZero is the first zero-shot learning approach to predict the kinase acting on a phosphosite for kinases with no known phosphosite information. DeepKinZero transfers knowledge from kinases with many known target phosphosites to those kinases with no known sites through a zero-shot learning model. The kinase specific positional amino acid preferences are learned using a bidirectional recurrent network.

        </p>
        <Link route="submit">
        <div className="getstarted-button">
          <div style={{display:"flex",alignItems:"center"}} >
<span className="getstarted-text">Get Started  </span>
<img style={{marginLeft:"7px"}} src="../static/rightarrow.png" width="17px" height="17px"></img>
          </div>



        </div>
        </Link>

        <img style={{width:"220",height:"60px",marginTop:"65px"}} src="../static/sulogo.jpg"></img>




        </div>

            
            
            )
    

    



  }




}

