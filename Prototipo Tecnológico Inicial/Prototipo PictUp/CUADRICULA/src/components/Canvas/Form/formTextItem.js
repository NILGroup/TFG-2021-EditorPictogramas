import React from 'react';

export const FormPicto = ({ onSubmit }) => {

    return (
        
        <form onSubmit={onSubmit}>
            
            
            <h1>Modificar</h1>
            <input type="text" placeholder="WIP" id="textLabel"/>
            <input name="bold" type="checkbox" /> Bold <br />
            <input name="italic" type="checkbox" /> Italic <br />
            <input name="underline" type="checkbox"/> Underline <br />

            <input type="color" id="myColor"/>

            <div>
                <button className="form-control btn btn-primary" type="submit">
                    Modificar
                </button>
            </div>

            
        </form>
    );
};
export default FormPicto;
