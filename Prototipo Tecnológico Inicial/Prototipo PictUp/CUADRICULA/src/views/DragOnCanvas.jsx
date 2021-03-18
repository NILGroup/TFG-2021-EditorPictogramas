// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React, { Component } from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

import Canvas from '../components/Canvas/Canvas';
import CanvasItem from '../components/Canvas/CanvasItem';
import PictoItem from '../components/Canvas/PictoItem';
import LineItem from '../components/Canvas/LineItem';
import FigureItem from '../components/Canvas/FigureItem';
import CanvasImage from '../components/Canvas/CanvasImage';
import TextItem from '../components/Canvas/TextItem'
import ARASAAC from './API/arasaac'
import UploadPhoto from './UploadPhoto/newUploadPhoto'
import "bootstrap/dist/css/bootstrap.min.css"
//import UploadState from './Downloader/UploadState'
//import ZipMaker from './Downloader/ZipMaker'
import NIL from './API/NIL.jsx'

import zipUtils from './Utilities/zipUtils'
import Collection from './Utilities/Collection'
import Navbar from './Utilities/Navbar';



const proptypes = {
  /** @type {boolean} whether or not to show fancy live region*/
  hideFancyLiveRegion: PropTypes.bool
};

const defaultProps = {
  hideFancyLiveRegion: false
};


export class DragOnCanvasExample extends React.Component {


  constructor() {
    super();
    this.postID = 0;
    this.Body = ""



    this.zipUtils = new zipUtils
    this.collect = new Collection()

    this.state = {
      pictoArray: [],
      photoArray: [],
      textArray: [],
      lineArray: [],
      figureArray: [],
      idPhoto: "",
      idPicto: "",
      selectedFont: "Nunito"
    }



    //Para el modal
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleFontChange = this.handleFontChange.bind(this);
  }




  handleOpenModal = () => {
    this.setState({ showModal: true });

  }

  handleCloseModal = () => {
    this.setState({ showModal: false });

  }

  deleteEvent = (index) => {
    const copyPostArray = Object.assign([], this.state.pictoArray);
    copyPostArray.splice(index, 1);
    this.setState({
      pictoArray: copyPostArray
    })
  }

  setPicto = (element) => {
    console.log(element)
    this.Body = element.target.value
  }

  addText = () => {
    this.postID = this.postID + 1;
    const copyPostArray = Object.assign([], this.state.textArray)
    copyPostArray.push({
      id: this.postID,
      body: this.Body
    })

    this.setState({
      textArray: copyPostArray
    })
  }

  addLine = () => {
    this.postID = this.postID + 1;
    const copyPostArray = Object.assign([], this.state.lineArray)
    copyPostArray.push({

    })

    this.setState({
      lineArray: copyPostArray
    })
  }

  addFigure = () => {
    this.postID = this.postID + 1;
    const copyPostArray = Object.assign([], this.state.figureArray)
    copyPostArray.push({

    })

    this.setState({
      figureArray: copyPostArray
    })
  }

  setLocalStorage = () => {
    localStorage.setItem('Alfon', JSON.stringify(this.state.pictoArray))
  }

  getLocalStorage = () => {

    console.log(JSON.parse(window.localStorage.getItem('Alfon')))
  }

  cuantosHay = (picto) => {
    console.log(picto);
    // console.log(this.collection.state);
    // this.collection.show();
    console.log(this.collect.state.colection);
    this.handleOpenModal();
  }

  /*Cuando se pulsa el boton + de La APi, lo añadimos al canvas */
  addPictoFromAPI = (formModel) => {
    console.log("Recivi2", formModel);

    this.postID = this.postID + 1;
    const copyPostArray = Object.assign([], this.state.pictoArray)
    copyPostArray.push({
      id: this.postID,
      body: formModel.keywords[0].keyword,
      picto_id: formModel._id,
      apiObject: formModel
    })

    this.setState({
      pictoArray: copyPostArray
    })
  }

  addPictoFromPhoto = (File) => {
    console.log(File);

    this.postID = this.postID + 1;
    const copyPostArray = Object.assign([], this.state.photoArray)
    copyPostArray.push({
      id: this.postID,
      body: File.name,
      url: URL.createObjectURL(File),
      file: File
    })

    this.setState({
      photoArray: copyPostArray
    })

    console.log("Añadido: ", File.name)
  }

  addImage = (name, imgUrl) => {

    this.postID = this.postID + 1;
    const copyPostArray = Object.assign([], this.state.photoArray)

    copyPostArray.push({
      id: this.postID,
      body: name,
      url: imgUrl,
    })

    this.setState({
      photoArray: copyPostArray
    })

    console.log("Padentro!")
  }


  createFile = () => {
    const zip = require('jszip')();
    const copyPostArray = Object.assign([], this.state.photoArray)
    console.log(copyPostArray)
    copyPostArray.forEach(photo => {
      console.log("FOTAKA", photo.file)
      zip.file(photo.body, photo.file, { base64: true }); //"Fotos/" + 
    });
    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, "Proyecto.zip");
    });
  }

  importFile = (f) => {
    var x = this.zipUtils.getFiles(f)
  }


  createPhotoZip() {
    this.state.photoArray.forEach(element => {
      console.log(element)
    });
  }

  handleData = (e) => {
    const copyPostArray = Object.assign([], this.state.pictoArray)
    console.log(copyPostArray.length)
    var long = copyPostArray.length
    var posBorrar;

    for (var i = 0; i < long; i++) {
      if (copyPostArray[i].id === e) {
        posBorrar = i;
      }
    }

    copyPostArray.splice(posBorrar, 1);
    this.setState({
      pictoArray: copyPostArray
    })

  }

  handleChange(e) {
    console.log(e.target.value);
    //here you will see the current selected value of the select input
  }

  addToCollection = () => {

  }

  handleFontChange = (e) => {
    console.log(e.target.value)
    this.setState({
      selectedFont: e.target.value
    })
  }


  render() {

    let optionColection = this.collect.state.colection.map(c => (
      <option value={c.name}>{c.name}</option>
    ));

    return (

      <div>
        <Navbar />

        <div className="container-fluid">
          <div className="row">
            <div className="col-4">

              <NIL />

              {/* <UploadState/> */}
              <UploadPhoto sendData={this.addPictoFromPhoto} />

              {/* API ARASAAC */}
              <ARASAAC sendData={this.addPictoFromAPI} sendC={this.cuantosHay} />

              <Collection />

              <ReactModal
                isOpen={this.state.showModal}
                contentLabel="onRequestClose Example"
                onRequestClose={this.handleCloseModal}
                className="Modal"
                ariaHideApp={false}
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">Añadir a colección:</h5>
                    </div>
                    <div className="modal-body">
                      <div className="container">
                        <div className="row">
                          <div className="col-sm">
                            <select className="form-control" value={this.state.value} onChange={this.handleChange}>
                              {optionColection}
                            </select>
                          </div>

                          <div className="col-sm">
                            <button type="button" className="btn btn-outline-primary ml-2" onClick={this.addToCollection}>Añadir a colección</button>
                          </div>
                        </div>
                      </div>
                      <pre></pre>

                      <div className="container">
                        <div className="row">
                          <div className="col-sm">
                            <input type="text" onBlur={this.setCollection} />
                          </div>
                          <div className="col-sm">
                            <button type="button" className="btn btn-outline-primary ml-2" onClick={this.addToCollection}>Nueva colección</button>
                          </div>
                        </div>
                      </div>

                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={this.handleCloseModal}>Close</button>
                    </div>
                  </div>
                </div>

              </ReactModal>



              {/* Crear Objeto */}
              {/* <div>
                <input type="text" onBlur={this.setPicto} />
                <button onClick={this.addText}>Añadir texto</button>
              </div> */}

              <div className="container-fluid">
                <div className="row">




                  <div className="input-group mb-4">
                  

                    <input type="text" claclassNamess="form-control" aria-label="Text input with segmented dropdown button" onBlur={this.setPicto} />

                    <div className="input-group-prepend">
                      <button type="button" className="btn btn-outline-secondary" onClick={this.addText}>+
                        <a style={{ fontFamily: this.state.selectedFont }}>Texto</a>
                      </button>
                    </div>

                    <select className="form-select col-4" onChange={this.handleFontChange}>
                      <option value="Nunito" className="dropdown-item" style={{ fontFamily: "Nunito" }}>Nunito</option>
                      <option value="Massallera" className="dropdown-item" style={{ fontFamily: "Massallera" }}>Masella</option>
                      <option value="CurPunt" className="dropdown-item" style={{ fontFamily: "CurPunt" }}>CurPunt</option>
                      <option value="CurCuad" className="dropdown-item" style={{ fontFamily: "CurCuad" }}>CurCuad</option>
                      <option value="CurCuadPunt" className="dropdown-item" style={{ fontFamily: "CurCuadPunt" }}>CurCuadPunt</option>
                      <option value="Tommy" className="dropdown-item" style={{ fontFamily: "Tommy" }}>Tommy</option>
                    </select>
                  
                  </div>
                </div>
                <div className="row mt-2">
                  <button onClick={this.addLine}>Añadir linea</button>

                  <button onClick={this.addFigure}>Añadir figura</button>
                </div>
              </div>
              {/* <div>
                <button onClick={this.setLocalStorage}>Save</button>
              </div>

              <div>
                <button onClick={this.getLocalStorage}>Load</button>
              </div> */}

            </div>
            <div className="col-8">
              {/* Pintar Canvas  */}
              <Canvas hideFancyLiveRegion={this.props.hideFancyLiveRegion}>
                {
                  this.state.pictoArray.map((picto, index) => {
                    return (

                      <PictoItem label={picto.body} apiObject={picto.apiObject} idPicto={picto.id} x={2} y={2} width={7} height={10} minWidth={3} minHeight={3} key={picto.id}
                        imageURL={'https://api.arasaac.org/api/pictograms/' + picto.picto_id}
                        sendData={this.handleData}
                      />
                    )
                  })
                }

                {
                  this.state.photoArray.map((photo, index) => {
                    return (

                      <CanvasImage label={photo.body} idPicto={photo.id} x={2} y={2} width={10} height={11} minWidth={3} minHeight={3} key={photo.id}
                        imageURL={photo.url}
                        sendData={this.handleData}
                      />
                    )
                  })
                }


                {
                  this.state.textArray.map((photo, index) => {
                    return (

                      <TextItem label={photo.body} x={2} y={2} width={10} height={5} minWidth={5} minHeight={4} key={photo.id}
                        fontFamily={this.state.selectedFont}
                        sendData={this.handleData}
                      />
                    )
                  })
                }

                {
                  this.state.lineArray.map((photo, index) => {
                    return (

                      <LineItem x={5} y={5} width={1} height={9} minWidth={1} minHeight={1}
                        sendData={this.handleData}
                      />
                    )
                  })
                }

                {
                  this.state.figureArray.map((photo, index) => {
                    return (

                      <FigureItem x={5} y={5} width={10} height={10} minWidth={4} minHeight={4}
                        sendData={this.handleData}
                      />
                    )
                  })
                }

                {/* <CanvasItem label="COLE" x={20} y={6} width={7} height={10} minWidth={7} minHeight={10} imageSRC={"cole.png"} />
          <CanvasItem label="NIÑO" x={6} y={12} width={7} height={10} minWidth={7} minHeight={10} imageSRC={"niño.png"} /> */}

              </Canvas>
            </div>
          </div>
        </div>
      </div>



    );
  }
}

export class DragOnCanvasView extends Component {
  renderDocumentation() {
    return (
      <div>

      </div>
    );
  }

  render() {
    return (

      <article>

        <DragOnCanvasExample />

      </article>

    );
  }
}

// module.exports = {DragOnCanvasExample, DragOnCanvasView}
