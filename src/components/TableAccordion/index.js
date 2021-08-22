// @flow
import React, {useEffect, useState} from 'react';
import {
  Switch,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  // Alert,
  Linking,
} from 'react-native';
import Theme from '../../App.style';
import Text from '../Text';
import Icon from '../Icons';
import AP from '../../api';
import {Loader} from '../Loader';
import Message from '../Message';

type Props = {};

const TableAccordion = (props: Props) => {
  const [showRowMenu, setShowRowMenu] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [bookingList, setBookingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const data = props.data;

  useEffect(() => {
    const list = props.bookingData.map((obj) => {
      return {
        vehicleMake: obj.vehicle.make,
        vehicle: obj.vehicle.model,
        vehicleYear: obj.vehicle.year,
        vehiclePlate: obj.vehicle.plate_en,
        appointmentDate: obj.booking.appointment_date,
        appointmentTime:
          obj.booking.appointment_from.slice(0, -3) +
          ' - ' +
          obj.booking.appointment_to.slice(0, -3),
        inspectionType: obj.booking.booking_refrence
          ? obj.booking.booking_refrence.split('-')[0]
          : '-',
        inspectionResult:
          obj.result !== 'false' ? obj.result.toUpperCase() : 'Not Completed',
        bookingId: obj.booking.booking_id,
        hasRedo: obj.booking.has_redo,
      };
    });
    setSelectedIndex(null);
    setShowRowMenu(false);
    setBookingList(list);
  }, [props.bookingData]);

  const handleRowMenu = (select, result, hasRedo) => {
    if (selectedIndex === select) {
      setSelectedIndex(null);
      setShowRowMenu(false);
    } else {
      console.log(result);
      setSelectedIndex(select);
      setShowRowMenu(true);
    }
  };

  const handleRedo = async (bookingId, hasRedo) => {
    try {
      if (hasRedo) {
        Message.alert(
          'Message',
          'This Inspection has Already been re-done once.',
        );
        return;
      }
      setIsLoading(true);
      const res = await AP.Calls.Booking.redoBooking({booking_id: bookingId});
      setIsLoading(false);
      if (res.success) {
        Message.alert('Success', 'Inspection Redo Approved, Redo Now?', [
          {
            text: 'No',
            onPress: () => {
              props.refreshData();
            },
            type: 'no',
          },
          {
            text: 'Go to Inspection',
            onPress: () => {
              props.navigation.push('confirmation', {
                bookingId: res.data.new_booking.booking_id,
              });
            },
            type: 'yes',
          },
        ]);
      } else {
        Message.alert('Error', 'Inspection is not eligible for a Redo');
      }
    } catch (e) {
      setIsLoading(false);
      Message.alert('Error', 'Inspection is not eligible for a Redo');
      console.log('Error', e);
    }
  };

  const handleReport = async (bookingId) => {
    try {
      setIsLoading(true);
      const res = await AP.Calls.TestsCategories.finishTest({
        booking_id: bookingId,
      });
      setIsLoading(false);
      Linking.openURL(res.data.report_link);
    } catch (e) {
      console.log('Error', e);
    }
  };

  return (
    <>
      <Message />
      <Loader visible={isLoading} message={'Loading ...'} />
      <View style={style.container}>
        <View style={style.table}>
          <View style={[style.row, style.titleRow]}>
            <View style={[style.col, style.colAll]}>
              <Text
                weight={'bold'}
                size={3}
                color={Theme.base_color_10}
                style={{fontWeight: 'bold'}}>
                Car
              </Text>
            </View>
            <View style={[style.col, style.colAll]}>
              <Text
                weight={'bold'}
                size={3}
                color={Theme.base_color_10}
                style={{fontWeight: 'bold'}}>
                Date
              </Text>
            </View>
            <View style={[style.col, style.colAll]}>
              <Text
                weight={'bold'}
                size={3}
                color={Theme.base_color_10}
                style={{fontWeight: 'bold'}}>
                Time
              </Text>
            </View>
            <View style={[style.col, style.colAll]}>
              <Text
                weight={'bold'}
                size={3}
                color={Theme.base_color_10}
                style={{fontWeight: 'bold'}}>
                Type
              </Text>
            </View>
            <View style={[style.col, style.collEnd]}>
              <Text
                weight={'bold'}
                size={3}
                color={Theme.base_color_10}
                style={{fontWeight: 'bold'}}>
                Result
              </Text>
            </View>
          </View>

          {bookingList &&
            bookingList.map((val, index) => {
              return (
                <>
                  <TouchableOpacity
                    style={[
                      style.row,
                      index % 2 === 0 ? style.evenRow : style.oddRow,
                    ]}
                    onPress={handleRowMenu.bind(
                      this,
                      index,
                      val.inspectionResult,
                      val.hasRedo,
                    )}>
                    <View style={[style.col, style.colAll]}>
                      <Text
                        weight={'light'}
                        size={2}
                        color={Theme.base_color_10}>
                        {val.vehicleMake} {val.vehicle}
                      </Text>
                    </View>
                    <View style={[style.col, style.colAll]}>
                      <Text
                        weight={'light'}
                        size={2}
                        color={Theme.base_color_10}>
                        {val.appointmentDate}
                      </Text>
                    </View>
                    <View style={[style.col, style.colAll]}>
                      <Text
                        weight={'light'}
                        size={2}
                        color={Theme.base_color_10}>
                        {val.appointmentTime}
                      </Text>
                    </View>
                    <View style={[style.col, style.colAll]}>
                      <Text
                        weight={'light'}
                        size={2}
                        color={Theme.base_color_10}>
                        {val.inspectionType}
                      </Text>
                    </View>
                    <View style={[style.col, style.collEnd]}>
                      <Text
                        weight={'light'}
                        size={2}
                        color={Theme.base_color_10}>
                        {val.inspectionResult}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {showRowMenu && selectedIndex === index && (
                    <>
                      {val.inspectionResult && val.inspectionResult === 'FAIL' && (
                        <>
                          {val.inspectionType === 'CPO' ? (
                            <>
                              <View style={style.rowWhite}>
                                <View style={style.rowMenuView}>
                                  <TouchableOpacity
                                    style={[
                                      style.row,
                                      {
                                        backgroundColor:
                                          Theme.secondary_color_2,
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        width:
                                          Dimensions.get('window').width * 0.9,
                                      },
                                    ]}
                                    onPress={handleRedo.bind(
                                      this,
                                      val.bookingId,
                                      val.hasRedo ? true : false,
                                    )}>
                                    <Text
                                      weight={'regular'}
                                      size={2}
                                      color={Theme.base_color_10}>
                                      Redo Inspection
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </>
                          ) : (
                            <>
                              <View style={style.rowWhite}>
                                <View style={style.rowMenuView}>
                                  <TouchableOpacity
                                    style={[
                                      style.row,
                                      {
                                        backgroundColor:
                                          Theme.secondary_color_2,
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        alignItems: 'center',
                                        width:
                                          Dimensions.get('window').width * 0.9,
                                      },
                                    ]}
                                    onPress={() => {}}>
                                    <Text
                                      weight={'regular'}
                                      size={2}
                                      color={Theme.base_color_10}>
                                      PPI Inspection do not have option to Redo
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </>
                          )}
                        </>
                      )}

                      {val.inspectionResult && val.inspectionResult === 'PASS' && (
                        <>
                          <View style={style.rowWhite}>
                            <View style={style.rowMenuView}>
                              <TouchableOpacity
                                style={[
                                  style.row,
                                  {
                                    backgroundColor: Theme.secondary_color_3,
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center',
                                    width: Dimensions.get('window').width * 0.9,
                                  },
                                ]}
                                onPress={handleReport.bind(
                                  this,
                                  val.bookingId,
                                )}>
                                <Text
                                  weight={'regular'}
                                  size={2}
                                  color={Theme.base_color_10}>
                                  Inspection Report
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </>
                      )}

                      {val.inspectionResult &&
                        val.inspectionResult === 'Not Completed' && (
                          <>
                            <View style={style.rowWhite}>
                              <View style={style.rowMenuView}>
                                <TouchableOpacity
                                  style={[
                                    style.row,
                                    {
                                      backgroundColor: Theme.supporting_color_5,
                                      justifyContent: 'center',
                                      alignContent: 'center',
                                      alignItems: 'center',
                                      width:
                                        Dimensions.get('window').width * 0.9,
                                    },
                                  ]}
                                  onPress={() => {}}>
                                  <Text
                                    weight={'regular'}
                                    size={2}
                                    color={Theme.base_color_10}>
                                    No Action Available
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </>
                        )}
                    </>
                  )}
                </>
              );
            })}
        </View>
      </View>
    </>
  );
};

const evenRow = '';

const style = StyleSheet.create({
  container: {
    flex: 0.5,
    paddingBottom: 20,
    marginBottom: 40,
  },
  table: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  row: {
    height: 45,
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  rowWhite: {
    height: 45,
    width: 500,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: Theme.base_color_10,
    justifyContent: 'space-around',
  },
  rowMenuView: {
    justifyContent: 'space-around',
    alignSelf: 'center',
    height: 20,
    padding: 12,
    // borderRightWidth: 2,
    // borderRightColor: Theme.primary_color_3,
  },
  titleRow: {
    height: 50,
    backgroundColor: Theme.primary_color_1,
    borderTopLeftRadius: Theme.card_border_radius,
    borderTopRightRadius: Theme.card_border_radius,
  },
  evenRow: {
    backgroundColor: Theme.primary_color_2,
  },
  oddRow: {
    backgroundColor: '#3537a0',
  },
  lastRow: {
    borderBottomLeftRadius: Theme.card_border_radius,
  },
  totalRow: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    backgroundColor: Theme.primary_color_1,
    borderBottomLeftRadius: Theme.card_border_radius,
    borderBottomRightRadius: Theme.card_border_radius,
  },
  col: {
    alignSelf: 'stretch',
    // alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: 30,
  },
  colAll: {
    flex: 0.2,
    borderRightWidth: 1,
    borderRightColor: '#cccccc',
  },
  collEnd: {
    flex: 0.2,
  },

  button: {
    elevation: 0,
    borderWidth: 2,
  },
});

export default TableAccordion;
