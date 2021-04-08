import React, { Component } from 'react';
import './pictoStyle.css';
class NIL extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            query: '',
            result: '',
            postId: '',
        };

        this.cancel = ''

    }


    prueba01 = () => {

        let query = {
            texto: "Hola vecinos de la gran ciudad"
        }

        fetch('https://holstein.fdi.ucm.es/nil-ws-api/v1/texto/pictogramas',
            {
                mode: 'no-cors',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(query)
            }).then(response => response.json())
            .then(data => console.log(data));
        //this.setState({ postId: data.traduccion[0].lema })
    }


    prueba02 = () => {
        fetch("https://holstein.fdi.ucm.es/nil-ws-api/v1/texto/pictogramas", 
            {
                method: "POST",
                body: JSON.stringify({ texto: "Esto es una prueba" }),
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*'
                },
                mode: 'no-cors' 
            })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
            });
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
        if (event.keyCode == 13) {
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
    sendSelectedPicto = (picto) => {
        this.props.sendData(picto);
    }
    sendSelectedCollection = (picto) => {
        console.log(picto);
        this.props.sendC(picto);
    }



    render() {

        var { items } = this.state;


        return (
            <div>
                {/* <label>
                    <input
                        type="text"
                        name="query"
                        //value ={query}
                        id='input'
                        placeholder='Busca a Picto'
                        onBlur={this.fetchInputQuery}
                        onKeyDown={this.keyPress}
                    />
                    <button>Buscar</button>
                </label> */}

                <button onClick={this.prueba02}>Prueba</button>
                {/* <h3>{this.state.result}</h3> */}

            </div>
        );

    }

}

export default NIL;