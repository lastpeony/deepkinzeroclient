import React, { Component } from 'react';
import dynamic from 'next/dynamic'
import Navbar from '../components/NavbarComponent'
import '../styles/Reset.css'; // import css
import '../styles/Navbar.css'; // import css

import {Link} from '../routes'
import {Router} from '../routes'
import Faq from 'react-faq-component';

const data = {
  title: "Frequently Asked Questions",
  rows: [
    {
      title: "What is DeepKinZero?",
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed tempor sem. Aenean vel turpis feugiat, 
              ultricies metus at, consequat velit. Curabitur est nibh, varius in tellus nec, mattis pulvinar metus. 
              In maximus cursus lorem, nec laoreet velit eleifend vel. Ut aliquet mauris tortor, sed egestas libero interdum vitae. 
              Fusce sed commodo purus, at tempus turpis.`
    },
    {
      title: "How does DeepKinZero work?",
      content: "Nunc maximus, magna at ultricies elementum, risus turpis vulputate quam, vitae convallis ex tortor sed dolor."
    },
    {
      title: "Curabitur laoreet, mauris vel blandit fringilla",
      content: `Curabitur laoreet, mauris vel blandit fringilla, leo elit rhoncus nunc, ac sagittis leo elit vel lorem. 
            Fusce tempor lacus ut libero posuere viverra. Nunc velit dolor, tincidunt at varius vel, laoreet vel quam. 
            Sed dolor urna, lobortis in arcu auctor, tincidunt mattis ante. Vivamus venenatis ultricies nibh in volutpat. 
            Cras eu metus quis leo vestibulum feugiat nec sagittis lacus.Mauris vulputate arcu sed massa euismod dignissim. `
    },
  ]
}
 
const styles = {
  // bgColor: 'white',
  titleTextColor: 'blue',
  rowTitleColor: 'blue',
  // rowContentColor: 'grey'
}
export default class About extends Component{


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
   

        </div>
    )
 
  
 


}
}



