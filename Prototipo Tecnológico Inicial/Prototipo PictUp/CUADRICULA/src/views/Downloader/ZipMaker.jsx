import React, {Component} from 'react';
import {saveAs} from 'file-saver';


export class ZipMaker extends React.Component {

    constructor(props) {
        super(props)
            
    }

    createFile(){

        const zip = require('jszip')();

        

        zip.file("texto.txt", "---")
        zip.file("Fotos/EstoEsUnaFoto.txt", "--")
        zip.generateAsync({type:"blob"}).then(function (blob) {
            saveAs(blob, "compresion.zip");
        });

    }

  
  render() {
    return (
        <button onClick={this.createFile}>
        oleee
      </button>
    )
  }
}

export default ZipMaker 