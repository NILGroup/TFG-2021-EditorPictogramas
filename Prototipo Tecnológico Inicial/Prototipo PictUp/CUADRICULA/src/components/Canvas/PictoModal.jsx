import React from 'react';
import Modal from 'react-modal';
//npm install react-modal
 
const modalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};
 
const NoteModal = (props) => (
    <Modal
        isOpen={!!props.selectedNote}
        onRequestClose={props.closeNoteModal}
        style={modalStyles}
        contentLabel='Selected Note'
        ariaHideApp={false}
    >
        <h4>Selected Note</h4>
        <p>{props.selectedNote}</p>
        <button onClick={props.closeNoteModal}>OK</button>
    </Modal>
);
 
export default NoteModal;