import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function RoleMiddleWare({allowedRole}){ 
    const {user} = useUser();
    const [currentUser,setCurrentUser]=React.useState(null);

    React.useEffect(()=>{
        setCurrentUser(user);
    },[user]);
    console.log(currentUser)
    console.log(currentUser?.user.roles[0].name);
    console.log((currentUser?.user.roles[0].name === allowedRole[0]));
  return (currentUser && (currentUser?.user.roles.some(r=>allowedRole.includes(r.name)))
      ? <Outlet />
      : <></>
  )
}

export default RoleMiddleWare
