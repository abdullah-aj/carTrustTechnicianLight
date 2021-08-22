// @flow
import * as React from 'react';
import {View, TouchableOpacity} from 'react-native';
import TwoHalves from '../../../components/Layout/TwoHalves';
import {AppHeader} from '../../../components/AppHeader';
import Theme from '../../../App.style';
import style from './style';

import Text from '../../../components/Text';
import Icon from '../../../components/Icons';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import {Picker} from '@react-native-picker/picker';
import AP from '../../../api';

//

type Props = {
  navigation: {
    goBack: function,
    push: any,
  },
};

type State = {
  selectedManufacturer: string,
  selectedModel: string,
  selectedYear: string,
  manufacturerList: Array<any>,
  modelList: Array<any>,
  yearList: Array<any>,
  buttonDisable: boolean,
};

const UNSELECTABLE = 'unselectable';

class PriceCalculator extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      manufacturerList: [],
      selectedManufacturer: UNSELECTABLE,
      modelList: [],
      selectedModel: UNSELECTABLE,
      yearList: [],
      selectedYear: UNSELECTABLE,
      buttonDisable: true,
    };
  }

  componentDidMount: function = async () => {
    try {
      const manufacturer: any = await AP.Calls.Quotation.getManufacturers({});
      const years: any = await AP.Calls.Quotation.getYears();
      this.setState({
        manufacturerList: manufacturer,
        yearList: years,
      });
    } catch (e) {
      console.log('Error :>> ', e);
    }
  };

  handleProfileClick: function = () => {
    console.log('Clicked Profile Button');
  };

  handleGoBack: function = () => {
    this.props.navigation.goBack();
  };

  handleSearchClick: function = () => {
    console.log('Clicked Search Button');
  };

  handleGetQuote: function = () => {
    if (this.state.selectedManufacturer === UNSELECTABLE) {
      alert(`You have not selected any vehicle manufacturer`);
    } else if (this.state.selectedModel === UNSELECTABLE) {
      alert(`You have not selected any vehicle model`);
    } else if (this.state.selectedYear === UNSELECTABLE) {
      alert(`You have not selected any vehicle manufacturing year`);
    } else {
      this.props.navigation.push('priceList', {
        manufacturerId: this.state.selectedManufacturer,
        modelId: this.state.selectedModel,
        yearId: this.state.selectedYear,
      });
    }
  };

  handleManufacturerSelect: function = async (itemValue, itemIndex) => {
    if (itemValue !== UNSELECTABLE) {
      try {
        const res: any = await AP.Calls.Quotation.getModels({
          manufacturerId: itemValue,
        });
        this.setState({
          selectedManufacturer: itemValue,
          modelList: res,
          buttonDisable: true,
          selectedModel: UNSELECTABLE,
          selectedYear: UNSELECTABLE,
        });
      } catch (e) {
        console.log('Error :>> ', e);
      }
    } else {
      this.setState({
        selectedManufacturer: itemValue,
        modelList: [],
        selectedModel: itemValue,
        selectedYear: itemValue,
        buttonDisable: true,
      });
    }
  };

  handleModelSelect: function = async (itemValue, itemIndex) => {
    if (itemValue !== UNSELECTABLE) {
      try {
        this.setState({
          selectedModel: itemValue,
          selectedYear: UNSELECTABLE,
          buttonDisable: true,
        });
      } catch (e) {
        console.log('Error :>> ', e);
      }
    } else {
      this.setState({
        selectedModel: itemValue,
        selectedYear: itemValue,
        buttonDisable: true,
      });
    }
  };

  handleYearSelect: function = async (itemValue, itemIndex) => {
    if (itemValue !== UNSELECTABLE) {
      this.setState({
        selectedYear: itemValue,
        buttonDisable: false,
      });
    } else {
      this.setState({
        buttonDisable: true,
      });
    }
  };

  render(): React.Node {
    return (
      <>
        <TwoHalves
          artType={'calculator'}
          title={'Get Estimation'}
          sectionHead={
            <AppHeader
              type={2}
              headerLogo={false}
              headerImg={false}
              headerImgPath={''}
              headerText={'Price Calculator'}
              rightIcon={[
                {
                  icon: 'Profile',
                  action: this.handleProfileClick,
                  fill: Theme.primary_color_2,
                  bg: Theme.base_color_10,
                },
                {
                  icon: 'Search',
                  action: this.handleSearchClick,
                  fill: Theme.primary_color_2,
                  bg: Theme.base_color_10,
                },
              ]}
              leftIcon={{
                icon: 'backBtn',
                action: this.handleGoBack,
                fill: Theme.primary_color_2,
                bg: Theme.base_color_10,
              }}
            />
          }
          sectionBody={
            <Card style={style.cardContainer}>
              <View style={style.formContainer}>
                <View
                  style={[
                    style.itemContainer,
                    {
                      marginTop: 30,
                    },
                  ]}>
                  <View style={style.selectContainer}>
                    <Picker
                      selectedValue={this.state.selectedManufacturer}
                      style={style.select}
                      prompt="Vehicle Make"
                      onValueChange={(itemValue, itemIndex) =>
                        this.handleManufacturerSelect(itemValue, itemIndex)
                      }>
                      <Picker.Item
                        label={'Please Select'}
                        value={UNSELECTABLE}
                      />
                      {this.state.manufacturerList.map((item, i) => (
                        <Picker.Item
                          key={'manufacturer_' + i}
                          label={item.name}
                          value={item.id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={style.itemContainer}>
                  <View style={style.selectContainer}>
                    <Picker
                      selectedValue={this.state.selectedModel}
                      style={style.select}
                      prompt="Vehicle Model"
                      onValueChange={(itemValue, itemIndex) =>
                        this.handleModelSelect(itemValue, itemIndex)
                      }>
                      <Picker.Item
                        label={'Please Select'}
                        value={UNSELECTABLE}
                      />
                      {this.state.modelList.map((item, i) => (
                        <Picker.Item
                          key={'model_' + i}
                          label={item.name}
                          value={item.id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={style.itemContainer}>
                  <View style={style.selectContainer}>
                    <Picker
                      selectedValue={this.state.selectedYear}
                      style={style.select}
                      prompt="Vehicle Manufacturing Year"
                      onValueChange={(itemValue, itemIndex) =>
                        this.handleYearSelect(itemValue, itemIndex)
                      }>
                      <Picker.Item
                        label={'Please Select'}
                        value={UNSELECTABLE}
                      />
                      {this.state.yearList.map((item, i) => (
                        <Picker.Item
                          key={'year_' + i}
                          label={item.name}
                          value={item.id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                <View style={style.itemContainer}>
                  <Button
                    type={'secondary'}
                    label={'GET QUOTE'}
                    disabled={this.state.buttonDisable}
                    action={this.handleGetQuote.bind(this)}
                    style={style.button}
                  />
                </View>
              </View>
            </Card>
          }
        />
      </>
    );
  }
}

export default PriceCalculator;
