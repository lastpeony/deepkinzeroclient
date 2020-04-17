import React, { Component } from 'react';
import '../styles/Submit.css'; // import css
import {Link} from '../routes'
import cogoToast from 'cogo-toast';
import Rodal from 'rodal';
import BounceLoader from "react-spinners/BounceLoader";
import ClipLoader from "react-spinners/ClipLoader";

import axios from 'axios';
import ResultComponent from './ResultComponent'
import io from 'socket.io-client';

// include styles
import 'rodal/lib/rodal.css';

export default class SubmitComponent extends Component{

  constructor(props) {
    super(props);
    this.kinaseData;
    this.connectingToast;
    this.socket;
    this.tableData;
    this.timerInterval;
    this.totalSeconds = 0;
    this.candidateKineases = `P29322
Q9Y2K2
Q16654
P53671
Q9UK32
P42681
Q9BWU1
Q8WZ42
Q15120
Q8TDC3
Q96S53
P35916
Q04912
Q9UPZ9
Q9Y6E0
Q12851
O94804
Q9P286
Q02763
Q2M2I8
Q9NZJ5
P53667
P31152
P29323
P07333
Q5VT25
P36507
P54764
P54753
Q15569
Q13523
O43781
Q16659
Q9BQI3
Q9Y2H1
Q9H422
Q9UIK4
P22455
P29320
P23458
    `
    this.state = { 
        sample:"",
        importedFileName:"",
        showWorkingModal:false,
        secondsLabel:"",
        minutesLabel:"",
        tableDataReady:false
    };
  }  
  componentDidMount(){

  this.connectingToast = cogoToast.loading(

    <span className="warning-text">Connecting to Deepkinzero server...</span>


   ,{hideAfter:0})

    this.socket= io('http://localhost:4000',{
        reconnection: false,
        origins:"*"
  

    });

    
    this.socket.on('connected', (data)=>{
        console.log(data)
        this.connectingToast.hide()
        cogoToast.success(
            <span className="warning-text">Connected to DeepKinZero server.</span>

        )

    });

    this.socket.on('status', (status)=>{
        console.log("some event")
        this.setState({status:status})

    });

    this.socket.on('disconnect', (reason)=>{
        console.log(`reason: ${reason}`);

        console.log("disconnected from deepkinzero server.")
        this.setState({showWorkingModal:false})
        cogoToast.error(
            <span className="warning-text">You are disonnected  from DeepKinZero server.Refresh the page to reconnect.</span>

        )

    });

    this.socket.on("connect_error", ()=>{
  this.connectingToast.hide()
          cogoToast.error(
            <span className="warning-text">Deepkinzero server is down.</span>

        )
        

    });

    this.socket.on("result", (data)=>{
        console.log("result is called!")
        console.log(data)
        var data = data.resultData
        this.tableData = this.sequenceToString(data)
        console.log(this.tableData)
        this.setState({tableDataReady:true})


    });  


  }



   pad=(val)=> {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }
  loadSample = ()=>{
    this.kinaseData = this.candidateKineases.split("\n")
    this.kinaseData = this.kinaseData.filter(e => e.trim().length !== 0);
    console.log(this.kinaseData)
    this.setState({sample:this.candidateKineases})


  }
  textBoxValueChanged = (e)=>{

    this.setState({sample:e.target.value})


  }
  clearClicked = ()=>{
      this.setState({sample:"",importedFileName:""})
      this.kinaseData = []
  }

   setTime = ()=> {
    ++this.totalSeconds;
    this.setState({secondsLabel:this.pad(this.totalSeconds % 60),minutesLabel:this.pad(parseInt(this.totalSeconds / 60))})

  }
  sequenceToString = (data)=>{

    for(var i =0;i<data.length;i++){
        var seqString = ""
        for(var k=0;k<data[i].Seq.length;k++){
            seqString+=data[i].Seq[k]
        }
        data[i].Seq = seqString


    }
    return data


  }
  submitClicked = ()=>{
    this.kinaseData = this.state.sample.split("\n")
    this.kinaseData = this.kinaseData.filter(e => e.trim().length !== 0);

    if(!this.socket.connected){
        cogoToast.warn(
            <span className="warning-text">You are not connected.Refresh the page.</span>

        ) 

    }
    else if(this.state.sample == ""){

        cogoToast.warn(
            <span className="warning-text">Please enter kinase input.</span>

        )

        return
    }else if(this.kinaseData !=[]){
        this.socket.emit("analize",this.kinaseData)
          this.setState({showWorkingModal:true})
          this.timerInterval = setInterval(this.setTime, 1000);




    }






  }


  importTxtSelected = (event)=>{
    if (event.target.files && event.target.files[0]) {
        var txtFile = event.target.files[0]

        
        var reader = new FileReader();
        
        reader.addEventListener('load', e=> {
            this.setState({importedFileName:txtFile.name,sample:e.target.result})
            console.log(this.state.sample)
            this.kinaseData = this.state.sample.split("\n")
            this.kinaseData = this.kinaseData.filter(e => e.trim().length !== 0);
            console.log(this.kinaseData)
        });
        
        reader.readAsText(txtFile);


       
  
  
      }


  }

 renderWorkingModal = () =>{
    if(this.state.showWorkingModal){
        return(
            <Rodal showCloseButton={false} visible={this.state.showWorkingModal} >
            <div className="deepkinzero-working-container">
                <span>DeepKinZero is working and it should not take more than a few minutes.</span>
                <br/>
                <div style={{display:"flex",alignItems:"center"}}>
                <span >Status:</span>
                <span style={{color:"green"}}>{this.state.status}</span>
                <div style={{marginLeft:"5px"}}>
                <ClipLoader
          size={15}
        
          //size={"150px"} this also works
          color={"#123abc"}
        />
                </div>
           
                </div>
                <br/>
                <span>Do not close this window.You will be automatically directed to result page when its complete.</span>
                <div style={{display:"inline-block",margin:"0 auto",marginTop:"10px"}}>
                <BounceLoader
          size={75}
          //size={"150px"} this also works
          color={"#123abc"}
        />
        <div className="working-timer">
<span>{this.state.minutesLabel}:</span><span>{this.state.secondsLabel}</span>
        </div>
                </div>
          
            </div>
        </Rodal>
        )
    }
 }



  render(){
  if(this.state.tableDataReady){

    return(
<div>
<ResultComponent tableData={this.tableData}/>

</div>
    )
  }else{
    return(
            
        <div>
                    {this.renderWorkingModal()}

    <div className="submit-container">
    <div className = "submit-upper-container">
<div className="submit-textbox-container">
<div className="submit-textbox-header">
<span >ENTER KINEASES HERE</span>
<span  onClick={()=>this.loadSample()} className="load-sample-text">LOAD SAMPLE</span>

</div>
<textarea  onChange={(e)=>this.textBoxValueChanged(e)} value={this.state.sample}  placeholder="Give information about how to enter kineases to send server here." className="submit-textbox">


</textarea>



</div>
<div className="submit-right-section-container">
<span >
IMPORT KINEASE FILE

</span>
<span>{this.state.importedFileName}</span>


<div style={{display:"flex"}}>
<input className="import-from-computer-input" type="file" id="importFromComputerInput" accept=".txt"   onChange={this.importTxtSelected}/>
<label for="importFromComputerInput" className="import-from-computer-button">
<img  src="../static/attachment.png" width="30px" height="30px"></img>
<span style={{marginLeft:"10px"}}>Import From Computer</span>
</label> 




</div>

</div>


</div>
<hr/>

<div style={{display:"flex"}}>
<div onClick={()=>this.clearClicked()}  className="clear-button"><span>Clear</span></div>
<div onClick={()=>this.submitClicked()}  className="submit-button"><span>Submit</span></div>

</div>
    </div>

        </div>
        
        )


  }
        

    



  }




}

