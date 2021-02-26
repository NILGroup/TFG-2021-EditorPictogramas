// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React, { Component } from 'react';
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
//import UploadState from './Downloader/UploadState'
//import ZipMaker from './Downloader/ZipMaker'

import zipUtils from './Utilities/zipUtils'
import Collection from './Utilities/Collection'



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
    this.collection = new Collection()

    this.state = {
      pictoArray: [],
      photoArray: [],
      textArray: [],
      lineArray: [],
      figureArray: [],
      idPhoto: "",
      idPicto: ""
    }
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

  cuantosHay = (picto) =>{
    //console.log(picto._id);
    this.collection.openModal(picto._id);
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

  render() {
    return (
      <div>
        <button onClick={this.createFile}>
          Zip
      </button>
        <input type="file" onChange={this.importFile} />

        {/* <UploadState/> */}
        <UploadPhoto sendData={this.addPictoFromPhoto} />

        {/* API ARASAAC */}
        <ARASAAC sendData={this.addPictoFromAPI} sendC={this.cuantosHay} />

        <Collection/>

        {/* Crear Objeto */}
        <div>
          <input type="text" onBlur={this.setPicto} />
          <button onClick={this.addText}>Add Text</button>
        </div>

        <div>
          <button onClick={this.addLine}>Add Line</button>
        </div>
        <div>
          <button onClick={this.addFigure}>Add Figure</button>
        </div>

        <div>
          <button onClick={this.setLocalStorage}>Save</button>
        </div>

        <div>
          <button onClick={this.getLocalStorage}>Load</button>
        </div>

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
