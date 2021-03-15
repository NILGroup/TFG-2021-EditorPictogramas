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
                <h1 className="navbar-logo">Pict Up! <img src={"./img/PictUpIcon.png"} height="40" width="40" /></h1>
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