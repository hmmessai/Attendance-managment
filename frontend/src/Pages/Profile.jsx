import React, { useState, useEffect, useContext } from "react";
import {useSearchParams} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endPoint, axiosInstance } from "../endPoint/api";
import Cookies from "js-cookie";
import { AuthContext } from "../Components/Auth/AuthContext";
import Header from "../Components/Other/Header";

export default function Profile () {
    const [loading, setLoading] = useState(false);
    const {state} = useContext(AuthContext);
    const {user, isAuthenticated} = state;

    // useEffect(() => {

    //     const getProfile = async () => {
    //     const token = Cookies.get("token");
    //     try {
    //         setLoading(true);
    //         const response = await axiosInstance.get(endPoint.GETSTUDENT, {
    //         params: { id: queryId },
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //             "Content-Type": "application/json",
    //         },
    //         });
            
    //         console.log(response.data);
    //         setStudent(response.data);
    //     } catch (err) {
    //         console.error("Error fetching student profile:", err);
    //         if (err.response && err.response.status === 401) {
    //         toast.warning("Student profile could not be fetched");
    //         } else {
    //         toast.error("Internal Server Error");
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    //     };

    //     getProfile();
    // }, [queryId]);

    return (
        <>
            <Header
                isAuthenticated={isAuthenticated}
                user={user ? user.name : null}
             />
             <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} closeOnClick pauseOnHover draggable theme="colored" />
            <div className="container pt-5">
                {loading ? (
                  <div className="loading-overlay">
                    <p className="text-center">Loading user profile...</p>
                  </div>
                ) : user && (
                  <>
                    <h1 className="p-5 text-center">User Profile</h1>
                    <div className="d-flex flex-md-row flex-column gap-5 w-100">
                      <div
                        className="card p-4 align-self-start flex-shrink-0 w-25"
                        style={{ display: "inline-block" }}
                      >
                        <h4 className="pb-2 text-nowrap mb-2">
                          <b>{user.name}</b>
                        </h4>

                        <hr className="my-2" />

                        <h5 className="mb-0">{user.role}</h5>
                      </div>
                      <div className="d-flex flex-column align-self-center justify-self-center w-100">
                        <button className="btn btn-dark px-2 gap-3 mb-3 w-25"><span className="bi bi-pencil"></span>Edit</button>
                        <hr></hr>
                        <form className="form-control p-5">
                            <label>Change Name</label>
                            <input className="form-control p-2 mb-3" type="text" value={user.name}/>
                            <hr/>
                            <button type="button" className="btn btn-primary p-2 mb-3">Change Password</button>
                        </form>
                      </div>
                      <div className="form-control p-5 w-50">
                            <h3>Student Accounts</h3>
                            <hr className="p-2"></hr>
                            <div className="w-100 h-100">
                                {user && user.student ? user.student.map((st) => (
                                    <li>{st}</li>
                                )) : 
                                <p className="text-center">No Student Account related to this user.</p>}
                            </div>
                            
                            <button type="button" className="btn btn-primary p-2 mb-3">Connect a Student Account</button>
                        </div>
                      {/* Horizontal Menu */}
                      {/* <div className="w-100">
                      {activeTab !== "course-attendance" && (
                      <div className="d-flex gap-4 border-bottom ">
                        {tabs.map((tab) => (
                          <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`menu-item ${
                              activeTab === tab.id ? "active" : ""
                            }`}
                          >
                            {tab.label}
                          </div>
                        ))}
                      </div>
                      )}*/}

                      {/* Dynamic Content */}
                      {/* <div className="content-box mt-3">{renderContent()}</div>
                      </div> */} 
                    </div>
                  </>
                  
                  )}
            </div>
        </>
    );
}