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
            isLoading: false,
            countTrad: 0,
            selected: [],

        };
        this.cancel = ''
    }

    //Conexióin a la API
    fetchResult = (query) => {
        fetch('https://api.arasaac.org/api/pictograms/es/search/' + query)
            .then(res => res.json())
            .then(json => {
                this.setState({
                    items: json,
                })
            });
    }
    //https://holstein.fdi.ucm.es/nil-ws-api/v1/texto/pictogramas
    postNIL = (query) => {
        fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto: query })
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ tradPic: result })
                console.log(result)
            }
            )
    }

    async populateLema() {

        var lemas = this.state.tradPic.traduccion

        //Ponemos la barra de carga
        this.setState({
            isLoading: true
        })

        for (let i = 0; i < lemas.length; i++) {
            const lema = lemas[i];

            var consulta = []
            var lemaAux = this.state.lemasRaw
            lemaAux[i] = []

            //Insertamos todas las consultas en el array
            for (let j = 0; j < lema.pictogramas.length; j++) {
                consulta.push(axios.get('https://api.arasaac.org/api/pictograms/es/' + lema.pictogramas[j]))
            }

            //Axios las resuelve todas y las añade al estado. Await es para que se hagan de manera secuencial, de otra manera se podían sobreescribir
            await axios.all(consulta).then(
                axios.spread((...allData) => {
                    var lemaAux = this.state.lemasRaw

                    lemaAux[i] = []

                    lemaAux[i].push(allData)
                    this.setState({
                        lemasRaw: lemaAux,
                        countTrad: this.state.countTrad + 1
                    })

                })
            )
        }
        this.cleanUpLemas(this.state.lemasRaw)
    }

    cleanUpLemas(lemas) {

        var cleaned = []
        var selected = []

        for (let i = 0; i < lemas.length; i++) {
            const lema = lemas[i][0];
            var aux
            var listPalabra = []

            for (let j = 0; j < lema.length; j++) {
                listPalabra.push(lema[j].data)
            }

            aux = { "list": listPalabra, "size": listPalabra.length, "sel": 0, "pos": i }
            cleaned[i] = aux

            selected.push(0)
        }

        //isTraducted hace que empieze a renderizarse
        this.setState({
            lemasRaw: cleaned,
            selected: selected,
            countTrad: 0,
            isLoading: false,
            isTraduced: true
        })

    }

    frase2Canvas = () => {
        var lemas = this.state.lemasRaw;
        var sel = this.state.selected
        var frase = []


        //Recorremos el array de lemas para guardar los lemas seleccionados
        //Siendo los seleccionados, los que se ven en pantalla ()
        for (let i = 0; i < lemas.length; i++) {
            const lema = lemas[i];
            frase.push(lema.list[sel[i]])
        }

        console.log(frase)

    }

    renderLemaItems() {

        if (this.state.isLoading) {
            console.log((this.state.countTrad * 100) / 13)
            return (
                <div>
                    <div className="progress">
                        <div className="progress-bar bg-success" role="progressbar" style={{ width: (this.state.countTrad * 100) / 13 + '%' }} aria-valuemin="0" aria-valuemax="100"></div>
                    </div>

                    {console.log((this.state.countTrad * 100) / 13)}
                </div>
            )
        }

        if (this.state.isTraduced) {
            return (
                <div id="div1" className="row pl-4">

                    <button className="btn btn-success btn-sm ml-2" onClick={() => this.frase2Canvas()}>
                        Colocar frase al tablero &nbsp; 
                        <i className="fas fa-arrow-right"></i>
                        
                    </button>

                    <div className="row row-cols-3 row-cols-md-4 g-5">
                        {this.state.lemasRaw.map(item => (
                            this.renderItem(item, this.state.selected[item.pos])
                        ))}
                    </div>
                </div>
            )
        }
    }

    renderItem = (item, i) => {
        var reroll
        if (item.size != 1) {
            reroll =
                <button className="btn-sm btn-outline-primary"
                    onClick={() => this.changeSelected(item, i)}>
                    <span className="fas fa-redo-alt"></span>
                </button>
        }

        return (
            <div className="card">

                <img className="card-img-top"
                    src={'https://api.arasaac.org/api/pictograms/' + item.list[i]._id}
                    // alt={item}
                    sizes="40px" srcset="50px"
                />

                <div className="card-body">
                    <h5 className="card-title text-center">{item.list[i].keywords[0].keyword}</h5>
                    <div class="btn-group" role="group">
                        <button className="btn-sm btn-primary" onClick={() => this.sendSelectedPicto(item.list[i])}>
                            <i className="fas fa-plus"></i>
                        </button>
                        {reroll}

                    </div>
                </div>
            </div>
        )
    }

    changeSelected = (item, selPosItem) => {
        var selAux = this.state.selected

        if (item.size - 1 > selPosItem) {
            selAux[item.pos]++
        }
        else if (item.size - 1 == selPosItem) {
            selAux[item.pos] = 0
        }

        this.setState({
            selected: selAux
        })
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
        this.postNIL(q)
    }

    //Envia información del pictograma seleccionado a la capa superior
    sendSelectedPicto = (picto) => {

        var recentPictos = JSON.parse(localStorage.getItem("recentPictos"));
        if (recentPictos == null) recentPictos = [];
        recentPictos.push(picto);
        localStorage.setItem("recentPictos", JSON.stringify(recentPictos));

        this.props.send2sac(picto);
    }

    frase2Canvas = () => {
        var lemas = this.state.lemasRaw;
        var sel = this.state.selected
        var frase = []


        //Recorremos el array de lemas para guardar los lemas seleccionados
        //Siendo los seleccionados, los que se ven en pantalla ()
        for (let i = 0; i < lemas.length; i++) {
            const lema = lemas[i];
            frase.push(lema.list[sel[i]])
        }

        console.log(frase)
        this.props.sendFrase(frase);


    }


    render() {

        return (
            <div class="cajon">
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <button className="btn btn-outline-primary" title="Traduccion a Picto">
                            <span className="fas fa-search"></span>
                        </button>
                        <button className="btn btn-outline-secondary" onClick={() => this.populateLema()}>
                            <span className="fas fa-dragon"></span>
                        </button>
                    </div>
                    <input type="text" className="form-control" placeholder='Traduccion a Picto' onBlur={this.fetchInputQuery} onKeyDown={this.keyPress} />
                    {/* onBlur={this.fetchInputQuery} onKeyDown={this.keyPress}*/}
                </div>

                {
                    this.renderLemaItems()
                }

            </div>
        );

    }

}

export default NILtraductor;