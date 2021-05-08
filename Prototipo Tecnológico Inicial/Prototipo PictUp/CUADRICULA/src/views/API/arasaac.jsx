import React, { Component } from 'react';
import FormPicto from './formPreAjuste'
import ReactModal from 'react-modal';


import './pictoStyle.css';
import "bootstrap/dist/css/bootstrap.min.css"

class ARASAAC extends Component {

	constructor(props) {
		super(props);
		this.state = {
			modalIsOpen: false,
			items: [],
			query: '',
			isLoaded: false,
			selectedHistorial: false,

			conf: this.props.config

		};
		this.cancel = ''

		this.sendSelectedConf = this.sendSelectedConf.bind(this)
	}

	//Conexióin a la API
	fetchResult = (query) => {
		fetch('https://api.arasaac.org/api/pictograms/es/search/' + query)
			.then(res => res.json())
			.then(json => {
				this.setState({
					isLoaded: true,
					items: json,
				})
			});
	}


	//Cuando se hace onBlur
	fetchInputQuery = (event) => {
		this.sendQuery(this.state.query)
		//event.preventDefault();
	};
	//Al pulsar Intro reaaliza la consulta
	keyPress = (event) => {
		if (event.keyCode === 13) {
			this.sendQuery(event.target.value)
		}
	}

	//Realizar consulta
	sendQuery(q) {
		this.setState({
			query: q
		}, () => this.fetchResult(q))

	}

	//Envia información del pictograma seleccionado a la capa superior

	getFromTrad = (picto) => {
		this.sendSelectedPicto(picto)
	}


	recentPictos = () => {
		this.setState({
			items: JSON.parse(localStorage.getItem("recentPictos")),
			selectedHistorial: true,
		})
	}

	sendSelectedPicto = (picto) => {

		var recentPictos = JSON.parse(localStorage.getItem("recentPictos"));
		if (recentPictos == null) recentPictos = [];

		//Historial limitado a 50 pictogramas
		if (recentPictos.length > 100) {
			recentPictos.pop()
		}

		//Ponemos el elemnto al inicio
		recentPictos.unshift(picto);
		localStorage.setItem("recentPictos", JSON.stringify(recentPictos));

		var aux = {
			picto: picto,
			url: this.createUrl(picto)
		}

		this.props.sendData(aux);
	}

	sendSelectedConf(newConf) {
		console.log(newConf)

		this.setState({
			conf: newConf
		}, () => this.closeModal())

		this.props.newConf(newConf)
	}


	getFraseFromTrad = (frase) => {
		this.sendFrase(frase)
	}

	sendFrase = (frase) => {
		this.props.sendFrase(frase)
	}

	sendSelectedCollection = (picto) => {
		console.log(picto);
		this.props.sendC(picto);
	}

	openModal = () => {
		this.setState({ modalIsOpen: true });
	};

	closeModal = () => {
		this.setState({ modalIsOpen: false });
	};

	createUrl(picto) {


		var query = "";

		if (this.state.conf.time !== "present") {
			query += "_action-" + this.state.time
		}

		if (picto.hair && picto.hair !== null) {
			query += "_hair-" + this.state.conf.hair
		}

		if (picto.skin && picto.skin !== null) {
			query += "_skin-" + this.state.conf.skin
		}

		if (this.state.conf.isPlural || !this.state.conf.isColorized) query = ""

		if (this.state.conf.isPlural) {
			query = "_plural"
		}

		if (!this.state.conf.isColorized) {
			query += "_nocolor"
		}

		console.log(this.state.conf.time)


		return ("https://static.arasaac.org/pictograms/" + picto._id + "/" + picto._id + query + "_500.png")

		//console.log(this.state.url)

	}

	renderResultadoPicto() {

		if (!this.state.isLoaded && !this.state.selectedHistorial) {
			return (null
				// <div>
				// 	<ul class="list-unstyled">
				// 		<li>
				// 			<p><em><span className="fas fa-search" /> Traduce una palabra a pictograma </em></p>
				// 		</li>
				// 		<li>
				// 			<p><span className="fas fa-history" /><em> Consulta últimos pictos que has añadido al tablero</em></p>
				// 		</li>
				// 		<li>
				// 			<p><span className="fas fa-folder-open" /><em> Añade un picto a una lista para usarlos más adelante</em></p>
				// 		</li>
				// 		<li>

				// 		</li>
				// 	</ul>
				// </div>
			)
		}

		if (this.state.selectedHistorial && this.state.items == null) {
			return (
				<p className="fst-italic">No has colocado ningún pictograma aún. Aquí apareceran los útimos pictos que añadas al tablero 😉</p>
			)
		}

		return (<div id="div1" className="row pl-4">
			<div className="row row-cols-3 row-cols-md-5 g-4">

				{this.state.items && !!this.state.items.length && this.state.items.map(item => (
					<div key={item._id} className="card">
						<img className="card-img-top"
							src={this.createUrl(item)}

							sizes="40px" srcset="50px"
						/>

						<div className="card-body">
							<h5 className="card-title text-center">{item.keywords[0].keyword}</h5>
							<div className="btn-group" role="group">
								<button className="btn-sm btn-primary" title="Añadir pictograma al tablero" onClick={() => this.sendSelectedPicto(item)}>
									<i className="fas fa-plus"></i></button>
								<button className="btn-sm btn-outline-primary" title="Añadir el pictograma a mis listas de pictogramas" onClick={() => this.sendSelectedCollection(item)}>
									<span className="fas fa-folder-open"></span>
								</button>
							</div>
						</div>
					</div>
				))}

			</div>
		</div>)
	}


	render() {

		var modalStyles = { overlay: { zIndex: 10 }, width: "30%" };

		return (
			<div className="cajon">

				{/* <NILtraductor send2sac={this.getFromTrad} sendFrase={this.getFraseFromTrad}/> */}

				<div className="input-group mb-3">
					<div className="input-group-prepend">
						<button className="btn btn-outline-primary" title="Buscar Pictograma" onClick={this.fetchInputQuery}>
							<span className="fas fa-search"></span>
						</button>
						<button className="btn btn-outline-secondary" title="Pictogramas buscados recientemente" onClick={this.recentPictos}>
							<span className="fas fa-history"></span>
						</button>
					</div>
					<input type="text" className="form-control" placeholder='Traducir palabra en picto' onChange={e => this.setState({ query: e.target.value })} onKeyDown={this.keyPress} />
					<button className="btn btn-secondary" title="Pre-editar pictogramas" onClick={this.openModal}>
						<span className="fas fa-cogs"></span>
					</button>
				</div>
				{this.renderResultadoPicto()}

				<div>
					<ReactModal
						isOpen={this.state.modalIsOpen}
						ariaHideApp={false}
						contentLabel="Selected Option"
						onRequestClose={this.closeModal}
						className="Modal"
						style={modalStyles}
					>

						<FormPicto conf={this.state.conf} onCloseModal={this.closeModal} onSubmitConf={this.sendSelectedConf} />

					</ReactModal>
				</div>

			</div>

		);

	}

}

export default ARASAAC;