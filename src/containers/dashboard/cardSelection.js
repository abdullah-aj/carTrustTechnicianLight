// @flow
import * as React from 'react';
import {View} from 'react-native';
import Card from '../../components/Card';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Util from '../../util';
import Theme from '../../App.style';



type Props = {
    title: string,
    subTitle: string,
    buttonText: string,
    text:string,
    action(): void,
    btnTxtSize: string,
    cardsCount:number,
    marginBottom: number,
    marginTop: number,
    marginRight:number,
    marginLeft:number
};
const CardSelection = (props: Props) => {
    const deviceDimensions = Util.Functions.GetDeviceDimensions();
    const count = props.cardsCount ? props.cardsCount : 4
    return (
        <Card onPress={props.action} style={{
            width: (deviceDimensions.width - 100) / count,
            marginBottom: props.marginBottom ? props.marginBottom : 20,
            padding: 28,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 240,
            marginRight: props.marginRight ? props.marginRight : null,
            marginLeft: props.marginLeft ? props.marginLeft : null,
            marginTop: props.marginTop ? props.marginTop : null
        }}>
            <Text weight={'regular'} size={4} underline={true} style={{fontFamily:'Proxima-Nova-Alt-Bold', alignSelf:'flex-start'}} color={Theme.primary_color_2}>{props.title}</Text>
            <Text size={1.4} weight={'light'} style={{alignSelf:'flex-start', marginVertical: 10, fontFamily:'Proxima-Nova-Alt-Regular', color:Theme.base_color_4}}>{props.subTitle}</Text>
            <Text size={1.2} weight={'light'} style={{alignSelf:'flex-start', marginTop:0,marginBottom:10, fontFamily:'Proxima-Nova-Alt-Regular', color:Theme.base_color_4}}>{props.text}</Text>
            <Button label={props.buttonText} style={props.style? props.style :{width:'80%'}} action={props.action}/>
        </Card>
    );
};

export default CardSelection;
