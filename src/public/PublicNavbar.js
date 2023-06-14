import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import '../assets/css/PublicNavbar.css'

export default function PublicNavbar(props) {
    return (
        <header className="public-navbar pt-3 py-lg-3 mb-4 border-bottom bg-white">
            <div className="container d-flex flex-wrap justify-content-between">
                <Link to="/" className="d-flex align-items-center text-dark text-decoration-none">
                    <span style={{fontSize:'18px'}} className="ms-3">
                        Dyansh Enterprise
                    </span>
                </Link>

                <ul className="nav nav-pills d-block">
                    {!props.islogged && <><li className="nav-item d-inline-block text-center"><NavLink to="/login" className="nav-link" >Login</NavLink></li>
                    <li className="nav-item d-inline-block text-center"><NavLink to="/register" className="nav-link">Create Account</NavLink></li></>}

                    {props.islogged && <li className="nav-item d-inline-block text-center"><NavLink to="/" className="nav-link">Home</NavLink></li>}
                    <li className="nav-item d-inline-block text-center"><NavLink to="/privacy-policy" className="nav-link">Privacy Policy</NavLink></li>
                    <li className="nav-item d-inline-block text-center"><NavLink to="/terms-and-conditions" className="nav-link">Terms and conditions</NavLink></li>
                    <li className="nav-item d-inline-block text-center"><NavLink to="/contact-us" className="nav-link">Contact us</NavLink></li>
                </ul>
            </div>
        </header>
    )
}
