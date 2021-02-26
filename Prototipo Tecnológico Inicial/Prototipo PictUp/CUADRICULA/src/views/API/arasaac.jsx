import React, {Component} from 'react';
import './pictoStyle.css';
class ARASAAC extends Component {

    constructor(props){
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
		if(event.keyCode == 13){
			this.sendQuery(event.target.value)
		}
	}

	//Realizar consulta
	sendQuery(q){
		this.setState({
			query: q
		})
		this.fetchResult(q)
	}

	//Envia información del pictograma seleccionado a la capa superior
	sendSelectedPicto = (picto) => {
		this.props.sendData(picto); 
	}
	sendSelectedCollection = (picto) => {
        this.props.sendC(picto);
    }



	render() {
		
		var {items} = this.state;
		

		return (
		<div className="cajon">
			<label>
				<input
					type="text"
					name="query"
					//value ={query}
					id='input'
					placeholder='Busca a Picto'
					onBlur = {this.fetchInputQuery}
					onKeyDown={this.keyPress}
				/>
				<button>Buscar</button>
			</label>

			{/* Check map not empty */}
			<div id="div1" className="row">
				{items && !!items.length && items.map(item =>(
					
					<div key={item._id} className="column" >
						<button onClick={() => this.sendSelectedPicto(item)}>+</button>
						<button onClick={() => this.sendSelectedCollection(item)}>Collection</button>
						<img src={'https://api.arasaac.org/api/pictograms/' +  item._id} width="50" height="50" />
						{/* <img src={'https://static.arasaac.org/pictograms/' +  item._id + '/' + item._id + '_action-future_hair-020100_skin-A65C17_500.png'} width="50" height="50" /> */}
						<div>{item.keywords[0].keyword}</div>
					</div>
				))}
				
			</div>
		</div>
		);
		
	  }

}

export default ARASAAC;