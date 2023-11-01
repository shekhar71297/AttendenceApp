import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const PrivateRoute = ({ children }) => {
    const navigate = useNavigate()
    const istrue = !!sessionStorage.getItem("isLogin") || false
    const isUserLogin = !!sessionStorage.getItem("admin") ||!!sessionStorage.getItem("trainer") || !!sessionStorage.getItem("counsellor") || false ;


    // console.log(istrue);
    useEffect(() => {
        if (!istrue && isUserLogin==false) {
            navigate('/');
        }
    
        if(!isUserLogin && istrue==false){
            navigate('/')
        }

    }, [isUserLogin,istrue, navigate]);

    return <>{children}</>;
    
};



export default PrivateRoute
