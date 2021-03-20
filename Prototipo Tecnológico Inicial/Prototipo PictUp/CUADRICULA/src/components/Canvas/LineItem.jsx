// Copyright (c) 2015-present, salesforce.com, inc. All rights reserved
// Licensed under BSD 3-Clause - see LICENSE.txt or git.io/sfdc-license

import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Rnd from 'react-rnd';
import IconButton from '../Icon/IconButton';
import './CanvasItem.css';
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
  imageSRC: PropTypes.string,
  imageURL: PropTypes.string,
  apiObject: PropTypes.object
};

class LineItem extends Component {
  constructor(props) {
    super(props);

    this.handleMoveClick = this.handleMoveClick.bind(this);
    this.handleMoveKeyDown = this.handleMoveKeyDown.bind(this);

    this.handleResizeClick = this.handleResizeClick.bind(this);
    this.handleResizeKeyDown = this.handleResizeKeyDown.bind(this);

    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handleRotateClick = this.handleRotateClick.bind(this)
    //this.handleModifyClik = this.handleModifyClik.bind(this)
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

      backColor: "white",

    }

   
    this.lockAspectRatio = true;

    // Only allow drag-resize from bottomRight
    this.resizeHandles = {
      bottom: true,
      bottomLeft: false,
      bottomRight: false,
      left: false,
      right: false,
      top: true,
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

  handleRotateClick() {
    var old_heigh = this.state.height 
    var old_width =  this.state.width 
    //Si está en vertical (no se puede ampliar por la derecha o izquierda)
    if(!this.resizeHandles.right){
      this.resizeHandles = {
        bottom: false,
        bottomLeft: false,
        bottomRight: false,
        left: true,
        right: true,
        top: false,
        topLeft: false,
        topRight: false
      }

      this.rnd.updateSize({ width: old_heigh, height: old_width });
      this.setState({ width: old_heigh, height: old_width });
      console.log(this.state.height)
    }
    else{
      this.resizeHandles = {
        bottom: true,
        bottomLeft: false,
        bottomRight: false,
        left: false,
        right: false,
        top: true,
        topLeft: false,
        topRight: false
      };
      this.rnd.updateSize({ width: old_heigh, height: old_width });
      this.setState({ width: old_heigh, height: old_width });
    }


  }

  /** Update state to reflect new size */
  handleResizeStop(event, direction, refToElement, delta) {
    this.setState({
      width: this.state.width + delta.width,
      height: this.state.height + delta.height
    });
  }

  handleRemoveClick(event) {
    const isEditing = !this.state.isEditing;
    this.setState({ isResizing: false, isMoving: false, isEditing: isEditing });

    if (isEditing) {
      console.log("estamos en item y pasamos el id", this.props.idPicto)
      this.props.sendData(this.props.idPicto); //etiqueta del picto
    }
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
      'dnd-canvas__object'
      , {
      'dnd-canvas__object--moving': this.state.isMoving,
      'dnd-canvas__object--resizing': this.state.isResizing,
      'dnd-canvas__object--editing': this.state.isEditing,
      'background-color' : "#8fef74"
    });

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
        style={{
          backgroundColor: "black"
        }}
      >

      <IconButton
        ariaDescribedby={this.props.editAriaDescribedby}
        className="dnd-canvas__object-button dnd-canvas__object-button--edit"
        sprite="utility"
        symbol="rotate"
        onClick={this.handleRotateClick}
      />

      <IconButton
        assistiveText={"Borrar " + this.props.label}
        ariaDescribedby={this.props.editAriaDescribedby}
        className="dnd-canvas__object-button dnd-canvas__object-button--edit"
        sprite="utility"
        symbol="delete"
        onClick={this.handleRemoveClick}
        onKeyDown={this.handleEditKeyDown} 
      />

      </Rnd>
    );
  }
}

LineItem.propTypes = proptypes;

export default LineItem;