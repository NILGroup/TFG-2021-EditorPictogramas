import React, { Component } from 'react';
import axios from 'axios'
import './pictoStyle.css';
import "bootstrap/dist/css/bootstrap.min.css"

class NILtraductor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            query: '',
            //13 lemas 
            tradPic: { "ok": true, "traduccion": [{ "lema": "hola", "pictogramas": [6009, 6522], "pos": "noun" }, { "lema": "hoy", "pictogramas": [7131, 7131], "pos": "adv" }, { "lema": "vamos", "pictogramas": [2432, 4670, 4671, 6532, 7079, 8142], "pos": "aux" }, { "lema": "a", "pictogramas": [3021, 3049, 7041], "pos": "adp" }, { "lema": "ir", "pictogramas": [2432, 4670, 4671, 6532, 7079, 8142], "pos": "verb" }, { "lema": "al", "pictogramas": [11709], "pos": "adp" }, { "lema": "parque", "pictogramas": [2859, 3140, 6578], "pos": "noun" }, { "lema": "a", "pictogramas": [3021, 3049, 7041], "pos": "adp" }, { "lema": "jugar", "pictogramas": [2439, 6537, 23392, 25181, 25182], "pos": "verb" }, { "lema": "con", "pictogramas": [7064], "pos": "adp" }, { "lema": "la", "pictogramas": [7029, 8476], "pos": "det" }, { "lema": "pelota", "pictogramas": [3241], "pos": "noun" }, { "lema": "azul", "pictogramas": [3355, 4869], "pos": "adj" }] },
            lemas: [],
            lemasRaw: [],
            isTraduced: false,
            countTrad: 0

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



    getPictoFromID = (id, nLema) => {
        fetch('https://api.arasaac.org/api/pictograms/an/' + id)
            .then(res => res.json())
            .then(json => {
                return json
            });
    }

    populateLemax = (tradPic) => {

        var lemas = this.state.tradPic.traduccion

        for (let i = 0; i < lemas.length; i++) {
            const lema = lemas[i];
            console.log(lema.lema)

            var lemaAux = this.state.lemasRaw
            lemaAux[i] = []

            for (let j = 0; j < lema.pictogramas.length; j++) {
                axios.get('https://api.arasaac.org/api/pictograms/an/'
                    + lema.pictogramas[j])
                    .then(res => {
                        console.log(lema.lema, " ", res.data)


                        lemaAux[i].push(res.data)
                        this.setState({
                            lemasRaw: lemaAux
                        })

                        console.log(this.state.lemasRaw[0][0])
                    })


            }
        }

        console.log("CRUDO: ", this.state.lemasRaw)

    }

    async populateLema() {

        var lemas = this.state.tradPic.traduccion

        for (let i = 0; i < lemas.length; i++) {
            const lema = lemas[i];

            var consulta = []
            var lemaAux = this.state.lemasRaw
            lemaAux[i] = []

            for (let j = 0; j < lema.pictogramas.length; j++) {
                consulta.push(axios.get('https://api.arasaac.org/api/pictograms/an/' + lema.pictogramas[j]))
            }

            await axios.all(consulta).then(
                axios.spread((...allData) => {
                    console.log(lema.lema, " ", allData)

                    var lemaAux = this.state.lemasRaw

                    lemaAux[i] = []

                    lemaAux[i].push(allData)
                    this.setState({
                        lemasRaw: lemaAux,
                        countTrad: this.state.countTrad + 1
                    })
                    if (this.state.countTrad == lemas.length) {
                        this.setState({
                            isTraduced: true
                        })
                    }
                })
            )
        }
    }

    renderLemaItems() {

        if (!this.state.isTraduced) {
            //Barra de carga!
            return (

                <div>
                    Cargando items: {this.state.countTrad}
                </div>
            )
        }

        console.log("EL LEMA:", this.state.lemasRaw)

        //var item = this.state.lemasRaw[0][0][0].data

        return (
            <div className="card">
                {this.state.lemasRaw.map(item => (
                    this.renderItem(item[0])
                ))}
            </div>
        )
    }

    renderItem = (item) => {
        console.log("eyy ",item)
        return (
                <div>
                    
                <img className="card-img-top"
                    src={'https://api.arasaac.org/api/pictograms/' + item[0].data._id}
                    // alt={item}
                    sizes="40px" srcset="50px"
                />

                <div className="card-body">
                    <div class="btn-group" role="group">
                        <button className="btn btn-primary btn-xs" onClick={() => this.sendSelectedPicto(item[0])}>
                            <i className="fas fa-plus"></i></button>
                        <button className="btn btn-outline-primary" >
                            <span className="fas fa-redo-alt"></span>
                        </button>
                    </div>
                </div>
            </div>
        )
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
    sendSelectedPicto = (picto) => {

        var recentPictos = JSON.parse(localStorage.getItem("recentPictos"));
        if (recentPictos == null) recentPictos = [];
        recentPictos.push(picto);
        localStorage.setItem("recentPictos", JSON.stringify(recentPictos));

        this.props.sendData(picto);
    }


    render() {

        return (
            <div class="cajon">

                <button className="btn btn-outline-primary" onClick={() => this.populateLema()}>
                    <span className="fas fa-th"></span>
                </button>

                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <button className="btn btn-outline-primary" title="Traduccion a Picto">
                            <span className="fas fa-search"></span>
                        </button>
                    </div>
                    <input type="text" className="form-control" placeholder='Traduccion a Picto' onBlur={this.fetchInputQuery} onKeyDown={this.keyPress} />
                </div>
                <div id="div1" className="row pl-4">
					<div className="row row-cols-3 row-cols-md-4 g-4">
                    {
                        this.renderLemaItems()
                    }
                    </div>
                </div>
            </div>
        );

    }

}

export default NILtraductor;