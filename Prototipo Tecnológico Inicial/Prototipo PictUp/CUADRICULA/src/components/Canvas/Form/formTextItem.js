import React, { Component } from 'react';

class FormPicto extends Component {

    constructor(props) {
        super(props);

        this.state = {
            textFrase: this.props.text,
            fontColor: this.props.fontColor,
        }
    }

    closeModal = (e) => {
        this.props.onCloseModal();
    }

    handleSubmit() {
        var aux = {
            text: this.state.textFrase,
            fontColor: this.state.fontColor
        }
        this.props.onSubmit(aux)
    }

    renderTextInput() {
        return (
            <div className="input-group mb-3">
                <input type="text" value={this.state.textFrase} className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default" onChange={e => this.setState({ textFrase: e.target.value })} />
            </div>
        )
    }


    render() {
        return (
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Editar texto</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {this.renderTextInput()}
                    </div>
                    <div className="modal-footer">
                        <button className="form-control btn btn-primary" onClick={() => this.handleSubmit()}>
                            <i className="fas fa-pencil-alt" /> Cambiar Texto

                        </button>
                    </div>
                </div>
            </div >
        );
    }
}
export default FormPicto;
