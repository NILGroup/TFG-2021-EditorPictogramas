// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React, { Component } from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

import Canvas from '../components/Canvas/Canvas';
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

import Iconos from './Utilities/Iconos'
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
      historialColeccion: "---",
      tipoDeAlertaBorrado: "",
      tipoDeAlerta: "",
      tipoDeError: "",
      coleccionExistente: false,
      borrando: "-1",
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
      colection: [],

      pictoConfig: {
        hair: null,
        skin: null,
        time: "present",
        isColorized: true,
        isPlural: false,
        borderColor: null,
        borderWidth: 0,
        hasBorder: false,
      }

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

  modalDeleteAllOpen = () => {
    this.setState({ showModalDeleteAll: true });
  }

  modalDeleteAllClose = () => {
    this.setState({ showModalDeleteAll: false });
  }

  seleccionarCalidad = (e) => {
    this.calidad = e.target.value;
  }

  deleteEvent = (index) => {
    const copyPostArray = Object.assign([], this.state.pictoArray);
    copyPostArray.splice(index, 1);
    this.setState({
      pictoArray: copyPostArray
    })
  }

  setPicto = (element) => {
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
    // tipo: claseIcono //color, tipo y rango
    var data = {
      tipo: "---",
      color: "#000000",
      range: "1"
    }
    this.postID = this.postID + 1;
    const copyPostArray = Object.assign([], this.state.figureArray)
    copyPostArray.push({
      id: this.postID,
      body: this.Body,
      tipo: data
    })

    this.setState({
      figureArray: copyPostArray
    })
  }

  setLocalStorage = () => {
    localStorage.setItem('Foto', JSON.stringify(this.state.pictoArray))
  }

  getLocalStorage = () => {

    // console.log(JSON.parse(window.localStorage.getItem('Foto')))
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
      body: formModel.picto.keywords[0].keyword,
      picto_id: formModel.picto._id,
      apiObject: formModel.picto,
      config: this.state.pictoConfig,
      url: formModel.url
    })

    this.setState({
      pictoArray: copyPostArray
    })

  }

  addPictoFromCol = (form) => {
    this.postID = this.postID + 1;


    var formModel = {
      picto: form,
      url: "https://static.arasaac.org/pictograms/" + form._id + "/" + form._id + "_500.png"
    }

    const copyPostArray = Object.assign([], this.state.pictoArray)
    copyPostArray.push({
      id: this.postID,
      body: formModel.picto.keywords[0].keyword,
      picto_id: formModel.picto._id,
      apiObject: formModel.picto,
      config: this.state.pictoConfig,
      url: formModel.url
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
    var auxHeigh = 15
    if (File.text != "") {
      auxHeigh = 15 + 3
    }

    this.postID = this.postID + 1;
    const copyPostArray = Object.assign([], this.state.photoArray)
    copyPostArray.push({
      id: this.postID,
      body: File.text,
      url: File.url,
      width: File.width,
      height: auxHeigh,
      scale: File.width / File.height
    })

    this.setState({
      photoArray: copyPostArray
    })

  }

  importarColecciones = (colecciones) => {
    for (var i = 0; i < colecciones.length; i++) {
      var total = this.state.colection.concat(colecciones[i]); //añado por el final las nuevas colecciones
      this.setState({ colection: total });
    }
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

  cleanCanvas = () => {
    this.setState({
      pictoArray: [],
      photoArray: [],
      textArray: [],
      lineArray: [],
      figureArray: [],
      fraseArray: [],
      showModalDeleteAll: false 
    })
  }


  createFile = () => {
    const zip = require('jszip')();
    const copyPostArray = Object.assign([], this.state.photoArray)
    copyPostArray.forEach(photo => {
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
    this.calidad = "alta"; //reseteamos valor por defecto
    html2canvas(container, { allowTaint: true, useCORS: true, scale: escala, scrollY: window.scrollY })
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
      //console.log(element) 
    });
  }

  handleData = (e) => {
    const copyPostArray = Object.assign([], this.state.pictoArray)
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
    var long = copyPostArray.length
    var posBorrar;

    for (var i = 0; i < long; i++) {
      if (copyPostArray[i].id === e) {
        posBorrar = i;
      }
    }

    copyPostArray.splice(posBorrar, 1);
    this.setState({
      fraseArray: copyPostArray
    })
  }


  handleDeleteImage = (e) => {
    const copyPostArray = Object.assign([], this.state.photoArray)
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
    this.setState({
      borrando: "-1"
    })
    var encontrado = false;
    for (var i = 0; i < this.state.colection.length; i++) {
      if (this.state.colection[i].name === e.target.value) {
        encontrado = true;
        this.setState({
          selectedColection: i
        });
      }
    }
    if (!encontrado) {
      this.setState({
        selectedColection: "---"
      });
    }

  }

  handleChange = (e) => {
    this.nameSelected = e.target.value;
    this.setState({
      historialColeccion: e.target.value
    })
  }

  addToCollection = () => {

    if (this.nameSelected == "---") {
      this.nameSelected = this.state.historialColeccion;
    }

    if (this.state.colection.length == 0) {
      alert("No hay ninguna colección, crea una nueva.");
    }
    else if (this.nameSelected == "---") {
      alert("Por favor, selecciona una colección.");
    }
    else {
      //Primer for para asegurarnos de que no exista ese pictograma en esa coleccion
      var existe = false;

      for (var i = 0; i < this.state.colection.length; i++) {
        if (this.state.colection[i].name == this.nameSelected) {
          for (var j = 0; j < this.state.colection[i].idPicto.length; j++) {
            if (this.state.colection[i].idPicto[j] == this.Id) {
              existe = true;
              this.setState({
                tipoDeError: "El pictograma " + this.Id.keywords[0].keyword + " ya está en la lista " + this.state.colection[i].name + "."
              })
            }
          }
          if (!existe) {
            var aux = this.state.colection;
            var actualizada = this.state.colection[i].idPicto.concat(this.Id);
            aux[i].idPicto = actualizada;
            this.setState({ colection: aux });
            this.setState({
              tipoDeAlerta: "Añadido el pictograma " + this.Id.keywords[0].keyword + " a la lista " + this.state.colection[i].name
            })
          }
        }
      }

      this.nameSelected = "---"; //reseteamos el valor
      this.handleCloseModal();
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
      this.setState({ historialColeccion: this.NewName })
      this.setState({ colection: nueva });
      this.setState({
        tipoDeAlerta: "Creada lista de pictogramas " + this.NewName
      })
      this.NewName = ""; //reseteamos valor
      this.handleCloseModal();
    }
  }

  setNameCollection = (e) => {
    this.NewName = e.target.value;
  }

  handleFontChange = (e) => {
    this.setState({
      selectedFont: e.target.value
    })
  }

  mostrarColecciones = () => {
    if (this.state.selectedColection != "---" && this.state.selectedColection != this.state.borrando) {
      return (
        <ColShow sendData={this.addPictoFromCol} colections={this.state.colection[this.state.selectedColection].idPicto} />
      )
    } else if (this.state.selectedColection == this.state.borrando) {
      //comprobar que no sea la ultima colección
      if (this.state.borrando < this.state.colection.length) {
        return (
          <ColShow sendData={this.addPictoFromCol} colections={this.state.colection[this.state.borrando].idPicto} />
        )
      }
    }
  }


  borrarColeccion = () => {
    if (this.state.colection.length == 1) {
      this.setState({
        selectedColection: "---"
      })
    }
    if (this.state.selectedColection != '---') {
      const copyPostArray = Object.assign([], this.state.colection);
      var posBorrar = this.state.selectedColection;
      var name = this.state.colection[posBorrar].name
      if (posBorrar == (this.state.colection.length - 1)) {
        this.setState({
          selectedColection: "---"
        })
      }
      copyPostArray.splice(posBorrar, 1);
      this.setState({
        colection: copyPostArray
      })

      this.setState({
        borrando: this.state.selectedColection
      })

      this.setState({
        tipoDeAlertaBorrado: "Se ha borrado la lista de pictogramas " + name
      })
    }
  }

  mostrarBorrar = () => {
    if (this.state.selectedColection != "---" && this.state.colection.length != 0) {
      return (
        <button type="button" className="btn btn-outline-danger" onClick={this.borrarColeccion}><i className="fas fa-trash-alt" ></i>   lista</button>
      )
    }

  }

  reseteaAlertBorrado = () => {
    this.setState({
      tipoDeAlertaBorrado: ""
    })
  }

  reseteaAlert = () => {
    this.setState({
      tipoDeAlerta: ""
    })
  }

  mostrarAletrs = () => {

    if (this.state.tipoDeAlerta != "") {
      return (
        <div className="alert alert-success alert-dismissible fade show mb-3 ml-3" role="alert">
          <strong>{this.state.tipoDeAlerta} </strong>
          <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.reseteaAlert}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    }
  }

  reseteaError = () => {
    this.setState({
      tipoDeError: ""
    })
  }

  mostrarAletrsError = () => {

    if (this.state.tipoDeError != "") {
      return (
        <div className="alert alert-danger alert-dismissible fade show mb-3 ml-3" role="alert">
          <strong>{this.state.tipoDeError} </strong>
          <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.reseteaError}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    }
  }

  mostrarAletrsBorrado = () => {

    if (this.state.tipoDeAlertaBorrado != "") {
      return (
        <div className="alert alert-success alert-dismissible fade show mt-3 mb-3 ml-3" role="alert">
          <strong>{this.state.tipoDeAlertaBorrado} </strong>
          <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={this.reseteaAlertBorrado}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )
    }
  }

  mostrarContenidoColecciones = () => {
    let optionColection = this.state.colection.map(c => (
      <option value={c.name} >{c.name}</option>
    ));

    if (this.state.colection.length != 0) {
      return (
        <Tabs>
          <TabList>
            <Tab>Añadir a lista existente</Tab>
            <Tab>Crear una nueva lista</Tab>
          </TabList>

          <TabPanel>
            <div className="col-sm ">
              <p style={{ fontSize: '15' }}>Selecciona una lista:</p>
              <select className="form-control ml-1 mr-4 mt-3" defaultValue={this.state.historialColeccion} value={this.state.value} onChange={this.handleChange}>
                <option value={"---"}>{ }</option>
                {optionColection}
              </select>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-outline-primary mr-auto ml-auto" style={{ alignSelf: 'center' }} data-bs-dismiss="modal" onClick={this.addToCollection}><i className="fas fa-file-import fa-lg"></i> Añadir a mi lista de pictogramas</button>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="col-sm">
              <p style={{ fontSize: '15' }}>Introduce el nuevo nombre para la lista:</p>
              <input className="form-control mt-3" type="text" onBlur={this.setNameCollection} />
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-outline-primary mr-auto ml-auto" style={{ alignSelf: 'center' }} data-bs-dismiss="modal" onClick={this.newCollection}><i className="fas fa-folder-plus fa-lg"></i> Nueva lista de pictogramas</button>
            </div>
          </TabPanel>
        </Tabs>
      )
    } else {
      return (
        <Tabs>
          <TabList>
            <Tab>Crear una nueva lista</Tab>
          </TabList>

          <TabPanel>
            <div className="col-sm">
              <p style={{ fontSize: '15' }}>No tienes ninguna lista, por favor introduce un nombre para crearla:</p>
              <input className="form-control mt-3" type="text" onBlur={this.setNameCollection} />
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-outline-primary mr-auto ml-auto" style={{ alignSelf: 'center' }} data-bs-dismiss="modal" onClick={this.newCollection}><i className="fas fa-folder-plus fa-lg"></i> Nueva lista de pictogramas</button>
            </div>
          </TabPanel>
        </Tabs>
      )
    }
  }

  addIcono = (claseIcono) => {
    this.postID = this.postID + 1;
    const copyPostArray = Object.assign([], this.state.figureArray)
    copyPostArray.push({
      id: this.postID,
      body: this.Body,
      tipo: claseIcono //color, tipo y rango
    })

    this.setState({
      figureArray: copyPostArray
    })
  }

  iconoCheck = (claseIcono) => {
    this.addIcono(claseIcono);
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
              {this.mostrarAletrsError()}

              <div className="ml-3">
                <Tabs>
                  <TabList>
                    <Tab>Busqueda simple</Tab>
                    <Tab>Traducción de frase</Tab>
                    <Tab>Añadir imagen</Tab>
                  </TabList>

                  <TabPanel>
                    <ARASAAC sendData={this.addPictoFromAPI} sendC={this.cuantosHay} sendFrase={this.addFraseTrad} config={this.state.pictoConfig} newConf={(e) => this.setState({ pictoConfig: e })} />
                  </TabPanel>
                  <TabPanel>
                    <NILtraductor sendFrase={this.addFraseTrad} sendPicto={this.addPictoFromCol} />
                    {/* send2sac={this.getFromTrad} */}
                  </TabPanel>
                  <TabPanel>
                    <UploadPhoto sendData={this.addPictoFromPhoto} />
                  </TabPanel>
                </Tabs>
              </div>


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
                      <h5 className="modal-title" id="exampleModalLabel">Crea o añade a una lista el pictograma <img style={{ border: '1px solid', color: 'black', borderRadius: '10' }} src={'https://api.arasaac.org/api/pictograms/' + this.Id._id} width="90" height="90"></img></h5>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.handleCloseModal}>
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      {this.mostrarContenidoColecciones()}
                    </div>
                  </div>
                </div>

              </ReactModal>

              <div className="card ml-3" >
                <h5 className="card-header" style={{ backgroundColor: '#ADD8E6', fontSize: '18px' }}><strong><i className="fas fa-pencil-ruler"></i> Personalización del tablero</strong></h5>
                <div className="card-body">
                  <div className="card-text">
                    <div className="row my-2 ml-2">
                      <select className="form-control col-6" onChange={this.handleFontChange}>
                        <option value="Nunito" className="dropdown-item" style={{ fontFamily: "Nunito" }}>Arial</option>
                        <option value="Massallera" className="dropdown-item" style={{ fontFamily: "Massallera" }}>Caligrafía</option>
                        <option value="CurPunt" className="dropdown-item" style={{ fontFamily: "CurPunt" }}>Caligrafía Punteada</option>
                        <option value="CurCuad" className="dropdown-item" style={{ fontFamily: "CurCuad" }}>Caligrafía en cuadrícula</option>
                        <option value="CurCuadPunt" className="dropdown-item" style={{ fontFamily: "CurCuadPunt" }}>Caligrafía cuadrícula punteada</option>
                        <option value="ComicSans" className="dropdown-item" style={{ fontFamily: "ComicSans" }}>ComicSans</option>
                      </select>
                      <div className="col-6">
                        <p className="h4" style={{ fontFamily: this.state.selectedFont }}>Tipografía</p>
                      </div>
                    </div>
                    <div className="row mt-3 ml-2 mr-2">

                      <div className="input-group mb-3">
                        <input type="text" placeholder="Añade una frase..." className="form-control" aria-label="Text input with segmented dropdown button" onBlur={this.setPicto} />
                        <button type="button" className="btn btn-primary btn-sm ml-2" title="Añadir el texto al tablero " onClick={this.addText}>
                          <i className="fas fa-plus"></i> Texto
                        </button>
                      </div>

                    </div>

                    <div className="row mt-2 ml-3">
                      <strong>Figuras disponibles para añadir al tablero </strong>
                      <button className="btn btn-outline-info btn-sm ml-3" title="Añadir una linea al tablero" onClick={this.addLine}><i className="fas fa-grip-lines-vertical"></i></button>

                      <button className="btn btn-outline-info btn-sm ml-2" title="Añadir un cuadrado al tablero" onClick={this.addFigure}><i className="far fa-square"></i></button>

                      <Iconos check={this.iconoCheck} />


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

                      <ReactModal
                        isOpen={this.state.showModalDeleteAll}
                        contentLabel="onRequestClose Example"
                        onRequestClose={this.modalDeleteAllClose}
                        className="Modal"
                        ariaHideApp={false}
                        style={modalStyles}
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="exampleModalLabel">¿Desea borrar el tablero?</h5>
                              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.modalDeleteAllClose}>
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <div className="container">
                                <div className="modal-footer">
                                  <button type="button" className="btn btn-outline-danger mr-auto ml-auto" style={{ alignSelf: 'center' }} data-bs-dismiss="modal" onClick={this.cleanCanvas}><i className="fas fa-trash-alt"></i> Sí, Borrar tablero</button>
                                  <button type="button" className="btn btn-outline-primary mr-auto ml-auto" style={{ alignSelf: 'center' }} data-bs-dismiss="modal" onClick={this.modalDeleteAllClose}><i className="fas fa-undo"></i> No, mantener tablero</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </ReactModal>

                    </div>

                    <hr style={{ margin: 10 }}></hr>
                    <div className="text-center">
                      <button className="btn btn-info ml-2" title="Descargar el tablero como imagen" onClick={this.modalDownloadOpen}>
                        <i className="fas fa-download"></i>
                        &nbsp; Descargar Tablero
                      </button>
                      <button className="btn btn-danger ml-2" title="Descargar el tablero como imagen" onClick={this.modalDeleteAllOpen}>
                        <i className="fas fa-trash-alt"></i>
                        &nbsp; Borrar tablero
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {this.mostrarAletrsBorrado()}

              <div className="card mt-4 mb-3 ml-3" >
                <h5 className="card-header" style={{ backgroundColor: '#ADD8E6', fontSize: '18px' }}> <strong><i className="fas fa-folder-open"></i> Mis listas de pictogramas</strong></h5>
                <div className="card-body">
                  <h6 className="card-subtitle mt-3 mb-2 text-muted"><Collection sendColeccion={this.importarColecciones} coleccionesActuales={this.state.colection} /></h6>
                  <div className="card-text">
                    <div className="row">
                      <div className="col-8">
                        <select className="form-control mt-3 mb-2" value={this.state.value} onChange={this.coleccionToShow}>
                          <option value={"---"}>{ }</option>
                          {optionColection}
                        </select>
                      </div>
                      <div className="col-4 mt-3 mb-2">
                        {this.mostrarBorrar()}
                      </div>
                    </div>
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

                      <PictoItem label={picto.body} apiObject={picto.apiObject} idPicto={picto.id} x={2} y={2} width={10} height={14} minWidth={3} minHeight={3} key={picto.id}
                        imageURL={picto.url} config={picto.config}
                        sendData={this.handleData}
                      />
                    )
                  })
                }

                {
                  this.state.photoArray.map((photo, index) => {
                    return (

                      <CanvasImage label={photo.body} idPicto={photo.id} x={10} y={2} width={15 * photo.scale} height={photo.height} minWidth={3} minHeight={3} key={photo.id}
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

                      <FigureItem label={figure.body} idPicto={figure.id} tipo={figure.tipo} x={5} y={5} width={15} height={15} minWidth={4} minHeight={4} key={figure.id}
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
  render() {
    return (

      <article>

        <DragOnCanvasExample />

      </article>

    );
  }
}

// module.exports = {DragOnCanvasExample, DragOnCanvasView}
