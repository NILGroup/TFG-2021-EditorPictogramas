import React, { Component } from 'react';
import './buttonStyle.css'


class FormPicto extends Component {

    constructor(props) {
        super(props);

        this.state = {
            hair: null,
            skin: null,
            time: "present",
            isColorized: true,
            isPlural: false,
            text: null,
            borderColor: null,
            url: "https://static.arasaac.org/pictograms/" + this.props.picto._id + "/" + this.props.picto._id + "_500.png",
            picto: this.props.picto
        }

        this.handleHairColor = this.handleHairColor.bind(this);
        this.handleSkin = this.handleSkin.bind(this);
        this.handleTime = this.handleTime.bind(this);
        this.handleIsColored = this.handleIsColored.bind(this);
        this.handleisPlural = this.handleisPlural.bind(this);

        this.setState({
            isColorized: true,
            isPlural: false,
            url: "https://static.arasaac.org/pictograms/" + this.props.picto._id + "/" + this.props.picto._id
        })

    }

    createUrl() {

        var picto = this.props.picto

        var query = "";

        if (this.state.time !== "present") {
            query += "_action-" + this.state.time
        }

        if (this.state.hair !== null) {
            query += "_hair-" + this.state.hair
        }

        if (this.state.skin !== null) {
            query += "_skin-" + this.state.skin
        }

        if (this.state.isPlural || !this.state.isColorized) query = ""

        if (this.state.isPlural) {
            query = "_plural"
        }

        if (!this.state.isColorized) {
            query += "_nocolor"
        }

        console.log(this.state.time)

        this.setState({
            url: "https://static.arasaac.org/pictograms/" + picto._id + "/" + picto._id + query + "_500.png"
        })

        console.log(this.state.url)

    }

    handleSubmit = (event) => {
        //event.preventDefault()
        this.props.onSubmit(event)
        //this.createUrl()
    }

    send

    handleHairColor(event) {
        this.setState({
            hair: event.target.value
        }, () => this.createUrl())
    }

    handleSkin(event) {

        console.log("Skin: ", event.target.value)
        this.setState({
            skin: event.target.value
        }, () => this.createUrl())
    }

    //Tras actualizar el estado, regenera la URL 
    handleTime(e) {
        this.setState({
            time: e.target.value
        }, () => this.createUrl())
    }

    handleIsColored() {

        this.setState({
            isColorized: !this.state.isColorized
        }, () => this.createUrl())

    }

    handleisPlural() {
        this.setState({
            isPlural: !this.state.isPlural
        }, () => this.createUrl())
    }

    renderHair() {

        if (!this.props.picto.hair || !this.state.isColorized || this.state.isPlural) {
            return (null)
        }
        return (

            <div className="d-flex justify-content-start" id="colorPelo" onChange={this.handleHairColor}>


                <div className="col">
                    <label className="contCB-A65E26 ">
                        <input type="radio" name="hair" value="A65E26" />
                        <span className="checkmark-A65E26"></span>
                    </label>
                </div>
                <div className="col">
                    <label className="contCB-FDD700">
                        <input type="radio" name="hair" value="FDD700" />
                        <span className="checkmark-FDD700"></span>
                    </label>
                </div>
                <div className="col">
                    <label className="contCB-ED4120" >
                        <input type="radio" name="hair" value="ED4120" />
                        <span className="checkmark-ED4120"></span>
                    </label>
                </div>
                <div className="col">
                    <label className="contCB-020100">
                        <input type="radio" name="hair" value="020100" />
                        <span className="checkmark-020100"></span>
                    </label>
                </div>
                <div className="col">
                    <label className="contCB-AAABAB" >
                        <input type="radio" name="hair" value="AAABAB" />
                        <span className="checkmark-AAABAB"></span>
                    </label>
                </div>
                <div className="col">
                    <label className="contCB-EFEFEF" >
                        <input type="radio" name="hair" value="EFEFEF" />
                        <span className="checkmark-EFEFEF"></span>
                    </label>
                </div>
            </div>
        )
    }

    renderSkinTone() {
        //Si el picto no tiene piel o se ha desactivado el color o es plural, se desactiva
        if (!this.props.picto.skin || !this.state.isColorized || this.state.isPlural) {
            return (null)
        }

        return (

            <div className="d-flex justify-content-start" id="tonoPiel" onChange={this.handleSkin}>

                <div className="col">
                    <label className="contCB-A65C17 ">
                        <input type="radio" name="skin" value="A65C17" />
                        <span className="checkmark-A65C17"></span>
                    </label>
                </div>

                <div className="col">
                    <label className="contCB-CF9D7C" >
                        <input type="radio" name="skin" value="CF9D7C" />
                        <span className="checkmark-CF9D7C"></span>
                    </label>
                </div>

                <div className="col">
                    <label className="contCB-E3AB72">
                        <input type="radio" name="skin" value="E3AB72" />
                        <span className="checkmark-E3AB72"></span>
                    </label>
                </div>

                <div className="col">
                    <label className="contCB-F4ECAD">
                        <input type="radio" name="skin" value="F4ECAD" />
                        <span className="checkmark-F4ECAD"></span>
                    </label>
                </div>
                <div className="col">
                    <label className="contCB-F5E5DE" >
                        <input type="radio" name="skin" value="F5E5DE" />
                        <span className="checkmark-F5E5DE"></span>
                    </label>
                </div>
            </div>)
    }

    renderTimes() {

        return (
            <div className="row" >
                <h1><b>Tiempo verbal:<br /></b></h1>
                <select className="form-select" onChange={this.handleTime} disabled={(!this.state.isColorized || this.state.isPlural)}>
                    <option selected value="present">Presente</option>
                    <option value="past">Pasado</option>
                    <option value="future">Futuro</option>
                </select>
            </div>
        )
    }

    renderPrePicto() {
        return (
            <img src={this.state.url} />
        )
    }

    send = (e) => {
        console.log(e)
        this.props.onSubmit(e)
    }


    render() {
        return (
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Modificar pictograma: {this.props.picto.keywords[0].keyword}</h5>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={this.handleSubmit}>

                            <div className="container">

                                <div className="row">

                                    <div className="col-9">
                                        {this.renderHair()}
                                        <br />
                                        {this.renderSkinTone()}
                                        <br />
                                        <br />
                                        <br />
                                    </div>
                                    <div className="col-3">
                                        {this.renderPrePicto()}
                                    </div>

                                </div>

                                {this.renderTimes()}

                                <div className="row">
                                    <div className="col-3">
                                        <input type="checkbox" id="noColor" onChange={this.handleIsColored} /> Sin Color <br />
                                        <input type="checkbox" id="plural" onChange={this.handleisPlural} /> Plural <br />
                                    </div>

                                </div>


                            </div>

                            {/* 
                            TODO: Cambiar borde y texto
                            <select id="borderColor" className="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                                <option style={{ backgroundColor: "#ffffff" }} value="#ffffff">Blanco</option>
                                <option style={{ backgroundColor: "#ffeb3b" }} value="#ffeb3b">Amarillo</option>
                                <option style={{ backgroundColor: "#ff9800" }} value="#ff9800">Naranja</option>
                                <option style={{ backgroundColor: "#4caf50" }} value="#4caf50">Verde</option>
                                <option style={{ backgroundColor: "#2196f3" }} value="#2196f3">Azul</option>
                                <option style={{ backgroundColor: "#fda1ff" }} value="#fda1ff">Rosa</option>
                                <option style={{ backgroundColor: "#000000" }} value="#000000">Negro</option>
                            </select>


                            <input name="label" type="text" />  <br />
                            <input type="color" id="myColor" />
                            <br /><br /> */}





                        </form>

                        <div className="modal-footer">
                            <button className="form-control btn btn-primary" onClick={() => this.handleSubmit(this.state.url)}>
                                Aplicar cambios
                                </button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default FormPicto;
