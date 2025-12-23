/* eslint-disable prettier/prettier */
import { Navigate, Outlet } from "react-router-dom";


export default function LoginCallback({allowedRole}){


    if(localStorage.getItem('token')){
        return <Navigate to='/' replace={true}></Navigate>
    }
    return(<Outlet></Outlet>)
}