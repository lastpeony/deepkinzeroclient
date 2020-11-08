import React, { Component } from 'react';
import '../styles/Submit.css'; // import css
import {Link} from '../routes'
import cogoToast from 'cogo-toast';
import Rodal from 'rodal';
import BounceLoader from "react-spinners/BounceLoader";
import ClipLoader from "react-spinners/ClipLoader";


import axios from 'axios';

import dynamic from 'next/dynamic'
const ResultComponent = dynamic(() => import('./ResultComponent'), {
  ssr: false
})


import io from 'socket.io-client';

// include styles
import 'rodal/lib/rodal.css';

export default class SubmitComponent extends Component{

  constructor(props) {
    super(props);
    this.kinaseData;
    this.connectingToast;
    this.socket;
    this.transportError;
    this.tableData;
    this.timerInterval;
    this.resultId;
    this.totalSeconds = 0;
    this.candidateKineases = 
    `P07333	Y561	ESYEGNSYTFIDPTQ
P08559	S300	SMSDPGVSYRTREEI
P16220	S133	EILSRRPSYRKILND
P17676	T266	VKSKAKKTVDKHSDE
P22455	Y754	LLAVSEEYLDLRLTF
P23528	S3	_____MASGVAVSDG
P27361	Y204	HTGFLTEYVATRWYR
P29353	Y427	ELFDDPSYVNVQNLD
P29597	Y1055	VPEGHEYYRVREDGD
P30305	S375	ARVLRSKSLCHDEIE
P30307	S216	SGLYRSPSMPENLNR
P35568	S794	QHLRLSTSSGRLLYA
P42224	Y701	DGPKGTGYIKTELIS
P49757	T102	LRVVDEKTKDLIVDQ
P53350	T210	YDGERKKTLCGTPNY
Q13094	Y145	PVEDDADYEPPPSND
Q13158	S194	QNRSGAMSPMSWNSD
Q92934	S75	EIRSRHSSYPAGTED
P29320	Y779	EDDPEAAYTTRGGKI
P54764	Y602	TYVDPFTYEDPNQAV
P29322	Y839	LAYGERPYWNMTNRD
P15260	Y457	KAPTSFGYDKPHVLV
Q04912	Y1360	YVQLPATYMNLGPST
P16410	Y201	SPLTTGVYVKMPPTE
Q02763	Y1048	GMTCAELYEKLPQGY
P54753	Y614	VYIDPFTYEDPNEAV
P50549	S216	PMYQRQMSEPNIPFP
Q16659	S189	YSHKGHLSEGLVTKW
Q92731	S165	GYHYGVWSCEGCKAF
Q15653	S19	DADEWCDSGLGSLGP
Q9Y281	S3	_____MASGVTVNDE
O00303	S46	PAAAPASSSDPAAAA
O15273	S157	GALRRSLSRSMSQEA
P05198	S49	IEGMILLSELSRRRI
P10301	Y66	DPTIEDSYTKICSVD
P19419	T417	ISVDGLSTPVVLSPG
P26038	T558	LGRDKYKTLRQIRQG
P31152	S196	LVTKWYRSPRLLLSP
P42681	Y91	KIQVKALYDFLPREP
P46695	T18	MTILQAPTPAPSTIP
P53667	T508	PDRKKRYTVVGNPYW
P53671	T505	NDRKKRYTVVGNPYW
Q16821	S48	PSRRGSDSSEDIYLD
Q9P286	S573	HRDIKSDSILLTSDG
P52799	Y304	DSVFCPHYEKVSGDY
Q9UIK4	S318	VRRRWKLSFSIVSLC
Q9UPZ9	Y159	SKPPYTDYVSTRWYR
Q9Y2H1	S282	NRRQLAYSTVGTPDY
P02810	S24	QDLDEDVSQEDVPLV
ENSP00000352232	Y439	DRLSQGAYGGLSDRP
ENSP00000261937	Y1337	QVFYNSEYGELSEPS
Q9BXS5	T144	QEGHKLETGAPRPPA
Q96CW1	T156	SQITSQVTGQIGWRR`
    
    
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

    this.socket= io('http://127.0.0.1:4000',{
        reconnection: true,
        origins:"*",

    });

    
    this.socket.on('connected', (data)=>{
        if(this.transportError != true){
            console.log(data)
            this.connectingToast.hide()
            cogoToast.success(
                <span className="warning-text">Connected to DeepKinZero server.</span>
    
            )
        }
      

    });

    this.socket.on('status', (status)=>{
        console.log("some event")
        console.log(status)
        this.setState({status:status})

    });


    this.socket.on('disconnect', (reason)=>{
        console.log(`reason: ${reason}`);
        if(reason !="transport error"){ // transport error is  not a real disconnection. due to blocking
            this.transportError = true
            console.log("disconnected from deepkinzero server.")

            this.setState({showWorkingModal:false})
            
                cogoToast.error(
                    <span className="warning-text">You are disonnected  from DeepKinZero server.Refresh the page to reconnect.</span>
        
                )

        }
        //if client disconnects with transport close, it will reconnect automaticly and retrieve his results.

     
        
     

    });

    this.socket.on("connect_error", ()=>{
  this.connectingToast.hide()
          cogoToast.error(
            <span className="warning-text">Deepkinzero server is down.</span>

        )
        

    });
    this.socket.on("wrong_data", ()=>{
        
        this.setState({showWorkingModal:false})
                cogoToast.warn(
                  <span className="warning-text">Your data input format is wrong.</span>
      
              )
              
      
          });
    this.socket.on("result", (data)=>{
        console.log("result is called!")
        this.tableData = data.resultData
        console.log(this.tableData)
        clearInterval(this.resultChecker)
        this.setState({tableDataReady:true})


    });  
  this.socket.on("resultId", (data)=>{
        console.log("resultid is called!")
        this.resultId = data.resultId
        this.resultChecker = setInterval(()=> this.socket.emit('getResult',this.resultId), 10000);


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


  makeDataReady = (sample)=>{
    var finalData = []
    var dataRowArray = sample.split("\n") // each element is seperated by a tab.
    for(var i=0;i<dataRowArray.length;i++){
        var tempArray = dataRowArray[i].split("\t")
        if(tempArray != "" && tempArray.length >0){
            finalData.push(tempArray)

        }


    }

    this.kinaseData = finalData
    console.log(this.kinaseData)



  }

  loadSample = ()=>{
      this.makeDataReady(this.candidateKineases)
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
    console.log(this.state.sample)
    this.makeDataReady(this.state.sample)
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
            this.makeDataReady(this.state.sample)
      
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
                <span>DeepKinZero is working and it should not take more than  few minutes.</span>
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
<span >ENTER YOUR DATA HERE</span>
<span  onClick={()=>this.loadSample()} className="load-sample-text">LOAD SAMPLE</span>

</div>
<textarea onChange={(e)=>this.textBoxValueChanged(e)} value={this.state.sample}  placeholder="There should be tab delimeted 3 columns:
UNIPROT ID (eg. P07333), phosphosite residue and position (eg. Y561) and 15 neighboring residue of the phosphosite (eg. ESYEGNSYTFIDPTQ here the center Y is the phosphosite)
P07333  Y561    ESYEGNSYTFIDPTQ 
For full example click on Load Sample Data" className="submit-textbox">


</textarea>



</div>
<div className="submit-right-section-container">
<span >
IMPORT KINASE FILE

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

