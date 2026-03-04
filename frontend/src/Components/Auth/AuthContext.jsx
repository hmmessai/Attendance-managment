import React, { createContext, useEffect, useState, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";
import { axiosInstance, endPoint } from "../../endPoint/api";

const initialState = {
    isAuthenticated: false,
    user: null,
}

const reducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload,
            };
        case "LOGOUT":
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        default:
            return state;
    }
};


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        const checkAuthentication = async () => {
            const token = Cookie.get("token");
            if (token) {
                try {
                    const response = await axiosInstance.get(endPoint.ME, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (response.status === 200) {
                        dispatch({
                            type: "SET_USER",
                            payload: response.data,
                        });
                    }
                } catch (error) {
                    console.error("Authentication Error:", error);
                    dispatch({ type: "LOGOUT" });
                }
            } else {
                dispatch({ type: "LOGOUT" });
            }
            setLoading(false); 
        };
        checkAuthentication();
    }, [navigate]);

    const [state, dispatch] = useReducer(reducer, initialState);

    if (loading) {
        // Display loading screen while authentication is being checked
        return <div>Loading...</div>;
    }

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post(endPoint.LOGIN, { email, password,});

            if (response.status === 200) {
                const { token, user } = response.data;
                Cookie.set("token", token);
                
                dispatch({
                    type: "SET_USER",
                    payload: user,
                });

                navigate("/home");
            }
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    };

    const signUp = async (name, email, password) => {
        try {
            const response = await axiosInstance.post(endPoint.SIGNUP, {
                name,
                email,
                password,
            });

            if (response.status === 200) {
                console.log(response.data);
                const { token, user } = response.data;
                Cookie.set("token", token);
                
                dispatch({
                    type: "SET_USER",
                    payload: user,
                });

                navigate("/home");
            }
        } catch (error) {
            console.log("Signup Error: ", error);
            throw error;
        }
    };

    const logout = () => {
        Cookie.remove("token");
        dispatch({ type: "LOGOUT" });
        navigate("/");
    };
    
    return (
        <AuthContext.Provider value={{ state, login, signUp, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
