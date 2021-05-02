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
      colection: []
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
    console.log(this.props.dataFromParent);
    for (var i = 0; i < this.contador; ++i) {
      console.log(this.state.colection[i]);
    }
  }

  openModal = (idPicto) => {
    //this.Id = idPicto;
    this.handleOpenModal();
  }

  download(event) {
    event.preventDefault();
    var colection = this.props.coleccionesActuales;
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
        var total = this.state.colection.concat(collections.colection[i]);
        this.setState({colection: total});
      }

      this.contador = this.contador + collections.colection.length;

      //aqui devolver las colecciones
      this.props.sendColeccion(this.state.colection);
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

    return (
      <div>

        <div className="container">
          <div className="row mb-2 mt-2">
            <button className="btn btn-outline-info btn-sm" title="Guarda el estado de tus listas de pictogramas" onClick={this.download}><i className="fas fa-file-download"></i> 
              &nbsp; Exportar mis listas de pictogramas
            </button>

            <a className="hidden"
              download={this.fileNames[this.state.fileType]}
              href={this.state.fileDownloadUrl}
              ref={e => this.dofileDownload = e}
            ></a>

            <p><button className="btn btn-outline-info btn-sm ml-2" title="Carga el estado de tus listas de pictogramas" onClick={this.upload}><i className="fas fa-file-upload"></i> 
              &nbsp; Importar mis listas de pictogramas
            </button></p>

            <input type="file" className="hidden" style={{display: 'none'}}
              multiple={false}
              accept=".json,.csv,.txt,.text,application/json,text/csv,text/plain"
              onChange={evt => this.openFile(evt)}
              ref={e => this.dofileUpload = e}
            />

          </div>
        </div>
      </div>

    )
  }
}

export default Collection
