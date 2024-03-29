// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Rnd from 'react-rnd';
import IconButton from '../Icon/IconButton';

import FormEditFrase from './Form/formEditFrase'
import ReactModal from 'react-modal';

const proptypes = {
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
    frase: PropTypes.array,
    texto: PropTypes.string,
};

class FraseItem extends Component {
    constructor(props) {
        super(props);

        this.handleMoveClick = this.handleMoveClick.bind(this);
        this.handleMoveKeyDown = this.handleMoveKeyDown.bind(this);

        this.handleResizeClick = this.handleResizeClick.bind(this);
        this.handleResizeKeyDown = this.handleResizeKeyDown.bind(this);

        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleEditKeyDown = this.handleEditKeyDown.bind(this);

        this.increaseZIndex = this.increaseZIndex.bind(this);
        this.handleDragStop = this.handleDragStop.bind(this);

        this.handleModifyClik = this.handleModifyClik.bind(this)


        this.defaultPosition = {
            x: (this.props.gridInterval * this.props.x),
            y: (this.props.gridInterval * this.props.y),
            width: (this.props.gridInterval * this.props.width * 5),
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

            texto: this.props.texto,
            frase: this.props.frase,
            modalIsOpen: false,
            selected: new Array(this.props.frase.length).fill(true)
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

    increaseZIndex() {
        this.setState({ zIndex: this.state.zIndex + 1 });
    }

    /** ---- Moving element START ---- **/

    updatePosition(x, y, isCancel) {
        this.rnd.updatePosition({ x: x, y: y });
        this.setState({ x: x, y: y });
    }

    moveLeft() {
        if (this.state.x > 0) {
            this.updatePosition(this.state.x - this.props.gridInterval, this.state.y);
        }
    }

    moveRight() {
        if (this.state.x + this.state.width < this.props.canvasSize) {
            this.updatePosition(this.state.x + this.props.gridInterval, this.state.y);
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
            this.setState({ prevWidth: this.state.width, prevHeight: this.state.height });
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

    handleRemoveClick() {
        const isEditing = !this.state.isEditing;
        this.setState({ isResizing: false, isMoving: false, isEditing: isEditing });

        if (isEditing) {
            this.props.deleteItem(this.props.idPicto); //etiqueta del picto
        }
    }

    handleModifyClik(e) {

        this.setState({
            texto: e.text,
            selected: e.selected
        })
        this.closeModal()
        //event.preventDefault();
    }

    renderLemas = () => {
        return (
            <div className="row">

                {
                    this.state.frase.map((palabra, i) => {
                        return (
                            this.renderPalabra(palabra, i)
                        )
                    })
                }
            </div>
        )
    }

    renderPalabra(palabra, i){
        if(!this.state.selected[i]) return ""
        return (
            <div className="col" key={i}>
                <img className="img-responsive" src={palabra.url} size="50px" key={palabra.url} />
            </div>
        )
    }

    openModal = () => {
        this.setState({ modalIsOpen: true });
    };

    closeModal = () => {
        this.setState({ modalIsOpen: false });
    };


    /** ---- Resizing element END ---- **/

    render() {
        const itemClasses = classNames(
            'dnd-canvas__object', {
            'dnd-canvas__object--moving': this.state.isMoving,
            'dnd-canvas__object--resizing': this.state.isResizing,
            'dnd-canvas__object--editing': this.state.isEditing
        });

        var modalStyles = { overlay: { zIndex: 10 }, width: "30%" };

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
                onDragStart={this.increaseZIndex}
                onDragStop={this.handleDragStop}
                onResizeStop={this.handleResizeStop}
                enableResizing={this.resizeHandles}
            //lockAspectRatio={this.lockAspectRatio}
            >
                <div>

                    {this.renderLemas()}

                    <div className="slds-p-vertical_medium slds-text-heading_small">
                        <h1>{this.state.texto}</h1>

                    </div>

                    <div className="dnd-canvas__object-buttons">

                        <IconButton
                            ariaDescribedby={this.props.editAriaDescribedby}
                            className="dnd-canvas__object-button dnd-canvas__object-button--edit"
                            sprite="utility"
                            symbol="close"
                            onClick={this.handleRemoveClick}
                            onKeyDown={this.handleEditKeyDown}
                        />

                        <IconButton
                            assistiveText={"Edit " + this.props.label}
                            ariaDescribedby={this.props.editAriaDescribedby}
                            className="dnd-canvas__object-button dnd-canvas__object-button--edit"
                            sprite="utility"
                            symbol="edit"
                            onClick={this.openModal}
                        />

                    </div>


                    <div>
                        <ReactModal
                            isOpen={this.state.modalIsOpen}
                            ariaHideApp={false}
                            contentLabel="Selected Option"
                            onRequestClose={this.closeModal}
                            className="Modal"
                            style={modalStyles}
                        >

                            <FormEditFrase onSubmit={this.handleModifyClik} onCloseModal={this.closeModal} frase={this.props.frase} selected={this.state.selected} texto={this.state.texto} />

                        </ReactModal>
                    </div>

                </div>
            </Rnd>
        );
    }
}

FraseItem.propTypes = proptypes;

export default FraseItem;