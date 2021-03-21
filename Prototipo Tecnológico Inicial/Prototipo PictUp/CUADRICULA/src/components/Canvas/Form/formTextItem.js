import React from 'react';

export const FormPicto = ({ onSubmit }) => {

    return (
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Editar texto</h5>
                </div>
                <div className="modal-body">
                    <form onSubmit={onSubmit}>
                        <h1>Modificar</h1>
                        <input type="text" placeholder="WIP" id="textLabel" />
                        <input name="bold" type="checkbox" /> Bold <br />
                        <input name="italic" type="checkbox" /> Italic <br />
                        <input name="underline" type="checkbox" /> Underline <br />
                        <input type="color" id="myColor" />
                        <div>
                            <button className="form-control btn btn-primary" type="submit">
                                Modificar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div >
    );
};
export default FormPicto;
