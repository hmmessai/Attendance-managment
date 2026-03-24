import axios from "axios";

const BaseUrl = process.env.REACT_APP_API_URI;

const endPoint = {
    LOGIN: `${BaseUrl}/auth/login`,
    SIGNUP: `${BaseUrl}/auth/register`,
    ME: `${BaseUrl}/auth/currentUser`,
    STUDENTS: `${BaseUrl}/student/all`,
    GETSTUDENT: `${BaseUrl}/student/get`,
    NEWSTUDENT: `${BaseUrl}/student/create`,
    POSTATTENDANCE: `${BaseUrl}/attendance/post-bulk`,
    CREATEDAILYFORALL: `${BaseUrl}/attendance/daily-all`,
    FULLATTENDANCE: `${BaseUrl}/attendance/get-full`,
    FULLATTENDANCEBYDATE: `${BaseUrl}/attendance/get-full-by-date`,
    DAILYATTENDANCE: `${BaseUrl}/attendance/get-daily`,
    YEARLYATTENDANCE: `${BaseUrl}/attendance/create-yearly`,
    YEARLYATTENDANCEALL: `${BaseUrl}/attendance/create-yearly-all`,
    UPDATEATTENDANCE: `${BaseUrl}/attendance/update-status`,
    LOCKATTENDANCE: `${BaseUrl}/attendance/lock`,
}

const axiosInstance = axios.create({
    baseURL: BaseUrl,
});

export { endPoint, axiosInstance };