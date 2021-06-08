//import FileDrop  from 'react-file-drop';

import React from 'react';
// import { FileDrop } from 'react-file-drop';
import './Upload.css';

//npm i react-file-drop

class Upload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      photo: null,
      isLoaded: false,
      text: "",
    }
    this.handleChange = this.handleChange.bind(this)
    this.upload = this.upload.bind(this);
  }

  handleChange(event) {

    this.setState({
      file: event.target.files[0],
      isLoaded: true,
      photo: URL.createObjectURL(event.target.files[0]),
    })

  }

  sendPhoto = (inputImage) => {
    const img = new Image();
    img.src = window.URL.createObjectURL(inputImage);
    img.addEventListener('load', () => {
      var file = {
        url: URL.createObjectURL(inputImage),
        width: img.width,
        height: img.height,
        text: this.state.text,
      }
      this.props.sendData(file);
    });
  }

  drag_and_dropFile = (loadedFiles) => {

    var files = loadedFiles

    for (var i = 0; i < files.length; i++) {
      this.props.sendData(files[i]);
    }
  }

  upload(event) {
    event.preventDefault();
    this.dofileUpload.click()
  }

  renderFoto() {
    if (this.state.isLoaded) {
      return (


        <div className="container">
          <div className="row p-2">
            <div className="col">
              <img src={this.state.photo} />
            </div>
          </div>
          <div className="row">

          </div>
          <div className="row p-2">
            <div className="col-9">
              <div className="input-group input-group-lg">
                <input type="text" placeholder="Texto inferior..." className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" 
                  onChange={e => this.setState({ text: e.target.value })}
                />
              </div>
            </div>
            <div className="col-3">
              <button className="btn btn-success btn-lg" onClick={() => this.sendPhoto(this.state.file)}>
                <i className="fas fa-plus"></i>

              </button>

            </div>
          </div>
        </div>



      )
    }
  }

  render() {
    return (
      <div>
        {/* <div>
        <FileDrop
          onDrop={(files) => this.drag_and_dropFile(files)}
        >
          Arrastra tus fotos aquí
        </FileDrop>

      </div> */}
        <div className="container">
          <div className="row p-2">
            <p>
              <button className="btn btn-outline-info " onClick={this.upload}><i className="far fa-image"></i>
                &nbsp; Cargar foto
              </button>
            </p>
          </div>
        </div>


        <input type="file" className="hidden" style={{ display: 'none' }}
          multiple={false}
          accept=".png, .gif, .jpeg, .jpg"
          onChange={evt => this.handleChange(evt)}
          ref={e => this.dofileUpload = e}
        />
        {this.renderFoto()}

      </div>
    );
  }
}
export default Upload;