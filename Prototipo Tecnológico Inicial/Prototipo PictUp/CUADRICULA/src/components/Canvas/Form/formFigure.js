import React from 'react';

export const FormFigure = ({ onSubmit }) => {

    return (
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Añadir a colección:</h5>
                </div>
                <div className="modal-body">
                    <form onSubmit={onSubmit}>
                        <h1>Modificar Figura</h1>
                        <input type="color" id="myColor" />
                        <div>
                            <button className="form-control btn btn-primary" type="submit">
                                Modificar
                            </button>
                        </div>
                    </form>
                </div>
                    <div className="modal-footer">

                </div>
            </div>
        </div>

    );
};
export default FormFigure;
