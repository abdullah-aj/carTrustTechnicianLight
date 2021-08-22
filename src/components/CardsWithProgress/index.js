import React, {useState} from 'react'
import Card from "../../components/Card";
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Theme from "../../App.style";
import CardSelection from "../../containers/dashboard/cardSelection";
import Util from "../../util";
import Donut from "../DonutChart";
import Text from '../../components/Text';


type Props = {
    style?: *,
    onPress: ()=>void,
    data: Array
}

const handlePres = ()=>{

}

const CardsWithProgress = (props:Props) => {
    const {style: customStyle} = props
    const deviceDimensions = Util.Functions.GetDeviceDimensions();
    const [isData, setIsData] = useState(false);

    React.useEffect(() => {
        if(props.data){
            setIsData(true);
        }

    },[props.data]);

    return(
        isData && props.data.map((value, index)=>{
            return(
                    <Card onPress={handlePres}
                          style={{
                        width: (deviceDimensions.width - 100) / 4,
                        padding: 5,
                        margin:10
                    }}>

                        <View style={styles.topContainer}>
                            <Donut key={index} percentage={value.questionsCompleted} textColor={Theme.primary_color_2} color={Theme.secondary_color_2} delay={500 + 100 * index} max={value.totalQuestions}/>
                            <View>
                                <Text weight={"regular"} underline={true} color={Theme.primary_color_2} style={styles.headingText}>
                                    {value.carName}
                                </Text>
                                <Text style={styles.subText}>
                                    {value.vin}
                                </Text>
                            </View>

                        </View>


                        <View style={styles.bottomContainer}>
                            <Text style={styles.subTextSmall}>
                                {value.year}
                            </Text>
                            <Text style={styles.subTextSmall}>
                                {value.date}
                            </Text>
                        </View>
                    </Card>
        )
        })

    )
}

const styles = StyleSheet.create({
    cardsContainer : {
        width: 100,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headingText:{
        textTransform: 'uppercase',
        fontWeight:'900',
        fontSize:24,
        alignSelf:'flex-start'
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop:'10%',
        padding:10,
    },
    topContainer: {
        justifyContent:'space-between',
        flexDirection: 'row-reverse',
        padding:10,
        width:'100%',
        flexWrap: 'wrap'
    },
    subText :{
        color: Theme.base_color_4,
        fontSize:16,
        alignSelf:'flex-start',
        marginTop: 10
    },
    subTextSmall:{
        color: Theme.base_color_4,
        fontSize:14,
        alignSelf:'flex-start'
    },
    chart:{
        borderRadius:50,
        borderWidth: 3,
        borderColor: Theme.supporting_color_2,
        width:50,
        height:50,
        alignItems: 'center',
        justifyContent:'center'
    },
    chartText:{
        fontSize:16
    }

})

export default CardsWithProgress
