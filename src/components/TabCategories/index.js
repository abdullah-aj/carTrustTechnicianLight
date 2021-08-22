// @flow
import React, {useEffect, useState} from 'react';
import {Switch, StyleSheet, View} from 'react-native'
import Theme from "../../App.style";
import TabCategoryItem from "./TabCategoryItem";


type Props = {
    data: array,
}


const TabCategories = (props: Props) => {
    const {style, value} = props
    const[selected, setSelected] = useState(0);
    const data = props.data;

    console.log("/////// tab categories data from props", data);
    const currentValue = ()=>{
        return (props.field ? props.field.value === 'true' : props.value)
    }

    const selectedItem = (index) => {
        console.log("////selected is", index);
        return setSelected(index);
    }

    {/*// <TabCategoryItem number={value.id} label={value.title} subLabel={"Category Sub Label"} selected={selectedItem.bind(this, index)} selectedItemIndex={index}/>*/}
    return (
       <View style={styles.container}>

           {
               props.data?  <TabCategoryItem data={data}/>:null

           }
       </View>
    )
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
        flexDirection: "row",
        width: "100%",
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center',
        padding:0

    }
})
export default TabCategories;
