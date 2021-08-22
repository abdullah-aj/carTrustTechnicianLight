// @flow
import React from 'react';
import Util from '../../util';

import Bluetooth from '../../assets/icons/bluetooth.svg';
import Search from '../../assets/icons/loupe.svg';
import Profile from '../../assets/icons/user.svg';
import BackBtn from '../../assets/icons/left-arrow.svg';
import Menu from '../../assets/icons/menu.svg'
import Qr from '../../assets/icons/qr.svg'
import Delete from '../../assets/icons/delete.svg'
import Edit from '../../assets/icons/edit.svg'
import ImageTemplate from '../../assets/icons/ImageTemplate.svg'
import Mobile from '../../assets/icons/smartphone.svg'
import Camera from '../../assets/icons/camera.svg'
import Close from '../../assets/icons/close.svg'
import CloseBtn from '../../assets/icons/closeBtn.svg'
import CloseRed from '../../assets/icons/closeRed.svg'
import Tick from '../../assets/icons/tick.svg'
import Check from '../../assets/icons/check.svg'
import Minus from '../../assets/icons/minus.svg'
import Add from '../../assets/icons/addVehicle.svg'
import Language from '../../assets/icons/language.svg'
import Settings from '../../assets/icons/settings.svg'
import Support from '../../assets/icons/support.svg'
import Logout from '../../assets/icons/logout.svg'
import Loading from '../../assets/icons/loading.svg'
import Loading_done from '../../assets/icons/loading_done.svg'
import Notifications from '../../assets/icons/notification_none.svg'
import User_outline from '../../assets/icons/user_outline.svg'
import Telephone from '../../assets/icons/telephone.svg'
import Mail from '../../assets/icons/mail.svg'
import Mada from '../../assets/icons/mada.svg';
import Visa from '../../assets/icons/visa.svg';
import Master from '../../assets/icons/master.svg';
import Cash from '../../assets/icons/cash.svg';
import Skip from '../../assets/icons/skipArrow.svg';
import Update from '../../assets/icons/update.svg';
import Pause from '../../assets/icons/pause.svg';
import Play from '../../assets/icons/play.svg';
import NotePad from '../../assets/icons/notepad.svg';
import Note from '../../assets/icons/note.svg';
import Comment from '../../assets/icons/comment.svg';
import Tools from '../../assets/icons/tools.svg';
import EyeClose from '../../assets/icons/eyeClose.svg';
import EyeOpen from '../../assets/icons/eyeOpen.svg';
import Info from '../../assets/icons/info.svg';
import FlashOn from '../../assets/icons/flashOn.svg';
import FlashOff from '../../assets/icons/flashOff.svg';
import Open from '../../assets/icons/open.svg';
import MoreMenu from '../../assets/icons/moreMenu.svg';
import List from '../../assets/icons/list.svg';


import LottieView from 'lottie-react-native';
import {Line} from "react-native-svg";


type Props = {
    name: string,
    width: number,
    height: number,
    fill?: string,
    style?: Object
}


function Icon(props: Props) {
    const {width, height, fill, style, isYouth} = props;
    switch (props.name) {

        case 'loading':
            return <Loading {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'loading_done':
            return <Loading_done {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'Bluetooth':
            return <Bluetooth {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'Search':
            return <Search {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'list':
            return <List {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'Profile':
            return <Profile {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'notification_none':
            return <Notifications {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'backBtn':
            return <BackBtn {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'menu':
            return <Menu {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'moreMenu':
            return <MoreMenu {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'qr':
            return <Qr {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'delete':
            return <Delete {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'edit':
            return <Edit {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'image':
            return <ImageTemplate {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'mobile':
            return <Mobile {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'camera':
            return <Camera {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'close':
            return <Close {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'closeRed':
            return <CloseRed {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'CloseBtn':
            return <CloseBtn {...props} width={width} height={height} fill={fill} style={style}/>
        case 'tick':
            return <Tick {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'check':
            return <Check {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'checkGreen':
            return <Check {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'minus':
            return <Minus {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'add':
            return <Add {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'language':
            return <Language {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'settings':
            return <Settings {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'support':
            return <Support {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'logout':
            return <Logout {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'user_outline':
            return <User_outline {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'telephone':
            return <Telephone {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'mail':
            return <Mail {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'mada':
            return <Mada {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'visa':
            return <Visa {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'master':
            return <Master {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'cash':
            return <Cash {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'skip':
            return <Skip {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'update':
            return <Update {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'pause':
            return <Pause {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'play':
            return <Play {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'notepad':
            return <NotePad {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'note':
            return <Note {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'comment':
            return <Comment {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'tools':
            return <Tools {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'eyeOpen':
            return <EyeOpen {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'eyeClose':
            return <EyeClose {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'info':
            return <Info {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'flashOn':
            return <FlashOn {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'flashOff':
            return <FlashOff {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'open':
            return <Open {...props} width={width} height={height} fill={fill} style={style}/>;
        case 'vinScan':
            return (
                <LottieView source={require('../../assets/lottie/scanVin.json')} autoPlay
                            loop style={style} />);
        case 'pulse':
            return (
                <LottieView source={require('../../assets/lottie/pulse.json')} autoPlay
                            loop style={style} />);
        case 'otp':
            return (
                <LottieView source={require('../../assets/lottie/otp_message.json')} autoPlay
                            loop style={style} />);
        case 'btOff':
            return (
                <LottieView source={require('../../assets/lottie/bt_search.json')} autoPlay
                            loop style={style} />);
        case 'btOn':
            return (
                <LottieView source={require('../../assets/lottie/otp_message.json')} autoPlay
                            loop style={style} />);
        case 'plug':
            return (
                <LottieView source={require('../../assets/lottie/plug.json')} autoPlay
                            loop style={style} />);
        case 'loadingAnimation':
            return (
                <LottieView source={require('../../assets/lottie/loading.json')} autoPlay
                            loop style={style} />);
        case 'mileage':
            return (
                <LottieView source={require('../../assets/lottie/MILAEGE CHECK.json')} autoPlay
                            loop style={style} />);
        default:
            return null;
    }
}


export default Icon;
