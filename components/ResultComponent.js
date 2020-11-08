import React, { Component } from 'react';
import '../styles/Result.css'; // import css
import {Link} from '../routes'
import { Table, Column, HeaderCell, Cell } from 'rsuite-table';
import '../styles/rsuite-table.css'; // or 'rsuite-table/dist/css/rsuite-table.css'
import jsPDF from 'jspdf';
import 'jspdf-autotable'

import html2canvas from 'html2canvas';
window.html2canvas = html2canvas;


export default class ResultComponent extends Component{

  constructor(props) {
    super(props);
    this.columns =[]
    this.finalTableData =[];
    this.csvData = [];
    this.scrollobj = {"x": 500, "y": 500}
    this.state = { 
        show:false,
    };
  }  
   chunk = (arr, size) => (
    arr.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(arr.slice(i, i + size))
      return acc
    }, [])
  )
  componentDidMount(){
    
    console.log(this.props.tableData)
    this.csvData = this.props.tableData
    this.modifyTableData()
    console.log(this.finalTableData)
    this.setState({show:true})


    //this.generateColumns(this.props.tableData)
   // this.setTableData(this.props.tableData)

  }
  modifyTableData =()=>{ // 0st element of tableData array is column names.
      for(var i=1;i<this.props.tableData.length;i++){
        console.log(i)
        var splitedRow = this.props.tableData[i].split(",")

        splitedRow.splice(splitedRow.indexOf("''"), 1);
        console.log(splitedRow)
        var tableData = {
            "subID":splitedRow[2], // subId is substrate protein.
            "Seq":splitedRow[3],
      

        }
        splitedRow.splice(0,4)
        var chunkedRowData = this.chunk(splitedRow,3)//remove unnecessary columns so left are:Predicted Kinase UniProt ID,Predicted Kinase Name,Predicted Probability
        console.log(chunkedRowData)
        //each chunk has 3 elements, Predicted Kinase UniProt ID,Predicted Kinase Name,Predicted Probability
        
          tableData.first = chunkedRowData[0][0]+":"+chunkedRowData[0][2]
          tableData.second = chunkedRowData[1][0]+":"+chunkedRowData[1][2]
          tableData.third = chunkedRowData[2][0]+":"+chunkedRowData[2][2]
        this.finalTableData.push(tableData)

        
      }


  }
  makePdfData = ()=>{

    var pdfData = []

    this.finalTableData.map(row =>{
      var tempArray = []
      var rowData = row
      var idAndProbFirst = rowData.first
          var idFirst = idAndProbFirst.substring(0,idAndProbFirst.indexOf(":")+1)
          var probFirst = idAndProbFirst.substring(idAndProbFirst.indexOf(":")+1).substring(0,6)
    
          var idAndProbSecond = rowData.second
          var idSecond = idAndProbSecond.substring(0,idAndProbSecond.indexOf(":")+1)
          var probSecond = idAndProbSecond.substring(idAndProbSecond.indexOf(":")+1).substring(0,6)
    
          var idAndProbThird = rowData.third
          var idThird = idAndProbThird.substring(0,idAndProbThird.indexOf(":")+1)
          var probThird = idAndProbThird.substring(idAndProbThird.indexOf(":")+1).substring(0,6)
          tempArray.push(rowData.subID)
          tempArray.push(rowData.Seq)
          tempArray.push(idFirst+probFirst)
          tempArray.push(idSecond+probSecond)
          tempArray.push(idThird+probThird)
          pdfData.push(tempArray)

     






    })

    return pdfData


  }

  exportPdf = () => {
   
    var pdf = new jsPDF();
    var pdfData = this.makePdfData()
    pdf.autoTable({
      head: [['UniProtID', 'Sequence', '1st Kinase and Probability','2nd Kinase and Probability','3rd Kinase and Probability']],
      body:pdfData
    })
    
    pdf.save('deepkinzero_predictions.pdf')
    
  }

  exportCsv = ()=>{
    var text = ""
    var filename = "deepkinzero_predictions.csv"
      for(var i=0;i<this.csvData.length;i++){
        text+= this.csvData[i]+"\n"

      }
      var file = new Blob([text], {type: 'text/csv'});
      if (window.navigator.msSaveOrOpenBlob) 
          window.navigator.msSaveOrOpenBlob(file, filename);
      else { // Others
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var csvUrl = URL.createObjectURL(file);
        a.href =  csvUrl;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href)
        a.remove();
      }





  }
  



renderPdfTableData = ()=>{
  return(
    
    this.finalTableData.map(row=>{
      var rowData = row
      var idAndProbFirst = rowData.first
          var idFirst = idAndProbFirst.substring(0,idAndProbFirst.indexOf(":")+1)
          var probFirst = idAndProbFirst.substring(idAndProbFirst.indexOf(":")+1).substring(0,6)
    
          var idAndProbSecond = rowData.second
          var idSecond = idAndProbSecond.substring(0,idAndProbSecond.indexOf(":")+1)
          var probSecond = idAndProbSecond.substring(idAndProbSecond.indexOf(":")+1).substring(0,6)
    
          var idAndProbThird = rowData.third
          var idThird = idAndProbThird.substring(0,idAndProbThird.indexOf(":")+1)
          var probThird = idAndProbThird.substring(idAndProbThird.indexOf(":")+1).substring(0,6)
      return(
    <tr>
    <th>{rowData.subID}</th>
    <th>{rowData.Seq}</th>
    <th>
    <span style={{color:"blue",fontWeight:"bold"}}>{idFirst}</span>
    
    <span style={{color:"green",fontWeight:"bold"}}>{probFirst}</span>
    
    </th>
    <th>
    <span style={{color:"blue",fontWeight:"bold"}}>{idSecond}</span>
    
    <span style={{color:"green",fontWeight:"bold"}}>{probSecond}</span>
    
    </th>
    <th>
    <span style={{color:"blue",fontWeight:"bold"}}>{idThird}</span>
    
    <span style={{color:"green",fontWeight:"bold"}}>{probThird}</span>
    
    </th>
    
    </tr>
    
      )
    
    
    



    })

      
    
    

    
  )




}


  render(){
    if(this.state.show){

        return(
            <div style={{marginTop:"50px"}}>

<table id="resulttable" style={{position:"absolute",top:0,left:0,zIndex:-1,visibility:"hidden"}}>
  <tr>
    <th>UniProtID</th>
    <th>Sequence</th>
    <th>1st Kinase and Probability</th>
    <th>2nd Kinase and Probability</th>
    <th>3rd Kinase and Probability</th>

  </tr>
 {this.renderPdfTableData()}
</table>



<Table  autoHeight={false} data={this.finalTableData}>
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
      var idAndProb = rowData.second
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
      var idAndProb = rowData.third
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
  <div style={{display:"flex"}}>
  <img style={{cursor:"pointer"}} onClick={()=> this.exportPdf()} width="250px" height="55px" src="../static/downloadpdf.png"/>

<img style={{marginLeft:"12px",cursor:"pointer"}} onClick={()=> this.exportCsv()} width="55px" height="75px" src="../static/downloadcsv.png"/>

  </div>



            </div>

  
              
              
              )
    }else{


        return null
    }
      
    

    



  }




}

