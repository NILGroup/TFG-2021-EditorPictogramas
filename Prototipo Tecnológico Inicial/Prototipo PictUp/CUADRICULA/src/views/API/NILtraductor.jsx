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
            tradPic: {},
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
            }).catch(error => {
                console.log(error)
            });
    }
    //https://holstein.fdi.ucm.es/nil-ws-api/v1/texto/pictogramas

    // fetch('http://localhost:5000/getData')
    // .then(response => response.json())
    // .then(data => console.log(data));

    postNIL = (query) => {

        console.log(query)

        fetch('http://localhost:5000/frase2picto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ texto: query })
        })
            .then(response => response.json())
            .then(result => {
                this.setState({ tradPic: result.traduccion  } ,() => this.parseFrase(result))
                //console.log(result)

            }
            )
        // fetch('http://localhost:5000/getData')
        //     .then(response => response.json())
        //     .then(data => console.log(data));

    }

    parseFrase(result){
        if(!result.ok){
            //No se ha encontrado traduccion
            return;
        }

        let trad = result.traduccion

        console.log(trad)

        let res = []
        let cont = 0
        let select = []
        for (let i = 0; i < trad.length; i++) {
            const lema = trad[i];
            if(!lema.pictogramas.length == 0){
                res.push({
                    lema: lema.lema,
                    pictos: lema.pictogramas,
                    pos: cont
                })

                select.push(0)
                cont++
            }
        }

        console.log(res)

        this.setState({
            lemasRaw: res,
            isTraduced: true,
            selected: select
        })

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
                        {this.state.lemasRaw.map(lema => (
                            this.renderItem(lema, this.state.selected[lema.pos])
                        ))}
                    </div>
                </div>
            )
        }
    }

    //TODO: Boton de añadir desactivado hasta que no se implementen los PICTOS NO EDITABLES
    renderItem = (item, i) => {
        var reroll
        if (item.pictos.length != 1) {
            reroll =
                <button className="btn-sm btn-outline-primary"
                    onClick={() => this.changeSelected(item.pictos, i, item.pos)}>
                    <span className="fas fa-redo-alt"></span>
                </button>
        }

        return (
            <div className="card">

                <img className="card-img-top"
                    src={'http://hypatia.fdi.ucm.es/conversor/Pictos/' + item.pictos[i]}
                    // alt={item}
                    sizes="40px" srcset="50px"
                />

                <div className="card-body">
                    <h5 className="card-title text-center">{item.lema}</h5>
                    <div className="btn-group" role="group">
                        {/* <button className="btn-sm btn-primary" onClick={() => this.sendSelectedPicto(item)}>
                            <i className="fas fa-plus"></i>
                        </button> */}
                        {reroll}

                    </div>
                </div>
            </div>
        )
    }

    changeSelected = (item, selPosItem, pos) => {

        console.log(item, selPosItem, item.length)
        var selAux = this.state.selected

        if (item.length - 1 > selPosItem) {
            selAux[pos]++
        }
        else if (item.length - 1 == selPosItem) {
            selAux[pos] = 0
        }

        this.setState({
            selected: selAux
        })

        console.log(this.state.selected)

    }

    
    fetchInputQuery = (event) => {
        this.sendQuery(event.target.value)
        event.preventDefault();
    };
    
    keyPress = (event) => {
        //Al pulsar Intro reaaliza la consulta
        if (event.keyCode === 13) {
            this.setState({
                query: event.target.value,
                isTraduced: false
            }, () => this.sendQuery())
            this.sendQuery(event.target.value)
        }

        this.setState({
            query: event.target.value,
            isTraduced: false
        })
    }

    //Realizar consulta
    sendQuery() {
        this.postNIL(this.state.query)
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
        var res = []

        var send = []

        //Recorremos el array de lemas para guardar los lemas seleccionados
        //Siendo los seleccionados, los que se ven en pantalla ()
        for (let i = 0; i < lemas.length; i++) {
            const lema = lemas[i];
            res.push({
                lema: lema.lema,
                url: "http://hypatia.fdi.ucm.es/conversor/Pictos/" + lema.pictos[sel[i]]
            })
        }

        send = {
            frase: this.state.query,
            pictos: res
        }

        console.log(send)
        this.props.sendFrase(send);
    }


    render() {

        return (
            <div className="cajon">
                <div className="input-group mb-3">
                    <div className="input-group-prepend">
                        <button className="btn btn-outline-primary" title="Traducción de la frase" onClick={this.fetchInputQuery}>
                            <span className="fas fa-search"></span>
                        </button>

                    </div>
                    <input type="text" className="form-control" placeholder='Traduccion a Picto' onChange={this.keyPress} onKeyDown={this.keyPress} />
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