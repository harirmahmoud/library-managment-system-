/* eslint-disable prettier/prettier */
import React, { createContext, useState, useContext, useEffect, useMemo } from "react";
import Axios from "../axios/axios";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details once when app starts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        if(!localStorage.getItem('token')){
          setLoading(false);
          return;
        }
        const res = await Axios.get("/auth/profile");
  
        setUser(res.data);
      
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); 
  const value = useMemo(() => ({ user, setUser, loading, error }), [user, loading, error]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
