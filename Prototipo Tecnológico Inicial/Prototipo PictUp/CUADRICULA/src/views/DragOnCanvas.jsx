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
import NILtraductor from './API/NILtraductor'
import UploadPhoto from './UploadPhoto/newUploadPhoto'
import FraseItem from '../components/Canvas/FraseItem'
import "bootstrap/dist/css/bootstrap.min.css"
//import UploadState from './Downloader/UploadState'
//import ZipMaker from './Downloader/ZipMaker'
// import NIL from './API/NIL.jsx'

import zipUtils from './Utilities/zipUtils'
import Collection from './Utilities/Collection'
import ColShow from './Utilities/ColShow'
import Navbar from './Utilities/Navbar';
import html2canvas from 'html2canvas';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


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
    this.Body = "";
    this.calidad = "alta";
    this.zipUtils = new zipUtils
    this.defaultName = "---";
    this.nameSelected = "---"; //nombre por defecto de la coleccion 
    this.NewName = ""   //guardar el nombre de una coleccion    
    this.Id = ""      //guardar el id del picto a meter en una coleccion
    this.contador = 3;

    const defaultFileType = "json";
    this.fileNames = {
      json: "states.json",
    }

    this.state = {
      tipoDeAlerta: "",
      selectedColection: "---", //numero de la colección seleccionada
      pictoArray: [],
      photoArray: [],
      textArray: [],
      lineArray: [],
      figureArray: [],
      fraseArray: [],
      idPhoto: "",
      idPicto: "",
      selectedFont: "Nunito",
      fileType: defaultFileType,
      fileDownloadUrl: null,
      colection: []
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

  modalDownloadOpen = () => {
    this.setState({ showModalDownload: true });
  }

  modalDownloadClose = () => {
    this.setState({ showModalDownload: false });
  }

  seleccionarCalidad = (e) => {
    // console.log(e.target.value);
    this.calidad = e.target.value;
    console.log(this.calidad);
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
      id: this.postID,
      body: this.Body
    })

    this.setState({
      lineArray: copyPostArray
    })
  }

  addFigure = () => {
    this.postID = this.postID + 1;
    const copyPostArray = Object.assign([], this.state.figureArray)
    copyPostArray.push({
      id: this.postID,
      body: this.Body
    })

    this.setState({
      figureArray: copyPostArray
    })
  }

  setLocalStorage = () => {
    localStorage.setItem('Foto', JSON.stringify(this.state.pictoArray))
  }

  getLocalStorage = () => {

    console.log(JSON.parse(window.localStorage.getItem('Foto')))
  }

  cuantosHay = (picto) => {
    this.Id = picto; //guado el picto para despues añadirlo a una coleccion
    this.handleOpenModal(); // TODO aqui ya esta guardo, cuando pulse el boton se puede hacer this.setState... .concat(this.Id) VER ????
  }

  /*Cuando se pulsa el boton + de La APi, lo añadimos al canvas */
  addPictoFromAPI = (formModel) => {
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

  addFraseTrad = (e) => {

    this.postID = this.postID + 1;
    const copyPostArray = Object.assign([], this.state.fraseArray)
    copyPostArray.push({
      id: this.postID,
      frase: e.pictos,
      texto: e.frase
    })

    this.setState({
      fraseArray: copyPostArray
    })
  }


  addPictoFromPhoto = (File) => {
    console.log(File);

    this.postID = this.postID + 1;
    const copyPostArray = Object.assign([], this.state.photoArray)
    copyPostArray.push({
      id: this.postID,
      body: File.name,
      url: File.url,
      width: File.width,
      height: File.height,
      scale: File.width / File.height
    })

    this.setState({
      photoArray: copyPostArray
    })

    console.log("Añadido: ", File)
  }

  importarColecciones = (colecciones) => {

    console.log("estoy en drag on canvas con las colecciones importadas =>", colecciones);
    for (var i = 0; i < colecciones.length; i++) {
      var total = this.state.colection.concat(colecciones[i]); //añado por el final las nuevas colecciones
      this.setState({ colection: total });
    }

    console.log("estado final", this.state.colection);

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
  }


  createFile = () => {
    const zip = require('jszip')();
    const copyPostArray = Object.assign([], this.state.photoArray)
    console.log(copyPostArray)
    copyPostArray.forEach(photo => {
      console.log("FOTAKA", photo.file)
      zip.file(photo.body, photo.file, { base64: true });
    });
    zip.generateAsync({ type: "blob" }).then(function (blob) {
      saveAs(blob, "Proyecto.zip");
    });
  }

  importFile = (f) => {
    //var x = this.zipUtils.getFiles(f)
  }

  descargaFotoTablero = () => {
    //Prueba Html2Canvas

    var container = document.getElementById("tableroPrint") // full page 
    var escala;

    if (this.calidad == "alta") {
      escala = 4;
    }
    else if (this.calidad == "media") {
      escala = 3;
    } else {
      escala = 2;
    }
    console.log("se va a descargar en calidad", escala);
    this.calidad = "alta"; //reseteamos valor por defecto
    html2canvas(container, { allowTaint: true, useCORS: true, scale: 2, scrollY: window.scrollY })
      .then(function (canvas) {

        var link = document.createElement("a");
        document.body.appendChild(link);
        link.download = "PictUpTablero.png";
        link.href = canvas.toDataURL("image/png");
        link.target = '_blank';
        link.click();
      });

    this.modalDownloadClose();
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

  handleDeleteText = (e) => {
    const copyPostArray = Object.assign([], this.state.textArray)
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
      textArray: copyPostArray
    })
  }

  handleDeleteLine = (e) => {
    const copyPostArray = Object.assign([], this.state.lineArray)
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
      lineArray: copyPostArray
    })
  }

  handleDeleteFigure = (e) => {
    const copyPostArray = Object.assign([], this.state.figureArray)
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
      figureArray: copyPostArray
    })
  }

  handleDeleteFrase = (e) => {
    const copyPostArray = Object.assign([], this.state.fraseArray)
    console.log(e)
    var long = copyPostArray.length
    var posBorrar;

    for (var i = 0; i < long; i++) {
      if (copyPostArray[i].id === e) {
        posBorrar = i;
      }
    }

    console.log(this.state.fraseArray, posBorrar)

    copyPostArray.splice(posBorrar, 1);
    this.setState({
      fraseArray: copyPostArray
    })
  }


  handleDeleteImage = (e) => {
    const copyPostArray = Object.assign([], this.state.photoArray)
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
      photoArray: copyPostArray
    })
  }

  coleccionToShow = (e) => {
    for (var i = 0; i < this.state.colection.length; i++) {
      if (this.state.colection[i].name === e.target.value) {
        this.setState({
          selectedColection: i
        });
      }
    }
    console.log(this.state.selectedColection);
  }

  handleChange = (e) => {
    this.nameSelected = e.target.value;
    // console.log(this.nameSelected);
  }

  addToCollection = () => {
    console.log(this.Id);
    if (this.state.colection.length == 0) {
      alert("No hay ninguna colección, crea una nueva.");
    }
    else if (this.nameSelected == "---") {
      alert("Por favor, selecciona una colección.");
    }
    else {
      for (var i = 0; i < this.state.colection.length; i++) {
        if (this.state.colection[i].name == this.nameSelected) {
          var aux = this.state.colection;
          var actualizada = this.state.colection[i].idPicto.concat(this.Id);
          aux[i].idPicto = actualizada;
          this.setState({ colection: aux });
        }
      }
      this.nameSelected = "---"; //reseteamos el valor
    }

  }

  newCollection = () => {

    var existe = false;

    if (this.state.colection.length != 0) {
      for (var i = 0; i < this.state.colection.length && !existe; i++) {
        if (this.state.colection[i].name == this.NewName) {
          existe = true;
        }
      }
    }

    if (existe) {
      alert("Ya existe otra colección con el mismo nombre.");
    }
    else if (this.NewName == "") {
      alert("No puedes crear una colección sin nombre.");
    } else {

      var nueva = this.state.colection.concat({
        name: this.NewName,
        idPicto: [this.Id]
      })

      console.log(nueva);
      this.setState({ colection: nueva });
      console.log(this.state.colection);
      this.NewName = ""; //reseteamos valor
      this.setState({
        tipoDeAlerta: "Creada nueva lista de pictogramas"
      })
      this.handleCloseModal();
    }
  }

  setNameCollection = (e) => {
    this.NewName = e.target.value;
    console.log(this.NewName);
  }

  handleFontChange = (e) => {
    console.log(e.target.value)
    this.setState({
      selectedFont: e.target.value
    })
  }

  mostrarColecciones = () => {
    console.log(this.state.selectedColection);
    if (this.state.selectedColection != "---") {
      return (
        <ColShow sendData={this.addPictoFromAPI} colections={this.state.colection[this.state.selectedColection].idPicto} />
      )
    }
  }


  reseteaAlert = () => {
    this.setState({
      tipoDeAlerta: ""
    })
  }

  mostrarAletrs = () => {

    if (this.state.tipoDeAlerta != "") {
      return (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>{this.state.tipoDeAlerta} </strong>
          <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.reseteaAlert}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    }
  }

  render() {

    let optionColection = this.state.colection.map(c => (
      <option value={c.name}>{c.name}</option>
    ));

    var modalStyles = { overlay: { zIndex: 10 } };

    return (

      <div>
        <Navbar />

        <div className="container-fluid">
          <div className="row">
            <div className="col-4">

              {/* <NIL /> */}

              {this.mostrarAletrs()}
              
              <div className="ml-3">
                <Tabs>
                  <TabList>
                    <Tab>Busqueda simple</Tab>
                    <Tab>Traducción de frase</Tab>
                    <Tab>Añadir imagen</Tab>
                  </TabList>

                  <TabPanel>
                    <ARASAAC sendData={this.addPictoFromAPI} sendC={this.cuantosHay} sendFrase={this.addFraseTrad} />
                  </TabPanel>
                  <TabPanel>
                    <NILtraductor sendFrase={this.addFraseTrad} />
                    {/* send2sac={this.getFromTrad} */}
                  </TabPanel>
                  <TabPanel>
                    <UploadPhoto sendData={this.addPictoFromPhoto} />
                  </TabPanel>
                </Tabs>
              </div>

              {/* <UploadState/> */}
              {/* <UploadPhoto sendData={this.addPictoFromPhoto} /> */}

              {/* API ARASAAC */}

              <div className="mt-5"></div>

              <ReactModal
                isOpen={this.state.showModal}
                contentLabel="onRequestClose Example"
                onRequestClose={this.handleCloseModal}
                className="Modal"
                ariaHideApp={false}
                style={modalStyles}
              >
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="exampleModalLabel">Crea o añade a una colección el pictograma <img style={{ border: '1px solid', color: 'black', borderRadius: '10' }} src={'https://api.arasaac.org/api/pictograms/' + this.Id._id} width="90" height="90"></img></h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCloseModal}>
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">

                      <Tabs>
                        <TabList>
                          <Tab>Añadir a colección existente</Tab>
                          <Tab>Crear una nueva colección</Tab>
                        </TabList>

                        <TabPanel>
                          <div className="col-sm ">
                            <p style={{ fontSize: '15' }}>Selecciona una colección:</p>
                            <select className="form-control ml-1 mr-4 mt-3" value={this.state.value} onChange={this.handleChange}>
                              <option value={"---"}>{ }</option>
                              {optionColection}
                            </select>
                          </div>
                          <div className="modal-footer border-0">
                            <button type="button" className="btn btn-outline-primary mr-auto ml-auto" style={{ alignSelf: 'center' }} data-bs-dismiss="modal" onClick={this.addToCollection}>Añadir a mi lista de pictogramas</button>
                          </div>
                        </TabPanel>
                        <TabPanel>
                          <div className="col-sm">
                            <p style={{ fontSize: '15' }}>Introduce el nuevo nombre para la colección:</p>
                            <input className="form-control mt-3" type="text" onBlur={this.setNameCollection} />
                          </div>
                          <div className="modal-footer border-0">
                            <button type="button" className="btn btn-outline-primary mr-auto ml-auto" style={{ alignSelf: 'center' }} data-bs-dismiss="modal" onClick={this.newCollection}>Nueva lista de pictogramas</button>
                          </div>
                        </TabPanel>
                      </Tabs>
                    </div>
                  </div>
                </div>

              </ReactModal>

              <div className="card ml-3" >
                <h5 className="card-header" style={{ backgroundColor: '#ADD8E6', fontSize: '18px' }}><strong>Personalización del tablero</strong></h5>
                <div className="card-body">
                  <div className="card-text">
                    <div className="row mt-3">

                      <div className="input-group mb-4">

                        <input type="text" className="form-control" aria-label="Text input with segmented dropdown button" onBlur={this.setPicto} />

                        <div className="input-group-prepend">
                          <button type="button" className="btn btn-outline-secondary" title="Añadir el texto al tablero " onClick={this.addText}>+
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
                    <div className="row mt-2 ml-4">
                      <button className="btn btn-outline-info btn-sm ml-3" title="Añadir una linea al tablero" onClick={this.addLine}><i className="fas fa-grip-lines-vertical"></i> Añadir linea</button>

                      <button className="btn btn-outline-info btn-sm ml-1" title="Añadir un cuadrado al tablero" onClick={this.addFigure}><i className="far fa-square"></i> Añadir cuadrado</button>

                      <button className="btn btn-outline-info ml-2" title="Descargar el tablero como imagen" onClick={this.modalDownloadOpen}>
                        <i className="fas fa-file-image"></i>
                        &nbsp; Descargar Tablero
                      </button>

                      <ReactModal
                        isOpen={this.state.showModalDownload}
                        contentLabel="onRequestClose Example"
                        onRequestClose={this.modalDownloadClose}
                        className="Modal"
                        ariaHideApp={false}
                        style={modalStyles}
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="exampleModalLabel">Selecciona la calidad que quieres que tenga la imagen:</h5>
                              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.modalDownloadClose}>
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <div className="container">

                                <div onClick={this.seleccionarCalidad}>
                                  <div className="row mt-2 ml-3">
                                    <input type="radio" value="alta" name="gender" defaultChecked />&nbsp; Calidad alta
                                  </div>
                                  <div className="row mt-3 ml-3">
                                    <input type="radio" value="media" name="gender" />&nbsp; Calidad media
                                  </div>
                                  <div className="row mt-3 ml-3">
                                    <input type="radio" value="baja" name="gender" />&nbsp; Calidad baja
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer">
                              <button type="button" className="btn btn-outline-primary mr-auto ml-auto" style={{ alignSelf: 'center' }} data-bs-dismiss="modal" onClick={this.descargaFotoTablero}><i className="fas fa-file-download"></i> Descargar imagen</button>
                            </div>
                          </div>
                        </div>
                      </ReactModal>

                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="container-fluid"> */}
              {/* <div className="row">

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
                </div> */}
              {/* <div className="row mt-2">
                  <button className="btn btn-outline-info btn-sm ml-3" onClick={this.addLine}><i className="fas fa-grip-lines-vertical"></i> Añadir linea</button>

                  <button className="btn btn-outline-info btn-sm ml-1" onClick={this.addFigure}><i className="far fa-square"></i> Añadir figura</button>

                  <button className="btn btn-outline-info ml-2" onClick={this.descargaFotoTablero}>
                    <i className="fas fa-file-image"></i>
                  &nbsp; Descargar Tablero
                  </button>
                </div> */}


              {/* </div> */}
              {/* <div>
                <button onClick={this.setLocalStorage}>Save</button>
              </div>

              <div>
                <button onClick={this.getLocalStorage}>Load</button>
              </div> */}

              <div className="card mt-4 mb-3 ml-3" >
                <h5 className="card-header" style={{ backgroundColor: '#ADD8E6', fontSize: '18px' }}> <strong>Mis listas de pictogramas</strong></h5>
                <div className="card-body">
                  <h6 className="card-subtitle mt-3 mb-2 text-muted"><Collection sendColeccion={this.importarColecciones} coleccionesActuales={this.state.colection} /></h6>
                  <div className="card-text">
                    <select className="form-control mt-3 mb-2" value={this.state.value} onChange={this.coleccionToShow}>
                      <option value={"---"}>{ }</option>
                      {optionColection}
                    </select>

                    {this.mostrarColecciones()}

                  </div>
                </div>
              </div>


            </div>
            <div className="col-8" id="tableroPrint">

            {/* Pintar Canvas  */}
            <Canvas id="tableroPicto" hideFancyLiveRegion={this.props.hideFancyLiveRegion}>
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

                    <CanvasImage label={photo.body} idPicto={photo.id} x={10} y={2} width={15 * photo.scale} height={15} minWidth={3} minHeight={3} key={photo.id}
                      imageURL={photo.url}
                      sendData={this.handleDeleteImage}
                    />
                  )
                })
              }


              {
                this.state.textArray.map((text, index) => {
                  return (

                    <TextItem label={text.body} idPicto={text.id} x={2} y={2} width={10} height={5} minWidth={5} minHeight={4} key={text.id}
                      fontFamily={this.state.selectedFont}
                      sendData={this.handleDeleteText}
                    />
                  )
                })
              }

              {
                this.state.lineArray.map((line, index) => {
                  return (

                    <LineItem label={line.body} idPicto={line.id} x={5} y={5} width={1} height={9} minWidth={1} minHeight={1} key={line.id}
                      sendData={this.handleDeleteLine}
                    />
                  )
                })
              }

              {
                this.state.figureArray.map((figure) => {
                  return (

                    <FigureItem label={figure.body} idPicto={figure.id} x={5} y={5} width={15} height={15} minWidth={4} minHeight={4} key={figure.id}
                      sendData={this.handleDeleteFigure}
                    />
                  )
                })
              }

              {
                this.state.fraseArray.map((frase) => {
                  return (

                    <FraseItem x={5} y={5} width={10} height={10} minWidth={4} minHeight={4} idPicto={frase.id} frase={frase.frase} texto={frase.texto} key={frase.id}
                      deleteItem={this.handleDeleteFrase} />


                  )
                })
              }

              {/* <CanvasItem label="COLE" x={20} y={6} width={7} height={10} minWidth={7} minHeight={10} imageSRC={"cole.png"} />
          <CanvasItem label="NIÑO" x={6} y={12} width={7} height={10} minWidth={7} minHeight={10} imageSRC={"niño.png"} /> */}

            </Canvas>
          </div>
        </div>
      </div>
      </div >



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
