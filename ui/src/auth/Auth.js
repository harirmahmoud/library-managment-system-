/* eslint-disable prettier/prettier */
import { Navigate, Outlet } from "react-router-dom";


export default function AuthCallback({allowedRole}){


    if(!localStorage.getItem('token')){
        return <Navigate to='/login' replace={true}></Navigate>
    }
    return(<Outlet></Outlet>)
}