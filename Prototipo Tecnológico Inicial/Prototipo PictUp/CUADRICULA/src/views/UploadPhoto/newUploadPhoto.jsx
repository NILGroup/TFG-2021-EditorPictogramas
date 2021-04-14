//import FileDrop  from 'react-file-drop';

import React from 'react';
import { FileDrop } from 'react-file-drop';
import './Upload.css';

//npm i react-file-drop

class Upload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      photo: null
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {

    console.log(event.target.files[0])

    this.setState({
      file: event.target.files[0],
      photo: URL.createObjectURL(event.target.files[0])
    })

    console.log(URL.createObjectURL(event.target.files[0]))
  }

  sendPhoto = (e) => {

    const img = new Image();
    img.src = window.URL.createObjectURL(e);
    img.addEventListener('load', () => {
      var file = {
        url: URL.createObjectURL(e),
        width: img.width,
        height: img.height
      }
      this.props.sendData(file);
    });
  
    //this.props.sendData(e);
  }

drag_and_dropFile = (loadedFiles) => {

  var files = loadedFiles

  for (var i = 0; i < files.length; i++) {
    console.log(files[i])
    console.log(URL.createObjectURL(files[i]))
    this.props.sendData(files[i]);
  }



}

render() {
  return (



    <div>
      <div>
        <FileDrop
          onDrop={(files) => this.drag_and_dropFile(files)}
        >
          Arrastra tus fotos aquí
        </FileDrop>

      </div>
      <input type="file" onChange={this.handleChange} />
      <img height='100px' width='100px' src={this.state.photo} />
      <button onClick={() => this.sendPhoto(this.state.file)}>+</button>
    </div>
  );
}
}
export default Upload;