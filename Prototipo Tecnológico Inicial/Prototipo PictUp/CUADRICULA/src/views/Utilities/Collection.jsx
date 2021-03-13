import React, { Component } from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import { forEach } from 'jszip';


export class Collection extends React.Component {

  constructor() {
    super()

    this.Nueva = ""   //guardar el nombre de una coleccion    
    this.Id = ""      //guardar el id del picto a meter en una coleccion
    this.contador = 3;

    const defaultFileType = "json";
    this.fileNames = {
      json: "states.json",
    }

    this.state = {
      showModal: false,
      fileType: defaultFileType,
      fileDownloadUrl: null,
      status: "",
      colection: [
        { name: "Granja", idPicto: ["3411", "2522", "3123"] },
        { name: "Parque", idPicto: ["2129"] },
        { name: "Cole", idPicto: ["1230", "4321"] },
      ]
    }
    //Para el modal
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    //Para exportar - importar el fichero json
    this.download = this.download.bind(this);
    this.upload = this.upload.bind(this);
    this.openFile = this.openFile.bind(this);
  }

  handleOpenModal = () => {
    this.setState({ showModal: true });
    
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
   
  }

  setCollection = (event) => {
    var aux = event.target.value;
    this.Nueva = aux;
  }

  setId = (event) => {
    var aux = event.target.value;
    this.Id = aux;
    console.log(this.Id);
  }

  //crea una nueva coleccion
  create = () => {
    var nameCollection = this.Nueva;
    this.state.colection.push({
      name: nameCollection,
      idPicto: [],
    })

    this.contador++;
  }


  //añade un picto a una coleccion existente
  addPictoToCollection = () => {
    var nameCollection = this.Nueva;
    var picto = this.Id;
    var encontrado = 0;
    console.log(picto);

    for (var i = 0; i < this.contador; ++i) {
      if (this.state.colection[i].name == nameCollection) {
        encontrado = 1;
        this.state.colection[i].idPicto.push(picto);
      }
    }
    if (encontrado == 0) {
      console.log("El nombre de la colección ", nameCollection, " no existe");
    }
    console.log(this.state.colection);

  }

  show = () => {

    for (var i = 0; i < this.contador; ++i) {
      console.log(this.state.colection[i].name);
    }
  }

  openModal = (idPicto) => {
    //this.Id = idPicto;
    this.handleOpenModal();
  }

  download(event) {
    event.preventDefault();
    var colection = this.state.colection;
    var output;
    if (this.state.fileType === "json") {
      output = JSON.stringify({ colection },
        null, 4);
    }
    // Download it
    const blob = new Blob([output]);
    const fileDownloadUrl = URL.createObjectURL(blob);
    this.setState({ fileDownloadUrl: fileDownloadUrl },
      () => {
        this.dofileDownload.click();
        URL.revokeObjectURL(fileDownloadUrl);
        this.setState({ fileDownloadUrl: "" })
      })
  }

  upload(event) {
    event.preventDefault();
    this.dofileUpload.click()
  }

  openFile(evt) {
    const fileObj = evt.target.files[0];
    const reader = new FileReader();

    let fileloaded = e => {
      const fileContents = e.target.result;
      var collections = JSON.parse(fileContents);
      console.log(collections.colection[0].name);
      for (var i = 0; i < collections.colection.length; i++) {
        this.state.colection[i] = collections.colection[i];
      }
      this.contador = collections.colection.length;
      console.log(this.state.colection);
    }
    

    // Mainline of the method
    fileloaded = fileloaded.bind(this);
    reader.onload = fileloaded;
    reader.readAsText(fileObj);
  }

  handleChange(e) {
    console.log(e.target.value);
    //here you will see the current selected value of the select input
  }

  render() {

    let optionColection = this.state.colection.map(c => (
      <option value={c.name}>{c.name}</option>
    ));

    return (
      <div>
        <form>
          <button onClick={this.download}>
            Exportar
              </button>

          <a className="hidden"
            download={this.fileNames[this.state.fileType]}
            href={this.state.fileDownloadUrl}
            ref={e => this.dofileDownload = e}
          ></a>

          <p><button onClick={this.upload}>
            Importar
            </button></p>

          <input type="file" className="hidden"
            multiple={false}
            accept=".json,.csv,.txt,.text,application/json,text/csv,text/plain"
            onChange={evt => this.openFile(evt)}
            ref={e => this.dofileUpload = e}
          />

          <button onClick={this.show}>Ver Colecciones</button>

        </form>
        <pre></pre>
        <button onClick={this.handleOpenModal}>Modal</button>
        <ReactModal
          isOpen={this.state.showModal}
          contentLabel="onRequestClose Example"
          onRequestClose={this.handleCloseModal}
          className="Modal"
          ariaHideApp={false}
        >

          <label>
            Selecciona la coleccion:
            <select value={this.state.value} onChange={this.handleChange}>
              {optionColection}
            </select>
          </label>

          <input type="text" onBlur={this.setCollection} />
          <button onClick={this.create}>New Collection</button>
          <pre></pre>

          <input type="number" onBlur={this.setId} />
          <input type="text" onBlur={this.setCollection} />
          <button onClick={this.addPictoToCollection}>Añadir el Picto a la Colección</button>
          <pre></pre>
          <button onClick={this.handleCloseModal}>Close Modal</button>
        </ReactModal>
        <pre className="status">{this.state.status}</pre>
      </div>

    )
  }
}

export default Collection
