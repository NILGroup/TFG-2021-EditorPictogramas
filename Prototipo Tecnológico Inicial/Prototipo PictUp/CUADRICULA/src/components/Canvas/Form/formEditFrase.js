import React, { Component } from 'react';

class FormEditFrase extends Component {

    constructor(props) {
        super(props);

        this.state = {
            textFrase: this.props.texto,
            arrayPictos: this.props.frase,
            selected: this.props.selected
        }

        this.handleVisiblePicto = this.handleVisiblePicto.bind(this);

    }

    handleVisiblePicto(i) {
        var aux = this.state.selected;
        aux[i] = !aux[i]

        this.setState({
            selected: aux
        })
    }

    handleSubmit() {
        var aux = {
            text: this.state.textFrase,
            selected: this.state.selected
        }
        this.props.onSubmit(aux)
    }
    
    closeModal = (e) => {
        this.props.onCloseModal();
    }

    renderPicto(picto, i) {
        var icon = "far fa-eye"
        var ButtonColor = "btn btn-outline-primary btn-sm"
        if (!this.state.selected[i]) {
            icon = "fas fa-eye-slash"
            ButtonColor = "btn btn-outline-danger btn-sm"
        }

        console.log(i)

        return (

            <div className="col" key={i} style={{ align: "center" }}>
                <div className="row justify-content-center">
                    <img className="img-responsive" src={picto.url} style={{ width: 50, height: 50 }} />
                </div>
                <div className="row justify-content-center">
                    <button type="button" className={ButtonColor} onClick={() => this.handleVisiblePicto(i)}>
                        <i className={icon}></i>
                    </button>
                </div>

            </div>
        )

    }


    renderAllPictos() {
        console.log("Frase: ", this.props.frase)
        console.log("Selected: ", this.props.selected)

        return (
            <div className="row">
                {this.state.arrayPictos.map((picto, i) => (
                    this.renderPicto(picto, i)
                ))}
            </div>
        )
    }

    renderImage(picto, i) {
        if (!this.state.selected[i]) return "";
        return (
            <div className="col" key={i} style={{ align: "center" }}>
                <div className="row justify-content-center">
                    <img className="img-responsive" src={picto.url} style={{ width: 50, height: 50 }} />
                </div>
            </div>
        )

    }

    renderPictoFrase() {

        let noVisiblePictos = this.state.selected.every(function (e) {
            return !e
        });

        console.log(noVisiblePictos)

        if (noVisiblePictos) return (<h1>No hay pictos visibles</h1>)

        return (
            <div className="row row-cols-md-8 g-8">
                {this.state.arrayPictos.map((picto, i) => (
                    this.renderImage(picto, i)
                ))}
            </div>
        )
    }

    render() {
        return (
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Editar frase: {this.state.textFrase}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        {this.renderPictoFrase()}
                    </div>

                    <div className="modal-body">
                        {this.renderAllPictos()}
                    </div>

                    <div className="input-group mb-3">
                        <input type="text" value={this.state.textFrase} className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" onChange={e => this.setState({ textFrase: e.target.value })} />
                    </div>

                    <div className="modal-footer">
                        <button className="form-control btn btn-primary" onClick={() => this.handleSubmit()}>
                            Aplicar cambios
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default FormEditFrase;
