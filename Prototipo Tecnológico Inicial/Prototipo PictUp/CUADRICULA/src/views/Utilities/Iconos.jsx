import React, { Component } from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import { forEach } from 'jszip';


export class Iconos extends React.Component {

    constructor() {
        super()

        this.state = {
        }

    }


    check = () => {
        var data = {
            tipo : "fas fa-check",
            color: "#008000",
            range: "0.5"
        }
        this.props.check(data);
    }

    heart = () => {
        var data = {
            tipo : "fas fa-heart",
            color: "#ff0000",
            range: "0.5"
        }
        this.props.check(data);
    }

    circle = () => {
        var data = {
            tipo : "fas fa-slash",
            color: "#ff0000",
            range: "0.5"
        }
        this.props.check(data);
    }

    render() {

        return (
            <div>
                <button className="btn btn-outline-info btn-sm ml-2" title="Añadir un tick al tablero" onClick={this.check}><i className="fas fa-check"></i>
                </button>
                <button className="btn btn-outline-info btn-sm ml-2" title="Añadir una barra inclinada al tablero" onClick={this.circle}><i className="fas fa-slash"></i>
                </button>
                <button className="btn btn-outline-info btn-sm ml-2" title="Añadir un corazón al tablero" onClick={this.heart}><i className="fas fa-heart"></i>
                </button>
            </div>

        )
    }
}

export default Iconos
