import React, { useContext, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Header from "../Components/Other/Header";
import { AuthContext } from "../Components/Auth/AuthContext";


const Login = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [isError, setisError] = useState(false);
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);

    const submitHandler = async (e) => {
        e.preventDefault();
        try{
            setError(null);
            setisError(false);
            await login(email, password);
        } catch (err) {
            console.log("Login error", err);
            setisError(true);
            setError(err.response?.data?.message || 'An error occurred during login');
        }
        
    };

    return (
        <div className="p-4">
            <Header></Header>
            <div className="text-center  p-5">Login</div>
            <div className="d-flex flex-column justify-content-center align-items-center">
                {isError?<div className="card p-2 bg-danger text-white mb-3 w-50 text-center">
                    <p>{error && <span>{error}</span>}</p>
                </div>:null}
                <form className="w-50" onSubmit={submitHandler} action="">
                    <div className="d-flex flex-column gap-3">
                    <input
                        type="email"
                        className="form-control p-3"
                        placeholder="Email Address"
                        onChange={(e) => {
                        setEmail(e.target.value);
                        }}
                    />

                    <input
                        type="password"
                        className="form-control p-3"
                        placeholder="Password"
                        onChange={(e) => {
                        setPassword(e.target.value);
                        }}
                    />
                    </div>
                    <div className="my-3">
                    <p className="d-flex justify-content-end">
                        <span></span>
                    </p>
                    </div>
                    <div className="d-grid">
                    <button
                        type="submit"
                        className="btn btn-primary action-btn fs-5 fw-semibold">
                        Login
                    </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;