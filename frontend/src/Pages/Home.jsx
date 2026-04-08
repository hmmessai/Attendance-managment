import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../App.css';
import { AuthContext } from "../Components/Auth/AuthContext";
import Header from "../Components/Other/Header";
import StudentChoice from "../Components/Other/StudentChoice";
import { endPoint, axiosInstance } from "../endPoint/api";
import Sidebar from "../Components/Other/Sidebar";
import Loading from "../Components/Other/Loading";
import { DatePicker } from "et-calendar";
import Cookies from "js-cookie";

const Home = (props) => {
    const getTodayDate = () => new Date().toISOString().split('T')[0];

    const [attendanceDate, setAttendanceDate] = useState(getTodayDate());
    const { state } = useContext(AuthContext);
    const { user, isAuthenticated } = state;
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [section, setSection] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [attendanceTypes, setAttendanceTypes] = useState([]);
    const [attendanceTypeFilter, setAttendanceTypeFilter] = useState("");
    const [sections, setSections] = useState([]);
    const [show, setShow] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [attendanceType, setAttendanceType] = useState("ትምህርት");
    const [createSection, setCreateSection] = useState("");
    const navigate = useNavigate();
    // const [loadingSearch, setLoadingSearch] = useState(true);

    useEffect(() => {
        
        const fetchStudents = async () => {
            try {
                const optionsResponse = await axiosInstance.get(endPoint.OPTIONS);
                setAttendanceTypes(optionsResponse.data.types);
                setSections(optionsResponse.data.sections);
                const response = await axiosInstance.post(endPoint.FULLATTENDANCEBYDATE,
                    { "date": attendanceDate, "section": section, "page": page, "limit": 10, "type": attendanceTypeFilter },
                    {
                        headers: {
                            "Authorization": `Bearer ${Cookies.get("token")}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                
                setAttendances(response.data.data);
                setTotalPages(response.data.totalPages);
                if (response.data == []) {
                    toast.warning("No attendance records found for this date");
                } 
            } catch (err) {
                console.log("Error fetching attendances:", err);
                if (err.response && err.response.status === 404) {
                    setAttendances([]);
                    toast.warning("No attendance records found for this date and section");
                } else if (err.response && err.response.status === 401) {
                    toast.error("Unauthorized. Please log in again.");
                } else {
                    toast.error("Error fetching attendances");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [loading, attendanceDate, section, page, attendanceTypeFilter]);

    const handleStatusChange = async (attendanceId, status) => {
        const token = Cookies.get("token");
        try {
            const response = await axiosInstance.put(
                endPoint.UPDATEATTENDANCE,
                {
                    attendanceId: attendanceId,
                    status: status
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
            toast.success("Attendance updated successfully");
        } catch (err) {
            console.log("Error updating attendance:", err);
            if (err.status === 400) {
                toast.warning("Invalid attendance ID or status");
            } else if (err.status === 401) {
                toast.error("Unauthorized. Please log in again.");
            } else {
                toast.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const lockAttendance = async () => {
        const token = Cookies.get("token");
        try {
            const response = await axiosInstance.post(
                endPoint.LOCKATTENDANCE, 
                {
                    "date": attendanceDate,
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            toast.success("Attendance locked successfully for " + attendanceDate);
        } catch (err) {
            console.log("Error locking attendance:", err);
            if (err.status === 401) {
                toast.error("Unauthorized. Please log in again.");
            } 
            else if (err.status === 403) {
                toast.error("Attendance date should be in the past to be locked.");
            }else if (err.status === 404) {
                toast.warning("No attendance records found for the specified date");
            }
            else {
                toast.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const createAttendanceAll = async () => {
        const token = Cookies.get("token");
        try {
            const response = await axiosInstance.post(
                endPoint.CREATEDAILYFORALL, 
                {
                    "date": attendanceDate,
                    "type": attendanceType
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            console.log(response);
            toast.success("Attendance created successfully for " + attendanceDate);
        } catch (err) {
            console.log("Error creating attendance:", err);
            if (err.status === 400) {
                toast.warning("Attendance for this date already exists");
            } else if (err.status === 401) {
                toast.error("Unauthorized. Please log in again.");
            } else {
                toast.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const createAttendance = async () => {
        const token = Cookies.get("token");
        try {
            const response = await axiosInstance.post(
                endPoint.CREATEDAILYFORSPECIFIC, 
                {
                    "date": attendanceDate,
                    "section": createSection,
                    "type": attendanceType
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            toast.success("Attendance created successfully for " + attendanceDate);
        } catch (err) {
            console.log("Error creating attendance:", err);
            if (err.status === 400) {
                toast.warning("Attendance for this date already exists");
            } else if (err.status === 401) {
                toast.error("Unauthorized. Please log in again.");
            } else {
                toast.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // if (loadingSearch) {
    //     return <Loading message="Loading page..."></Loading>
    // }

    return (
      <>
        <Header isAuthenticated={isAuthenticated} user={user ? user.name : null} role={user ? user.role : null} />
        <div className="container" style={{ margin: '5vh auto auto', maxWidth: '100%' }}>
          <h1 className="text-center mt-5 pt-5">Student Attendance Dashboard</h1>

          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} closeOnClick pauseOnHover draggable theme="colored" />
          
            {!isAuthenticated ? <div></div> : (
            <div>
              {user && user.role === "Visitor" ? <StudentChoice /> : 
              (
                <Sidebar>
                <div>
                  {/* Filters & Buttons */}
                  <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-3 mt-3 gap-2">
                    <div className="flex-grow-1">
                      <DatePicker
                        selectedDate={new Date(attendanceDate)}
                        onDateChange={(date) => { setAttendanceDate(date.toISOString().split('T')[0]); setPage(1); setLoading(true); }}
                        showCalendars="ethiopian"
                        viewFirst="Ethiopian"
                        className="form-control w-100 mb-2"
                      />
                    </div>

                    <div className="flex-grow-1">
                      <select
                        value={section}
                        size={1} // make it a dropdown on mobile
                        onChange={(e) => { setSection(e.target.value); setPage(1); setLoading(true); }}
                        className="form-control w-100 mb-2"
                      >
                        <option value="">All Sections (ሁሉም)</option>
                        {sections.map((sec, index) => (
                          <option key={index} value={sec}>{sec}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-grow-1">
                      <select
                        value={attendanceTypeFilter}
                        size={1} // make it a dropdown on mobile
                        onChange={(e) => { setAttendanceTypeFilter(e.target.value); setPage(1); setLoading(true); }}
                        className="form-control w-100 mb-2"
                      >
                        <option value="">All Types (ሁሉም)</option>
                        {attendanceTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      {isAuthenticated && user.role !== "Visitor" && (
                        <div className="d-flex flex-row flex-wrap gap-2 justify-content-end">
                          <button className="btn btn-success mb-2" onClick={() => { setShow(true); }}>Create Attendance</button>
                          { user && user.role === "Admin" && (
                            <>
                              <button className="btn btn-primary mb-2" onClick={() => { lockAttendance(); setLoading(true); }}>Lock Attendance</button>
                              <button className="btn btn-warning mb-2" onClick={() => { setShowAll(true); }}>Create Attendance For All</button>
                            </>
                            )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attendance Table */}
                  <div className="position-relative">
                    {loading && (
                      <div className="loading-overlay">
                        <div className="spinner-border text-light"></div>
                      </div>
                    )}

                    {attendances.length === 0 ? (
                      <p className="d-flex flex-column mt-5 pt-5 justify-content-center align-items-center">No attendance records found.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-striped table-hover">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Name</th>
                              <th>Section</th>
                              <th>Day</th>
                              <th>Type</th>
                              <th>Status</th>
                              {isAuthenticated && <th>Change</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {attendances.map((attendance, index) => (
                              <tr key={attendance._id || attendance.id}>
                                <td>{index + 1}</td>
                                <td>{attendance.student.name || "Unknown"}</td>
                                <td>{attendance.student.section || "Unknown"}</td>
                                <td>{new Date(attendance.day).toLocaleDateString("am-ET-u-ca-ethiopic", {
                                                                                      weekday: "long",
                                                                                      day: "numeric",
                                                                                      month: "long",
                                                                                      year: "numeric"
                                                                                    }) || "Unknown"}</td>
                                <td>{attendance.type}</td>
                                <td>{attendance.status || "Not Set"}</td>
                                {isAuthenticated && !attendance.locked && (
                                  <td className="d-flex flex-wrap gap-1">
                                    <button className="btn btn-success btn-sm" onClick={() => { setLoading(true); handleStatusChange(attendance._id, "Present"); }}>✓</button>
                                    <button className="btn btn-danger btn-sm" onClick={() => { setLoading(true); handleStatusChange(attendance._id, "Absent"); }}>A</button>
                                    <button className="btn btn-warning btn-sm" onClick={() => { setLoading(true); handleStatusChange(attendance._id, "Late-30mins"); }}>L</button>
                                    <button className="btn btn-primary btn-sm" onClick={() => { setLoading(true); handleStatusChange(attendance._id, "Permission"); }}>P</button>
                                  </td>
                                )}
                                {attendance.locked && <td>Locked</td>}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="d-flex justify-content-center mt-3 gap-2">
                          <button
                            className="btn btn-outline-primary"
                            disabled={page === 1}
                            onClick={() => {setPage(page - 1); setLoading(true);}}
                            style={{
                              backgroundColor: page === 1 ? "gray" : "",
                              color: page === 1 ? "white" : ""
                            }}
                          >
                            Previous
                          </button>

                          <span className="align-self-center">
                            Page {page} of {totalPages}
                          </span>

                          <button
                            className="btn btn-outline-primary"
                            disabled={page === totalPages}
                            onClick={() => {setPage(page + 1); setLoading(true);}}
                            style={{
                              backgroundColor: page === totalPages ? "gray" : "",
                              color: page === totalPages ? "white" : ""
                            }}
                          >
                            Next
                          </button>

                        </div>
                      </div>
                    )}

                    {/* Create Attendance Modal */}
                    {show && (
                      <>
                        <div className="modal-backdrop fade show"></div>
                        <div className="modal fade show d-block" tabIndex="-1">
                          <div className="modal-dialog modal-dialog-centered modal-sm">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">Choose Type</h5>
                                <button className="btn-close" onClick={() => setShow(false)}></button>
                              </div>
                              <div className="modal-body">
                                <select
                                  value={attendanceType}
                                  onChange={(e) => setAttendanceType(e.target.value)}
                                  className="form-control"
                                >
                                  {attendanceTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                  ))}
                                </select>
                                <select
                                  value={createSection}
                                  onChange={(e) => setCreateSection(e.target.value)}
                                  className="form-control"
                                >
                                  {sections.map((section, index) => (
                                    <option key={index} value={section}>{section}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="modal-footer">
                                <button className="btn btn-danger" onClick={() => setShow(false)}>Cancel</button>
                                <button className="btn btn-secondary" onClick={() => { setShow(false); createAttendance(); setLoading(true); }}>Continue</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Create Attendance For All Modal */}
                    {showAll && (
                      <>
                        <div className="modal-backdrop fade show"></div>
                        <div className="modal fade show d-block" tabIndex="-1">
                          <div className="modal-dialog modal-dialog-centered modal-sm">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">Choose Type</h5>
                                <button className="btn-close" onClick={() => setShowAll(false)}></button>
                              </div>
                              <div className="modal-body">
                                <select
                                  value={attendanceType}
                                  onChange={(e) => setAttendanceType(e.target.value)}
                                  className="form-control"
                                >
                                  {attendanceTypes.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="modal-footer">
                                <button className="btn btn-danger" onClick={() => setShowAll(false)}>Cancel</button>
                                <button className="btn btn-secondary" onClick={() => { setShowAll(false); createAttendanceAll(); setLoading(true); }}>Continue</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                  </div>
                </div>
                </Sidebar>
              )}
            </div>
          )}
          
          
        </div>
      </>
        
    );
};

export default Home;