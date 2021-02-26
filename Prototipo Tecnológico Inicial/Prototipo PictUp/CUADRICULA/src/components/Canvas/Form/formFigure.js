import React from 'react';

export const FormFigure = ({ onSubmit }) => {

    return (
        
        <form onSubmit={onSubmit}>
            <h1>Modificar Figura</h1>
            <input type="color" id="myColor"/>
            <div>
                <button className="form-control btn btn-primary" type="submit">
                    Modificar
                </button>
            </div>

            
        </form>
    );
};
export default FormFigure;
