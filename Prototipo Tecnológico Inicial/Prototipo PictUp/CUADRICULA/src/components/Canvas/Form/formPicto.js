import React from 'react';
import './buttonStyle.css'

export const FormPicto = ({ onSubmit }) => {

    return (


        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Añadir a colección:</h5>
                </div>
                <div className="modal-body">
                    <form onSubmit={onSubmit}>


                        <h1>Modificar</h1>
                        <table>
                            <thead>
                                <tr>
                                    <th>Color Pelo</th>
                                    <th>Tono de piel</th>
                                    <th>Tiempo Verbal</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input name="hair" cssClass="e-primary" type="radio" value="A65E26" /> Brown <br />
                                        <input name="hair" type="radio" value="FDD700" /> Blonde <br />
                                        <input name="hair" type="radio" value="ED4120" /> Red <br />
                                        <input name="hair" type="radio" value="020100" /> Black <br />
                                        <input name="hair" type="radio" value="EFEFEF" /> Gray <br />
                                        <input name="hair" type="radio" value="AAABAB" /> Dark Gray <br />
                                        <input name="hair" type="radio" value="6A2703" /> DarkBrown <br />
                                    </td>
                                    <input name="skin" className="radioBlack" type="radio" value="A65C17" /> black <br />
                                    <input name="skin" type="radio" value="E3AB72" /> mulatto <br />
                                    <input name="skin" type="radio" value="CF9D7C" /> aztec <br />
                                    <input name="skin" type="radio" value="F4ECAD" /> assian <br />
                                    <input name="skin" type="radio" value="F5E5DE" /> white <br />
                                    <td>
                                        <input defaultChecked name="time" type="radio" value="present" /> Presente <br />
                                        <input name="time" type="radio" value="past" /> Pasado<br />
                                        <input name="time" type="radio" value="future" /> Futuro <br />
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <input name="label" type="text" />  <br />
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
export default FormPicto;
