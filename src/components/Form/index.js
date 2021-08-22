// @flow
import * as React from 'react';
import {KeyboardAvoidingView, Platform} from "react-native";
import {Formik} from 'formik';


type Props = {
    initialValues: any,
    onSubmit: *,
    enableReinitialize: boolean,
    validateSchema: ()=>void,
};

export const Form = (props: Props, ref: any) => {
    return (
        <Formik initialValues={props.initialValues} enableReinitialize={props.enableReinitialize}
                onSubmit={props.onSubmit}
                validationSchema={props.validateSchema}>
            {props.children}
        </Formik>
    );
};
