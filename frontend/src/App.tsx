import axios from 'axios';
import React from 'react';
import './App.css';

const createVeterinar = () => {
  axios.post('http://127.0.0.1:5000/veterinari', {
    jmbg: '1111',
    ime: 'Test',
    prezime: 'Test',
    datumRodjenja: '1998-12-21'
  }).then(function (response) {
    console.log(response.statusText);
  }).catch(function (error) {
    //TODO make custom alert pop-up with detailed text
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  });
}
function App() {
  return (
    <div className="App">
      <button onClick={createVeterinar} >CLICK</button>
    </div>
  );
}

export default App;
