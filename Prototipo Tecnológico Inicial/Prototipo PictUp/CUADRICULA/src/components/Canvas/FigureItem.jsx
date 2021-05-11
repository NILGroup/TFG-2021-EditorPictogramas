// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Rnd from 'react-rnd';
import IconButton from '../Icon/IconButton';
import FormFigure from './Form/formFigure'
import './Styles/FigureItemStyle.css';

import ReactModal from 'react-modal';

const proptypes = {
    label: PropTypes.string.isRequired,
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    canvasSize: PropTypes.number,
    canvasHeight: PropTypes.number,
    moveAriaDescribedby: PropTypes.string,
    resizeAriaDescribedby: PropTypes.string,
    idPicto: PropTypes.number,
    tipo: PropTypes.object,
    imageSRC: PropTypes.string,
    imageURL: PropTypes.string,
    apiObject: PropTypes.object
};

class FigureItem extends Component {
    constructor(props) {
        super(props);

        this.handleMoveClick = this.handleMoveClick.bind(this);
        this.handleMoveKeyDown = this.handleMoveKeyDown.bind(this);

        this.handleResizeClick = this.handleResizeClick.bind(this);
        this.handleResizeKeyDown = this.handleResizeKeyDown.bind(this);

        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleModifyClik = this.handleModifyClik.bind(this)
        this.handleEditKeyDown = this.handleEditKeyDown.bind(this);

        this.increaseZIndex = this.increaseZIndex.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);
        this.handleResizeStop = this.handleResizeStop.bind(this);

        this.defaultPosition = {
            x: (this.props.gridInterval * this.props.x),
            y: (this.props.gridInterval * this.props.y),
            width: (this.props.gridInterval * this.props.width),
            height: (this.props.gridInterval * this.props.height),
            minWidth: (this.props.gridInterval * this.props.minWidth),
            minHeight: (this.props.gridInterval * this.props.minHeight)
        };
        //variables modificable 
        this.state = {
            isMoving: false,
            isResizing: false,
            isEditing: false,
            zIndex: 0,
            x: this.defaultPosition.x,
            y: this.defaultPosition.y,
            width: this.defaultPosition.width,
            height: this.defaultPosition.height,
            borderColor: this.props.tipo.color,
            label: this.props.label,
            opacidad: this.props.tipo.range,
        }

        this.lockAspectRatio = true;

        // Only allow drag-resize from bottomRight
        this.resizeHandles = {
            bottom: false,
            bottomLeft: false,
            bottomRight: true,
            left: false,
            right: false,
            top: false,
            topLeft: false,
            topRight: false
        };


    }

    componentDidMount() {
        if (this.props.tipo.tipo === "---") {
            this.setState({ zIndex: 1 })
        }
        else {
            this.setState({ zIndex: 9 })
        }
    }

    increaseZIndex() {
        this.setState({ zIndex: this.state.zIndex + 1 });
    }

    /** ---- Moving element START ---- **/

    updatePosition(x, y, isCancel) {
        this.rnd.updatePosition({ x: x, y: y });
        this.setState({ x: x, y: y });
        if (isCancel) {
            this.props.updateLiveText(`Move cancelled.`);
        }
        else {
            this.props.updateLiveText(`
        Row: ${x / this.props.gridInterval + 1},
        Column: ${y / this.props.gridInterval + 1}.
      `);
        }
    }

    moveLeft() {
        if (this.state.x > 0) {
            this.updatePosition(this.state.x - this.props.gridInterval, this.state.y);
        } else {
            this.props.updateLiveText('Reached left edge of canvas');
        }
    }

    moveRight() {
        if (this.state.x + this.state.width < this.props.canvasSize) {
            this.updatePosition(this.state.x + this.props.gridInterval, this.state.y);
        } else {
            this.props.updateLiveText('Reached right edge of canvas');
        }
    }

    moveUp() {
        if (this.state.y > 0) {
            this.updatePosition(this.state.x, this.state.y - this.props.gridInterval);
        } else {
            this.props.updateLiveText('Reached top edge of canvas');
        }
    }

    moveDown() {
        if (this.state.y + this.state.height < this.props.canvasSize) {
            this.updatePosition(this.state.x, this.state.y + this.props.gridInterval);
        } else {
            this.props.updateLiveText('Reached bottom edge of canvas');
        }
    }

    cancelMove() {
        this.updatePosition(this.state.prevX, this.state.prevY, true);
        this.setState({ isMoving: false });
    }

    handleMoveKeyDown(event) {
        if (this.state.isMoving) {
            switch (event.key) {
                case 'ArrowUp':
                    this.moveUp();
                    event.preventDefault();
                    break;
                case 'ArrowDown':
                    this.moveDown();
                    event.preventDefault();
                    break;
                case 'ArrowLeft':
                    this.moveLeft();
                    event.preventDefault();
                    break;
                case 'ArrowRight':
                    this.moveRight();
                    event.preventDefault();
                    break;
                case 'Escape':
                    this.cancelMove();
                    break;
                // handled with click
                case ' ':
                case 'Enter':
                    break;
                default:
                    event.preventDefault();
                    break;
            }
        }
    }

    handleMoveClick(event) {
        const isMoving = !this.state.isMoving;
        this.setState({ isMoving: isMoving, isResizing: false, isEditing: false });

        if (isMoving) {
            this.props.updateLiveText(`
        Element grabbed. Current position:
        Row ${this.state.x / this.props.gridInterval + 1},
        Column ${this.state.y / this.props.gridInterval + 1}.
        Use the arrow keys to change position of the top left corner on canvas,
        Spacebar to drop, Escape key to cancel.`);
            this.setState({ prevX: this.state.x, prevY: this.state.y });
        } else {
            this.props.updateLiveText(`
        Element dropped. New position:
        Row ${this.state.x / this.props.gridInterval + 1},
        Column ${this.state.y / this.props.gridInterval + 1}.`);
        }
    }

    /* Update state to reflect new position */
    handleDragStop(event, data) {
        this.setState({ x: data.x, y: data.y });
    }

    /** ---- Moving element END ---- **/
    /** ---- Resizing element START ---- **/

    updateSize(width, height, isCancel) {
        this.rnd.updateSize({ width: width, height: height });
        this.setState({ width: width, height: height });
        if (isCancel) {
            this.props.updateLiveText(`Resize cancelled.`);
        }
        else {
            this.props.updateLiveText(`
        Width: ${width / this.props.gridInterval},
        Height: ${height / this.props.gridInterval}.
      `);
        }
    }

    makeShorter() {
        if (this.state.height > this.props.minHeight) {
            this.updateSize(this.state.width, this.state.height - this.props.gridInterval);
        }
    }

    makeTaller() {
        const newHeight = this.state.height + this.props.gridInterval;
        if (this.state.y + newHeight <= this.props.canvasSize) {
            this.updateSize(this.state.width, this.state.height + this.props.gridInterval);
        }
    }

    makeWider() {
        const newWidth = this.state.width + this.props.gridInterval;
        if (this.state.x + newWidth <= this.props.canvasSize) {
            this.updateSize(this.state.width + this.props.gridInterval, this.state.height);
        }
    }

    makeNarrower() {
        if (this.state.width > this.props.minWidth) {
            this.updateSize(this.state.width - this.props.gridInterval, this.state.height);
        }
    }

    cancelResize() {
        this.updateSize(this.state.prevWidth, this.state.prevHeight, true);
        this.setState({ isResizing: false });
    }

    handleResizeKeyDown(event) {
        if (this.state.isResizing) {
            switch (event.key) {
                case 'ArrowUp':
                    this.makeShorter();
                    event.preventDefault();
                    break;
                case 'ArrowDown':
                    this.makeTaller();
                    event.preventDefault();
                    break;
                case 'ArrowLeft':
                    this.makeNarrower();
                    event.preventDefault();
                    break;
                case 'ArrowRight':
                    this.makeWider();
                    event.preventDefault();
                    break;
                case 'Escape':
                    this.cancelResize();
                    break;
                // handled with click
                case ' ':
                case 'Enter':
                    break;
                default:
                    event.preventDefault();
                    break;
            }
        }
    }

    handleResizeClick(event) {
        const isResizing = !this.state.isResizing;
        this.setState({ isResizing: isResizing, isMoving: false, isEditing: false });

        if (isResizing) {
            this.props.updateLiveText(`
        Resize element. Current size:
        ${this.state.width / this.props.gridInterval} cells wide by
        ${this.state.height / this.props.gridInterval} cells tall.
        Press Right Arrow to make wider, Left Arrow to make narrower,
        Down Arrow to make taller, Up Arrow to make shorter,
        Spacebar to finish, Escape key to cancel.`);
            this.setState({ prevWidth: this.state.width, prevHeight: this.state.height });
        } else {
            this.props.updateLiveText(`
        Element resized. New size:
        ${this.state.width / this.props.gridInterval} cells wide by
        ${this.state.height / this.props.gridInterval} cells tall.`);
        }
    }


    cancelEdit() {
        this.setState({ isEditing: false });
    }

    handleEditKeyDown(event) {
        if (this.state.isEditing) {
            switch (event.key) {
                case 'Escape':
                    this.cancelEdit();
                    break;
                // handled with click
                case ' ':
                case 'Enter':
                    break;
                default:
                    event.preventDefault();
                    break;
            }
        }
    }

    handleRemoveClick(event) {
        const isEditing = !this.state.isEditing;
        this.setState({ isResizing: false, isMoving: false, isEditing: isEditing });

        if (isEditing) {
            this.props.sendData(this.props.idPicto); //etiqueta del picto
        }
    }

    handleModifyClik(event) {

        var range = Number(event.range);
        var color = event.color;


        this.setState({
            borderColor: color,
            opacidad: range
        })

        this.closeModal();
    }

    //Funciones de aumentar o disminuir el texto
    handleIncreaseText = () => {
        if (this.state.fontSize <= this.state.defaultFontSize * 6) {
            this.setState({
                fontSize: this.state.fontSize + 0.03
            })
        }
    }
    handleReduzeText = () => {
        if (this.state.fontSize <= this.state.defaultFontSize) {
            this.setState({
                fontSize: this.state.fontSize - 0.02
            })
        }
    }


    /** Update state to reflect new size */
    handleResizeStop(event, direction, refToElement, delta) {
        this.setState({
            width: this.state.width + delta.width,
            height: this.state.height + delta.height
        });
    }


    openModal = () => {
        this.setState({ modalIsOpen: true });
    };

    closeModal = () => {
        this.setState({ modalIsOpen: false });
    };

    mostrarFigura = () => {
        if (this.props.tipo.tipo == "---") {//es un cuadrado
            return (
                <div className="slds-p-vertical_medium slds-text-heading_small">
                    <svg width={this.state.width * 0.9} height={this.state.width * 0.9}>
                        <rect rx="10" ry="10" width={this.state.width * 0.9} height={this.state.width * 0.9}
                            style={{ fill: "transparent", stroke: this.state.borderColor, strokeWidth: 10, opacity: this.state.opacidad }} />
                    </svg>

                </div>
            )
        } else {
            return (

                // <i className={this.props.tipo} ></i>
                <div className="slds-p-vertical_medium slds-text-heading_small" >
                    <span style={{ fontSize: this.state.width * 0.7, color: this.state.borderColor, opacity: this.state.opacidad }} >
                        <i className={this.props.tipo.tipo} ></i>
                    </span>
                </div>
            )
        }
    }
    /** ---- Resizing element END ---- **/

    render() {
        const itemClasses = classNames(
            'dnd-canvas__object_Box', {
            'dnd-canvas__object--invisible': true
        });
        var modalStyles = { overlay: { zIndex: 10 } };

        return (
            <Rnd
                ref={c => { this.rnd = c; }}
                className={itemClasses}
                default={this.defaultPosition}
                resizeGrid={[this.props.gridInterval, this.props.gridInterval]}
                dragGrid={[this.props.gridInterval, this.props.gridInterval]}
                minWidth={this.props.minWidth * this.props.gridInterval}
                minHeight={this.props.minHeight * this.props.gridInterval}
                bounds="parent"
                z={this.state.zIndex}

                onDragStop={this.handleDragStop}
                onResizeStop={this.handleResizeStop}
                enableResizing={this.resizeHandles}
                lockAspectRatio={this.lockAspectRatio}
                style={{
                    backgroundcolor: "white"
                }}
            >
                <div>
                    <div>
                        <IconButton
                            assistiveText={"Borrar " + this.props.label}
                            ariaDescribedby={this.props.editAriaDescribedby}
                            className="dnd-canvas__object-button dnd-canvas__object-button--resize"
                            sprite="utility"
                            symbol="close"
                            onClick={this.handleRemoveClick}
                            onKeyDown={this.handleEditKeyDown} />
                    </div>
                    {this.mostrarFigura()}

                    <div className="dnd-canvas__object-buttons">

                        <IconButton
                            ariaDescribedby={this.props.editAriaDescribedby}
                            className="dnd-canvas__object-button dnd-canvas__object-button--edit"
                            sprite="utility"
                            symbol="edit"
                            onClick={this.openModal}
                        />


                        <div>
                            <ReactModal
                                isOpen={this.state.modalIsOpen}
                                ariaHideApp={false}
                                contentLabel="Selected Option"
                                onRequestClose={this.closeModal}
                                className="Modal"
                                ariaHideApp={false}
                                style={modalStyles}>

                                <FormFigure onSubmit={this.handleModifyClik} onCloseModal={this.closeModal} iniColor={this.state.borderColor} iniRange={this.state.opacidad} />

                            </ReactModal>
                        </div>

                    </div>

                </div>
            </Rnd>
        );
    }
}

FigureItem.propTypes = proptypes;

export default FigureItem;