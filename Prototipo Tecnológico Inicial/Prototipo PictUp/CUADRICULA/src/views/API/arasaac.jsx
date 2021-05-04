import React, { Component } from 'react';
import NILtraductor from './NILtraductor'

import './pictoStyle.css';
import "bootstrap/dist/css/bootstrap.min.css"

class ARASAAC extends Component {

	constructor(props) {
		super(props);
		this.state = {
			items: [],
			query: '',
		};
		this.cancel = ''
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
		this.sendQuery(event.target.value)
		event.preventDefault();
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
		})
		this.fetchResult(q)
	}

	//Envia información del pictograma seleccionado a la capa superior

	getFromTrad = (picto) => {
		this.sendSelectedPicto(picto)
	}


	recentPictos = () => {
		this.setState({
			items: JSON.parse(localStorage.getItem("recentPictos"))
		})

		console.log("hola")

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

		this.props.sendData(picto);
	}

	getFraseFromTrad = (frase) =>{
		this.sendFrase(frase)
	}

	sendFrase = (frase) =>{
		this.props.sendFrase(frase)
	}

	sendSelectedCollection = (picto) => {
		console.log(picto);
		this.props.sendC(picto);
	}


	render() {

		return (
			<div className="cajon">

				{/* <NILtraductor send2sac={this.getFromTrad} sendFrase={this.getFraseFromTrad}/> */}

				<div className="input-group mb-3">
					<div className="input-group-prepend">
						<button className="btn btn-outline-primary" title="Buscar Pictograma">
							<span className="fas fa-search"></span>
						</button>
						<button className="btn btn-outline-secondary" title="Pictogramas buscados recientemente" onClick={this.recentPictos}>
							<span className="fas fa-history"></span>
						</button>
					</div>
					<input type="text" className="form-control" placeholder='Busca a Picto' onBlur={this.fetchInputQuery} onKeyDown={this.keyPress} />
				</div>
				<div id="div1" className="row pl-4">
					<div className="row row-cols-3 row-cols-md-5 g-4">

						{this.state.items && !!this.state.items.length && this.state.items.map(item => (
							<div key={item._id} className="card">
								<img className="card-img-top"
									src={'https://api.arasaac.org/api/pictograms/' + item._id}

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
				</div>
			</div>

		);

	}

}

export default ARASAAC;