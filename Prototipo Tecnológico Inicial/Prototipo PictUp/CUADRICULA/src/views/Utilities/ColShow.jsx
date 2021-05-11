import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"

class ColShow extends Component {

	//Envia información del pictograma seleccionado a la capa superior
	sendSelectedPicto = (picto) => {

		//el boton + que añadiria al tablero
		this.props.sendData(picto);
	}

	recentPictos = () => {
		this.setState({
			items: JSON.parse(localStorage.getItem("recentPictos"))
		})
	}


	render() {
		if(this.props.colections.length == 0){	//si de momento no se ha creado ninguna colección no se muestra el recuadro
			return null;
		}
		else{	//si ya hay colecciones visializo la seleccionada por el usuario
		return (
			<div className="cajon">
				<div id="div1" className="row pl-4">
					<div className="row row-cols-3 row-cols-md-5 g-4">
						{this.props.colections && !!this.props.colections.length && this.props.colections.map(item => (
							<div key={item._id} className="card">
								<img className="card-img-top"
									src={'https://api.arasaac.org/api/pictograms/' + item._id}
									alt={item.keywords[0].keyword}
									sizes="40px" srcset="50px"
								/>
								<div className="card-body">
								 <h5 className="card-title text-center">{item.keywords[0].keyword}</h5>
									<div className="btn-group" role="group">
										<button className="btn btn-primary btn-xs" onClick={() => this.sendSelectedPicto(item)}>
											<i className="fas fa-plus"></i>
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

}

export default ColShow;