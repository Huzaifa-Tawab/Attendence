import "./App.css";
import * as XLSX from "xlsx";
import React, { useState, useEffect } from "react";
import moment, {} from "moment/moment";
import 'bootstrap/dist/css/bootstrap.min.css';
// import Table from 'react-bootstrap/Table';
function App() {
  // var data_final = [];
  const [data_final, SetDataFinal] = useState([]);
  const [start, SetStart] = useState(false);

  const [file, setFile] = useState();

  useEffect(() => {
    readExcel(file);

    console.log("daaaaataaa : ");

    console.log(data_final,file,readExcel);
  }, [start]);
  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });

        const wsname = wb.SheetNames[0];

        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });

    promise.then((d) => {
      var entery_time = 0;
      var exit_time = 0;
      var time_of_employe = 0;
      var total_time_of_employe = 0;

      var _name = d[1].Name;
      var last_row = d.length;
      for (var i = 0; i < last_row; i++) {
        if (_name === d[i].Name) {
          // console.log("same "+i);
          if (d[i].State === "C/In") {
            entery_time = d[i].Time;
            // console.log( _name+" Enterned on "+d[i].Time)
          } else if (d[i].State === "C/Out") {
            exit_time = d[i].Time;
            // console.log( _name+" Exited on "+d[i].Time)
            var diff = moment.duration(
              moment(exit_time).diff(moment(entery_time))
            );
            time_of_employe = diff.asMinutes();
            total_time_of_employe = total_time_of_employe + time_of_employe;
          }
        } else if (
          d[i].Name !== _name &&
          (d[i].State === "C/In" || d[i].State === "C/Out")
        ) {
          data_final.push({ _name, total_time_of_employe });
          console.log(
            "the total time of " +
              _name +
              " is equal to : " +
              total_time_of_employe
          );

          _name = d[i].Name;
          console.log("Name changed to " + _name);
          SetStart(false);
          SetDataFinal(data_final);
        } else {
        }
      }
    });
  };

  return (
    <>
      {/* <div>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            // readExcel(file);
            setFile(file);
            SetStart(true);
          }}
        />
      </div>
      <table striped bordered hover>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Username</th>
        </tr>
      </thead>
          <tbody>
        {data_final != null
          ? data_final.map((data, index) => (
              <tr key={index}>
                <td>{data._name}</td>
                <td>{data.total_time_of_employe}</td>
              </tr>
            ))
          : " "}
          </tbody>
      </table> */}

<section>

  <h1>Attendace To Hours Converter</h1>
 <h5> <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            // readExcel(file);
            setFile(file);
            SetStart(true);
          }}
        /></h5>
  <div class="tbl-header">
    <table cellpadding="0" cellspacing="0" border="0">
      <thead>
        <tr>

          
          <th>Name</th>
          <th>Minutes</th>
          <th>Hours</th>
        </tr>
      </thead>
    </table>
  </div>
  <div class="tbl-content">
    <table cellpadding="0" cellspacing="0" border="0">
      <tbody>
        
      {data_final != null
          ? data_final.map((data, index) => (
              <tr key={index}>
                <td>{data._name}</td>
                <td>{data.total_time_of_employe}</td>
                <td>{data.total_time_of_employe/60}</td>
              </tr>
            ))
          : " "}
        
      </tbody>
    </table>
  </div>
</section>



<div class="made-with-love">
  Made with
  <i> ♥</i> by 
  <a target="_blank" href="www.softxion.tech"> SoftXion</a>
</div>

    </>
  );
}

export default App;
