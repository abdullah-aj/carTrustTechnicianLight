// @flow
import * as React from 'react';
import {
    AppRegistry,
    StyleSheet,
    View,
    TextInput, TouchableOpacity, Modal, Image, ScrollView
} from 'react-native';
import Theme from '../../App.style';
import Text from "../Text";
import Icon from "../Icons";
import {Loader} from "../Loader";

type Props = {
    selectedDefectTypesList: [],
    handleSelect:()=>void;
};
export const Tags = (props: Props) => {
    const [toggleSelected, setToggleSelected] = React.useState(false);
  //  console.log("inside TAGSSS value from propssss:::>>>>", props.selectedDefectTypesList);
    const handleOnPress = (id, label)=>{
      //  console.log("handleOnPress inside Render Multiselect::::>>>", id, label);
       props.handleSelect(id);
    }
    return (
          props.selectedDefectTypesList? props.selectedDefectTypesList.map((val, index)=>{
                return (
                    <TouchableOpacity style={styles.container} onPress={handleOnPress.bind(this, val.id, val.label)}>
                        <Icon name={"close"} width={16} height={16} fill={Theme.secondary_color_2}/>
                        <Text weight={"regular"} size={1.2} color={Theme.base_color_1} style={{paddingLeft:10}}>{val.label}</Text>
                    </TouchableOpacity>
                )
            })
              :
              <Text weight={"regular"} size={2}>Please Select...</Text>
    );
};

const styles = StyleSheet.create({
   container:{
       flexDirection:'row',
       alignItems:'center',
       borderRadius:50,
       borderWidth:1.5,
       borderColor:Theme.primary_color_1,
       backgroundColor:'#736EFA20',
       paddingLeft:12,
       paddingRight:12,
       paddingTop:6,
       paddingBottom:6,
       marginTop:10,
       marginRight:8

   }


    })
