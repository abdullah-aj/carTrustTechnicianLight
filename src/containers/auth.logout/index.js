//@flow
import React, {useEffect, useState} from 'react';
import {Modal} from "react-native";
import Text from "../../components/Text";
import AP from "../../api";
import {SetLoginStatus} from "../../redux/actions/setLoginStatus";
import axios from "axios";
import {useDispatch} from "react-redux";
import {Loader} from "../../components/Loader";
import {SetToast} from "../../redux/actions/setToast";
type Props = {};
const Logout = (props:Props) => {
    const {navigation} = props;
    const dispatch = useDispatch()
    const[isLoading, setIsLoading]= useState(false)

    useEffect(() => {
        setIsLoading(true);
        console.log("//inside log out")
        logout();
    });

    const logout = async () => {
        try {
            const response = await AP.Calls.Authentication.logout({});
            response;
            if(response){
                setIsLoading(false);
                console.log("inside logout responseeeee");
                dispatch(SetLoginStatus(false));
            }
        }catch (e){
            console.log(e)
        }
    };

    return (
        <Loader visible={isLoading} message={"Logging out..."}/>
    );
};

export default Logout;
