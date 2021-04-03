import React from 'react';
import './buttonStyle.css'

export const FormPicto = ({ onSubmit, picto }) => {


    return (


        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Modificar pictograma: {picto.keywords[0].keyword}</h5>
                </div>
                <div className="modal-body">
                    <form onSubmit={onSubmit}>

                        <div className="container">
                            <div className="row">
                                <div className="col-3"><b>Color Pelo</b></div>
                                <div className="col-3"><b>Tono de piel</b></div>
                                <div className="col-4"><b>Tiempo Verbal</b></div>
                            </div>
                            <div className="row">
                                <div className="col-3" id="colorPelo" >

                                    <label className="contCB-A65E26 ">Brown
                                        <input type="radio" name="hair" value="A65E26" />
                                        <span className="checkmark-A65E26"></span>
                                    </label>
                                    <label className="contCB-FDD700">Blonde
                                        <input type="radio" name="hair" value="FDD700" />
                                        <span className="checkmark-FDD700"></span>
                                    </label>
                                    <label className="contCB-ED4120" >Red
                                        <input type="radio" name="hair" value="ED4120" />
                                        <span className="checkmark-ED4120"></span>
                                    </label>
                                    <label className="contCB-020100">Black
                                        <input type="radio" name="hair" value="020100" />
                                        <span className="checkmark-020100"></span>
                                    </label>
                                    <label className="contCB-EFEFEF" >White
                                        <input type="radio" name="hair" value="EFEFEF" />
                                        <span className="checkmark-EFEFEF"></span>
                                    </label>
                                    <label className="contCB-AAABAB" >Dark Gray
                                        <input type="radio" name="hair" value="AAABAB" />
                                        <span className="checkmark-AAABAB"></span>
                                    </label>
                                </div>
                                <div className="col-3" id="tonoPiel">

                                    <label className="contCB-A65C17 ">Black
                                        <input type="radio" name="skin" value="A65C17" />
                                        <span className="checkmark-A65C17"></span>
                                    </label>
                                    <label className="contCB-E3AB72">Mulatto
                                        <input type="radio" name="skin" value="E3AB72" />
                                        <span className="checkmark-E3AB72"></span>
                                    </label>
                                    <label className="contCB-CF9D7C" >Aztec
                                        <input type="radio" name="skin" value="CF9D7C" />
                                        <span className="checkmark-CF9D7C"></span>
                                    </label>
                                    <label className="contCB-F4ECAD">Assian
                                        <input type="radio" name="skin" value="A65C17" />
                                        <span className="checkmark-F4ECAD"></span>
                                    </label>
                                    <label className="contCB-F5E5DE" >White
                                        <input type="radio" name="skin" value="F5E5DE" />
                                        <span className="checkmark-F5E5DE"></span>
                                    </label>

                                </div>
                                <div className="col-3" id="tiempoVerbal">
                                    <input defaultChecked name="time" type="radio" value="present" /> Presente <br />
                                    <input name="time" type="radio" value="past" /> Pasado<br />
                                    <input name="time" type="radio" value="future" /> Futuro <br />



                                </div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <input type="checkbox" id="noColor" /> Sin Color <br />
                                    <input type="checkbox" id="plural" /> Plural <br />
                                </div>

                            </div>

                        </div>

                        <select id="borderColor" className="form-select form-select-lg mb-3" aria-label=".form-select-lg example">
                            <option style={{ backgroundColor: "#ffffff" }} value="#ffffff">Blanco</option>
                            <option style={{ backgroundColor: "#ffeb3b" }} value="#ffeb3b">Amarillo</option>
                            <option style={{ backgroundColor: "#ff9800" }} value="#ff9800">Naranja</option>
                            <option style={{ backgroundColor: "#4caf50" }} value="#4caf50">Verde</option>
                            <option style={{ backgroundColor: "#2196f3" }} value="#2196f3">Azul</option>
                            <option style={{ backgroundColor: "#fda1ff" }} value="#fda1ff">Rosa</option>
                            <option style={{ backgroundColor: "#000000" }} value="#000000">Negro</option>
                        </select>


                        <input name="label" type="text" />  <br />
                        <input type="color" id="myColor" />
                        <br /><br />

                        <div className="modal-footer">
                            <button className="form-control btn btn-primary" type="submit">
                                Modificar
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
};
export default FormPicto;
