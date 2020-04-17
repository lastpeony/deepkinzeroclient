import React, { Component } from 'react';
import '../styles/Result.css'; // import css
import {Link} from '../routes'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import '../styles/rsuite-table.css'; // or 'rsuite-table/dist/css/rsuite-table.css'


export default class ResultComponent extends Component{

  constructor(props) {
    super(props);
    this.columns =[]
    this.finalTableData =[];
    this.scrollobj = {"x": 500, "y": 500}
    this.state = { 
        show:false,
    };
  }  
  componentDidMount(){
    
    console.log(this.props.tableData)
    
    this.modifyTableData()
    this.setState({show:true})


    //this.generateColumns(this.props.tableData)
   // this.setTableData(this.props.tableData)

  }
  modifyTableData(){
      for(var i=0;i<this.props.tableData.length;i++){

        var tableData = {
            "subID":this.props.tableData[i].subID,
            "Seq":this.props.tableData[i].Seq,
            "first":this.props.tableData[i].Probs[0].uniProtId +":"+this.props.tableData[i].Probs[0].prob,
            "second":this.props.tableData[i].Probs[1].uniProtId +":"+this.props.tableData[i].Probs[1].prob,
            "third":this.props.tableData[i].Probs[2].uniProtId +":"+this.props.tableData[i].Probs[2].prob


        }

        this.finalTableData.push(tableData)


      }


  }

  setTableData = (tableData)=>{

    var finalTableData = []

    for(var i =0;i<tableData.length;i++){
        var row = {
            "SubID":tableData[i].subID,
            "Seq":tableData[i].Seq
        }
        for(var k=0;k<5;k++){ // display first 5 prob

            var uniIdAndProb = tableData[i].Probs[k].uniProtId + ":"+tableData[i].Probs[k].prob.toString().substring(0,6);
            row[k+1] = uniIdAndProb

        }

        finalTableData.push(row)


    }

    this.finalTableData = finalTableData

  }
  generateColumns = (tableData)=>{
    var subIdColumn = {
        title: 'SubID',
        dataIndex: 'SubID',
        key: 'SubID',
        width: 75,
    }
    this.columns.push(subIdColumn)
    var seqColumn = {
        title: 'Seq',
        dataIndex: 'Seq',
        key: 'Seq',
        width: 150, 
    }
    this.columns.push(seqColumn)

    for(var i =1;i<6;i++){ // display first 5 prob
        var kineaseAndProb = {
            title: 'Kinease'+i+" and Probability",
            dataIndex: i,
            key: i,
            width: 150, 
        }
        this.columns.push(kineaseAndProb)


    }


  }






  render(){
    if(this.state.show){
        return(
            <div style={{marginTop:"50px"}}>

<Table height={400} data={this.finalTableData}>
  <Column resizable  width={100} align="center" >
    <HeaderCell className="resultTableHeader">UniProt ID</HeaderCell>
    <Cell >
    {(rowData, rowIndex) => {
      return <span className="resultTableCell">{rowData.subID}</span>
    }}
    </Cell>
  </Column>

  <Column  resizable width={200} align="center">
    <HeaderCell className="resultTableHeader">Sequence</HeaderCell>
    <Cell >
    {(rowData, rowIndex) => {
      return <span className="resultTableCell">{rowData.Seq}</span>
    }}
    </Cell>
  </Column>

  <Column resizable width={200} align="center">
    <HeaderCell className="resultTableHeader">1st Kinase and Probability</HeaderCell>
    <Cell >
    {(rowData, rowIndex) => {
      var idAndProb = rowData.first
      var id = idAndProb.substring(0,idAndProb.indexOf(":")+1)
      var prob = idAndProb.substring(idAndProb.indexOf(":")+1).substring(0,6)
      return <div className="resultTableCell">
      <span style={{color:"blue",fontWeight:"bold"}}>{id}</span>

      <span style={{color:"green",fontWeight:"bold"}}>{prob}</span>
      </div>
    }}
    </Cell>
  </Column>

  <Column resizable width={200} align="center">
    <HeaderCell className="resultTableHeader">2nd Kinase and Probability</HeaderCell>
    <Cell >
    {(rowData, rowIndex) => {
      var idAndProb = rowData.first
      var id = idAndProb.substring(0,idAndProb.indexOf(":")+1)
      var prob = idAndProb.substring(idAndProb.indexOf(":")+1).substring(0,6)
      return <div className="resultTableCell">
      <span style={{color:"blue",fontWeight:"bold"}}>{id}</span>

      <span style={{color:"green",fontWeight:"bold"}}>{prob}</span>
      </div>
    }}
    </Cell>
     </Column>
  <Column resizable width={200} align="center" >
    <HeaderCell className="resultTableHeader">3rd Kinase and Probability</HeaderCell>
    <Cell >
    {(rowData, rowIndex) => {
      var idAndProb = rowData.first
      var id = idAndProb.substring(0,idAndProb.indexOf(":")+1)
      var prob = idAndProb.substring(idAndProb.indexOf(":")+1).substring(0,6)
      return <div className="resultTableCell">
      <span style={{color:"blue",fontWeight:"bold"}}>{id}</span>

      <span style={{color:"green",fontWeight:"bold"}}>{prob}</span>
      </div>
    }}
    </Cell> 
    
    </Column>
</Table>;  
  
            </div>
  
              
              
              )
    }else{


        return null
    }
      
    

    



  }




}

