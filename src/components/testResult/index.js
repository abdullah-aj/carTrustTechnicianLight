import React from 'react';
import style from './style'
import {View, ScrollView} from 'react-native';
import Text from '../Text';
import IconAndTitle from "./IconAndTitle";
import {AppHeader} from "../AppHeader";
import Theme from "../../App.style";
import PageBGArtwork from "../PageBGArtwork";
import Button from "../Button";


type Props = {
    title: string,
    leftHalfContent: {},
    rightHalfContent: {},
    actions: [{ label: "", action: ()=>void }]
}


const TestResult = (props:Props) => {
    const {title, icon, leftHalfContainer, rightHalfContainer, buttons} = props.route.params;
    console.log("///data from PARAMSSSS::::::", title);

    const Profile = () => {};

    const goBack = () => {
      props.navigation.goBack();
    };


    return (
        <>
            <AppHeader type={2} headerText={"CPO TEST"} headerLogo={false} rightIcon={[{
                icon: 'Profile',
                action: Profile,
                fill: Theme.primary_color_2,
                bg: Theme.base_color_10,
            }, {icon: 'Search', action: Profile, fill: Theme.primary_color_2, bg: Theme.base_color_10}]}
                       leftIcon={{
                           icon: 'backBtn',
                           action: goBack,
                           fill: Theme.primary_color_2,
                           bg: Theme.base_color_10
                       }}/>

            <View style={style.mainCard}>
                <ScrollView>

                <View>
                    <PageBGArtwork type={'result'} style={{position:'absolute', marginTop:-5}}/>
                </View>
                <View style={{padding:50}}>
                    <IconAndTitle color={ icon === 'check' ? Theme.secondary_color_3 : Theme.secondary_color_2} icon={icon} title={title}/>
                </View>
                <View style={style.halvesContainer}>
                    {/*values from leftHalfContainer in params*/}
                    <View style={{flex:.50, paddingLeft:50, borderRightColor:Theme.primary_color_3, borderRightWidth:0.5}}>
                        <Text weight={"bold"} size={6} color={Theme.base_color_10} underline={false}>{leftHalfContainer.heading}</Text>
                        <View style={{marginTop:"5%"}}>
                            {
                                leftHalfContainer.dataList.map((val, index)=>{
                                    return(
                                        <Text weight={"light"} size={3} color={Theme.base_color_10} underline={false}>{val}</Text>
                                    )
                                })
                            }
                        </View>
                    </View>

                    {/*values from rightHalfContainer in params*/}
                    <View style={{flex:.50, paddingLeft:50}}>
                        <Text weight={"bold"} size={6} color={Theme.base_color_10} underline={false}>{rightHalfContainer.heading}</Text>
                        <View style={{marginTop:"5%"}}>
                            {
                                rightHalfContainer.dataList.map((val, index)=>{
                                    return(
                                        <Text weight={"light"} size={3} color={Theme.base_color_10} underline={false}>{val}</Text>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View>
                </ScrollView>
            </View>
            <View style={{flexDirection:"row", width:"90%", paddingTop:20, alignSelf:'center', justifyContent:"flex-end"}}>
                {buttons.map((val, index)=>{
                    return(
                        <Button label={val.label} action={val.action} disabled={val.disable} type={"primary"} style={{width:200, marginRight:20}}/>
                    )
                })}
            </View>

        </>
    );
};

export default TestResult;
