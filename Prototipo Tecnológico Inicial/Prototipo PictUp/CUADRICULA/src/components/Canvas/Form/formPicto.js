import React from 'react';
import './buttonStyle.css'

export const FormPicto = ({ onSubmit }) => {

    return (


        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Modificar pictograma:</h5>
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
                                        <input name="hair" type="radio" value="A65E26" /> Brown <br />
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

                        
                        <select id="borderColor" className="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                            <option style={{backgroundColor: "#ffffff"}} value="#ffffff">Blanco</option>
                            <option style={{backgroundColor: "#ffeb3b"}} value="#ffeb3b">Amarillo</option>
                            <option style={{backgroundColor: "#ff9800"}} value="#ff9800">Naranja</option>
                            <option style={{backgroundColor: "#4caf50"}} value="#4caf50">Verde</option>
                            <option style={{backgroundColor: "#2196f3"}} value="#2196f3">Azul</option>
                            <option style={{backgroundColor: "#fda1ff"}} value="#fda1ff">Rosa</option>
                            <option style={{backgroundColor: "#000000"}} value="#000000">Negro</option>
                        </select>

                        
                        <input name="label" type="text" />  <br />
                        <input type="color" id="myColor" />
                        <br/><br/>
                        <input type="checkbox" id="noColor"/> Sin Color <br/>
                        <input type="checkbox" id="plural"/> Plural <br/>

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
