import React, { Component } from 'react';
import './buttonStyle.css'


class FormPicto extends Component {

    constructor(props) {
        super(props);

        console.log(this.props.conf.hair)

        this.state = {
            hair: this.props.conf.hair,
            skin: this.props.conf.skin,
            time: this.props.conf.time,
            isColorized: this.props.conf.isColorized,
            isPlural: this.props.conf.isPlural,
            text: this.props.conf.text,
            borderColor: this.props.conf.borderColor,
            borderWidth: this.props.conf.borderWidth,
            hasBorder: this.props.conf.hasBorder,
            url: "https://static.arasaac.org/pictograms/" + this.props.picto._id + "/" + this.props.picto._id + "_500.png",
            picto: this.props.picto
        }
    

        this.handleHairColor = this.handleHairColor.bind(this);
        this.handleSkin = this.handleSkin.bind(this);
        this.handleBorderCol = this.handleBorderCol.bind(this);
        this.handleTime = this.handleTime.bind(this);
        this.handleIsColored = this.handleIsColored.bind(this);
        this.handleisPlural = this.handleisPlural.bind(this);
        this.handleHasBorder = this.handleHasBorder.bind(this);



    }

    componentDidMount(){
        this.createUrl();
        // this.setState({
        //     isColorized: true,
        //     isPlural: false,
        //     url: "https://static.arasaac.org/pictograms/" + this.props.picto._id + "/" + this.props.picto._id
        // })
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

        var conf = {
            hair: this.state.hair,
            skin: this.state.skin,
            time: this.state.time,
            isColorized: this.state.isColorized,
            isPlural: this.state.isPlural,
            text: this.state.text,
            borderColor: this.state.borderColor,
            borderWidth: this.state.borderWidth,
            hasBorder: this.state.hasBorder,
        }

        var aux = {
            newConf: conf,
            url: this.state.url,
            border: this.state.borderColor,
            borderWidth: this.state.borderWidth
        }

        this.props.onSubmit(aux)
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

    handleBorderCol(event) {
        console.log("Border: ", event.target.value)
        this.setState({
            borderColor: event.target.value
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

    handleHasBorder() {

        console.log(this.state.hasBorder)
        var width = 10
        if (this.state.hasBorder) width = 0

        this.setState({
            hasBorder: !this.state.hasBorder,
            borderWidth: width
        }, () => this.createUrl())
    }

    renderHair() {

        if (!this.props.picto.hair || !this.state.isColorized || this.state.isPlural) {
            return (null)
        }
        return (

            <div className="row">
                <div className="w-25 p-3">
                    <div className="col-9">
                        <div className="d-flex justify-content-start" id="colorPelo" onChange={this.handleHairColor}>

                            <div className="col">
                                Pelo:
                            </div>

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
                    </div>
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


            <div className="row">
                <div className="w-25 p-3">
                    <div className="col-9">
                        <div className="d-flex justify-content-start" id="tonoPiel" onChange={this.handleSkin}>
                            <div className="col">
                                Piel:
                            </div>

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
                        </div>
                    </div>
                </div>
            </div>

        )
    }

    renderBorder() {

        if (!this.state.hasBorder) {
            return (null)
        }

        return (


            <div className="row">
                <div className="w-25 p-3">
                    <div className="col-9">
                        <div className="d-flex justify-content-start" id="colorBorde" onChange={this.handleBorderCol}>
                            <div className="col">
                                Box:
                            </div>

                            <div className="col">
                                <label className="contCB-ffeb3b ">
                                    <input type="radio" name="border" value="ffeb3b" />
                                    <span className="checkmark-ffeb3b"></span>
                                </label>
                            </div>

                            <div className="col">
                                <label className="contCB-ff9800 ">
                                    <input type="radio" name="border" value="ff9800" />
                                    <span className="checkmark-ff9800"></span>
                                </label>
                            </div>

                            <div className="col">
                                <label className="contCB-4caf50 ">
                                    <input type="radio" name="border" value="4caf50" />
                                    <span className="checkmark-4caf50"></span>
                                </label>
                            </div>

                            <div className="col">
                                <label className="contCB-2196f3 ">
                                    <input type="radio" name="border" value="2196f3" />
                                    <span className="checkmark-2196f3"></span>
                                </label>
                            </div>

                            <div className="col">
                                <label className="contCB-fda1ff ">
                                    <input type="radio" name="border" value="fda1ff" />
                                    <span className="checkmark-fda1ff"></span>
                                </label>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderTimes() {

        if(!this.state.isColorized || this.state.isPlural){
            return null
        }

        return (
            <div className="row" >
                <select className="form-control mb-3" onChange={this.handleTime} disabled={(!this.state.isColorized || this.state.isPlural)}>
                    <option defaultValue value="present">Selecciona un tiempo verbal</option>
                    <option value="present">Presente</option>
                    <option value="past">Pasado</option>
                    <option value="future">Futuro</option>
                </select>
            </div>
        )
    }

    renderPrePicto() {
        return (
            <img style={{
                border: this.state.borderWidth/2 + "px solid #" + this.state.borderColor
            }}
                src={this.state.url} />
        )
    }

    send = (e) => {
        console.log(e)
        this.props.onSubmit(e)
    }

    closeModal = (e) => {
        this.props.onCloseModal();
    }



    render() {
        return (
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Modificar pictograma: {this.props.picto.keywords[0].keyword}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="container">

                                <div className="row">
                                    <div className="col-3">
                                        <input type="checkbox" checked={!this.state.isColorized} id="noColor" onChange={this.handleIsColored} /> Sin Color
                                    </div>
                                    <div className="col-3">
                                        <input type="checkbox" checked={this.state.isPlural} id="plural" onChange={this.handleisPlural} /> Plural
                                    </div>
                                    <div className="col-3">
                                        <input type="checkbox" checked={this.state.hasBorder} id="plural" onChange={this.handleHasBorder} /> Borde:
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-9">
                                        {this.renderHair()}
                                        {this.renderSkinTone()}
                                        {this.renderBorder()}
                                        {this.renderTimes()}
                                    </div>
                                    <div className="col-3">
                                        {this.renderPrePicto()}
                                    </div>
                                </div>
                            </div>
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
