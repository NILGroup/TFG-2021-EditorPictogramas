import React, { Component } from 'react';
import './Navbar.css'

class Navbar extends Component {
    state = { clicked: false }

    handleClick = () => {
        this.setState({ clicked: !this.state.clicked })
    }

    render() {
        return (
            <nav className="NavbarItems">
                <h1 className="navbar-logo" style={{ cursor: 'default', fontSize: '30px' }} >Pict Up! <img src={"./img/PictUpIcon.png"} style={{ marginTop: '-10px' }} height="50" width="50" /></h1>

                <div className="menu-icon" title="Realiza el cuestionario" onClick={() => window.open("https://forms.gle/YxeVEscH32pqDsE4A", "_blank")}>


                    <button className="btn btn-info" title="Añadir el pictograma a mis listas de pictogramas" style={{ marginRight: '50px', marginTop:'-10px'  }} onClick={() => window.open("https://forms.gle/LqUcfv5Go2TPq6Dx6", "_blank")}>
                        <span className="fas fa-vote-yea"></span> ¡Realizar el formulario!
                    </button>
                </div>



                <div className="menu-icon" title="Descubre más aplicaciones" onClick={() => window.open("http://nil.fdi.ucm.es/?q=aplicaciones/accesibilidad", "_blank")}><span style={{ color: 'white' }}>

                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                        width="30px" height="30px" viewBox="0 0 108.000000 130.000000"
                        preserveAspectRatio="xMidYMid meet" style={{ marginRight: '105px', marginTop: '-10px' }}>
                        <g transform="translate(0.000000,130.000000) scale(0.100000,-0.100000)"
                            fill="#FFFFFF" stroke="none">
                            <path d="M490 1200 l0 -80 50 0 50 0 0 80 0 80 -50 0 -50 0 0 -80z" />
                            <path d="M496 934 c-3 -9 -6 -222 -6 -475 l0 -459 50 0 50 0 0 475 0 475 -44 0 c-31 0 -46 -5 -50 -16z" />
                            <path d="M13 623 c-10 -3 -13 -69 -13 -279 l0 -274 50 0 50 0 0 211 c0 137 3 208 10 204 6 -3 10 -2 10 2 0 12 56 44 64 36 3 -3 6 -2 6 3 0 7 67 10 100 5 3 -1 12 -11 20 -23 12 -18 16 -70 20 -228 l5 -205 53 -3 53 -3 -3 218 c-3 216 -3 218 -30 264 -39 65 -61 77 -149 77 -73 0 -101 -9 -139 -47 -13 -13 -15 -12 -19 5 -2 10 -7 24 -11 29 -10 12 -57 16 -77 8z" />
                            <path d="M682 318 l3 -313 198 -3 198 -2 -3 37 -3 38 -142 3 -143 3 0 274 0 275 -55 0 -55 0 2 -312z" />
                        </g>
                    </svg>

                </span>

                </div>
                <div className="menu-icon" title="Contacta con nosotros" onClick={() => window.location.href = ("mailto:pictupdevalfon@gmail.com")}><span style={{ color: 'white' }}>
                    <i style={{ marginRight: '70px' }} className="far fa-envelope-open"></i></span>
                </div>
                <div className="menu-icon" title="Nuestras redes sociales" onClick={() => window.open("https://www.instagram.com/pictupweb/", "_blank")}><span style={{ color: 'white' }}>
                    <i style={{ marginRight: '35px' }} className="fab fa-instagram"></i></span>
                </div>
                {/* <div className="menu-icon" onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                    <li>Poner aqui algo?</li>
                    <li>Otro por aqui</li>
                </ul> */}
            </nav>
        )
    }
}

export default Navbar