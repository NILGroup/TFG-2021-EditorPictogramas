import React, { Component } from 'react';

class formFigure extends Component {

    constructor(props) {
        super(props);

        this.state = {
            color: this.props.iniColor,
            range: this.props.iniRange,
        }
    }

    closeModal = (e) => {
        this.props.onCloseModal();
    }

    handleSubmit() {
        var aux = {
            color: this.state.color,
            range: this.state.range
        }
        this.props.onSubmit(aux)
    }


    render() {
        return (
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel"><strong>Editar figura</strong></h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="row ml-2 mr-2 mt-2">
                            <h1>Cambiar el color de la figura</h1> <div className="ml-2"><input type="color" id="myColor" onChange={e => this.setState({ color: e.target.value })}/></div>
                        </div>
                        <div className="row ml-2 mr-2 mt-4">
                            <h1>Selecciona la opacidad de la figura</h1> <div className="ml-2"><input type="range" className="form-range" min="0.1" max="1" defaultValue={this.state.range} step="0.1" id="range" onChange={e => this.setState({ range: e.target.value })}></input></div>
                        </div>

                        <div>
                            <button className="form-control btn btn-primary mt-4" onClick={() => this.handleSubmit()}>
                                Modificar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
};
export default formFigure;
