import React, { useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { AuthContext } from "../Auth/AuthContext";

export default function Header( props ) {
    const {logout} = useContext(AuthContext);
    return (
        <div>
        <nav className="navbar navbar-expand-lg bg-body-tertiary" style={{ position: "fixed", top: "0", left: "0", width: "100%", zIndex: '100'}}>
            <div className="container-fluid text-center">
                <a className="navbar-brand custom-bg" href="/">Attendance Management</a>
                <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
            </div>

            <div class="collapse navbar-collapse" id="navbarNav" style={{zIndex: '100'}}>
                {props.isAuthenticated ? 
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item ms-auto px-3">
                        <button class="nav-link active" onClick={logout}>Logout</button>
                    </li>
                    <li class="nav-item ms-auto px-3">
                        <button className="nav-link active" >Services</button>
                    </li>
                    <li class="nav-item ms-auto px-3">
                        <button className="nav-link active" href="#">Contact</button>
                    </li>
                    {props.role ? 
                    <li class="nav-item ms-auto px-3">
                        <a className="nav-link active d-inline-block" href="/add-book"><i className="bi bi-plus"></i>Add</a>
                    </li>:null}
                    <li class="nav-item ms-auto px-3">
                        <p className="nav-link active"><b>{props.user}</b></p>
                    </li>
                </ul> : 
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item ms-auto px-3">
                        <a class="nav-link active" href="/login">Login</a>
                    </li>
                    <li class="nav-item ms-auto px-3">
                        <a class="nav-link active" href="/signup">Signup</a>
                    </li>
                    <li class="nav-item ms-auto px-3">
                        <button class="nav-link active">Services</button>
                    </li>
                    <li class="nav-item ms-auto px-3">
                        <button class="nav-link active">Contact</button>
                    </li>
                </ul>}
            </div>
        </nav>
        </div>
    );
}