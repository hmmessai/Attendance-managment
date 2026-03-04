import { useState, useContext } from "react";
import { AuthContext } from "../Components/Auth/AuthContext";

const SignUp = (props) => {
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const [isError, setisError] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { signUp } = useContext(AuthContext);

    const submitHandler = async (e) => {
        try {
            setisError(false);
            setError(null);
            e.preventDefault();
            await signUp(name, email, password);
        } catch (err) {
            setisError(true);
            setError(err.response?.data?.message || 'An error occurred during signup');
        }
        
    };
    return (
        <div>
            <div className="text-center p-5 m-4 fs-4">Signup</div>
            <div className="d-flex flex-column justify-content-center align-items-center">
                {isError?<div className="card p-2 bg-danger text-white mb-3 w-50 text-center">
                    <p>{error && <span>{error}</span>}</p>
                </div>:null}
                <form className="w-50" onSubmit={submitHandler} action="">
                    <div className="d-flex flex-column gap-3">
                    <input
                        type="text"
                        className="form-control p-3"
                        placeholder="Name"
                        onChange={(e) => {
                        setName(e.target.value);
                        }}
                    />

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
                    
                    </div>
                    <div className="d-grid">
                    <button
                        type="submit"
                        className="btn btn-primary action-btn fs-5 fw-semibold">
                        Sign Up
                    </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUp;