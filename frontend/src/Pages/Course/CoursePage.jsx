import React, { useState, useEffect, useContext } from "react";
import {useSearchParams} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endPoint, axiosInstance } from "../../endPoint/api";
import Cookies from "js-cookie";
import { AuthContext } from "../../Components/Auth/AuthContext";
import Header from "../../Components/Other/Header";
import Sidebar from "../../Components/Other/Sidebar";

export default function CoursePage () {

    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState(null);
    const [id, setId] = useState(null);
    const [searchParams] = useSearchParams();

    const {state} = useContext(AuthContext);
    const {user, isAuthenticated} = state;

    const queryId = searchParams.get("id");

    useEffect(() => {
        if (!queryId) return;
        setId(queryId);

        const getProfile = async () => {
          const token = Cookies.get("token");
          try {
              setLoading(true);
              const response = await axiosInstance.get(endPoint.GETCOURSE, {
              params: { id: queryId },
              headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
              });

              setCourse(response.data);
          } catch (err) {
              console.error("Error fetching course:", err);
              if (err.response && err.response.status === 401) {
              toast.warning("Course could not be fetched");
              } else {
              toast.error("Internal Server Error");
              }
          } finally {
              setLoading(false);
          }
        };

        getProfile();
    }, [queryId]);

    return (
        <>
            <Header
                isAuthenticated={isAuthenticated}
                user={user ? user.name : null}
             />
             
            <div className="container pt-5">
                {loading ? (
                  <div className="loading-overlay">
                    <p className="text-center">Loading Course...</p>
                  </div>
                ) : course && (
                  <>
                  <h1 className="mt-5 text-center align-self-center">Course Page</h1>
                  <div className="d-flex flex-row align-items-start justify-content-start gap-5 mt-5 flex-grow-1">
                    <div className="card p-5 mb-3">
                      <h3>{course.name}</h3>
                      <hr></hr>
                      <h6>Section: {course.section}</h6>
                      <h6>Teacher: {course.teacher}</h6>
                      <h6>Start Date: {new Date(course.start_date).toLocaleDateString()}</h6>
                      <h6>End Date: {new Date(course.end_date).toLocaleDateString()}</h6>
                      <h6 style={{ background: course.status ? "green" : "red", color: "white" }}>
                        Status: {course.status ? "Active" : "Inactive"}
                      </h6>
                      <h6>Created by: {course.created_by.name}</h6>
                      <h6>Created at: {new Date(course.created_at).toLocaleString()}</h6>
                    </div>
                    <div className="table-responsive">
                      <h2>Students taking this course</h2>
                      <table className="table table-striped table-bordered mt-2">
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Day</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* {student.attendance.map((att, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{att.day}</td>
                              <td
                                style={{
                                  background:
                                    att.status === 'Absent'
                                      ? 'red'
                                      : att.status === 'Late'
                                      ? 'yellow'
                                      : att.status === 'Permission'
                                      ? 'blue'
                                      : 'transparent',
                                  color:
                                    att.status === 'Absent' || att.status === 'Permission'
                                      ? 'white'
                                      : 'black',
                                }}
                              >
                                {att.status}
                              </td>
                            </tr>
                          ))} */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  </>
                  )}
            </div>
        </>
    );
}