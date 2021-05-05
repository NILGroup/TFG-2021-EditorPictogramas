import React, { Component } from 'react';
import './Navbar.css'

class Navbar extends Component {
    state = { clicked: false }

    handleClick = () => {
        this.setState({ clicked: !this.state.clicked })
    }

    render() {
        return(
            <nav className="NavbarItems">
                <h1 className="navbar-logo"  style={{cursor:'default', fontSize: '30px'}} >Pict Up! <img src={"./img/PictUpIcon.png"} style={{marginTop: '-10px'}}  height="50" width="50" /></h1>
                <div className="menu-icon" onClick={()=> window.open("https://www.instagram.com/pictupweb/", "_blank")}><span style={{color: 'white'}}>
                    <i style={{marginRight: '35px'}} className="fab fa-instagram"></i></span>
                </div>
                <div className="menu-icon" onClick={this.handleClick}>
                    <i className={this.state.clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
                <ul className={this.state.clicked ? 'nav-menu active' : 'nav-menu'}>
                   <li>Poner aqui algo?</li>
                   <li>Otro por aqui</li>
                </ul>
            </nav>
        )
    }
}

export default Navbar