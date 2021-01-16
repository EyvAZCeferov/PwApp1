import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {enableScreens} from 'react-native-screens';
import {getLang, t} from './src/functions/lang';
import {AntDesign} from "@expo/vector-icons";
import AsyncStorage from '@react-native-community/async-storage';
import * as Network from 'expo-network';
import {Provider} from 'react-redux';
import store from './src/functions/store';
import {Alert,View} from 'react-native';
import {Root} from 'native-base';

enableScreens();

// screens
import AppSlider from './src/screens/appintro/appslider';
import Splash from './src/screens/Splash/Splash';
import LoginScreen from './src/screens/auth/global/loginscreen';
import Register from './src/screens/auth/global/register';
import ForgotPassword from './src/screens/auth/global/forgetpass';


const AuthStack = createStackNavigator();
const AuthStackScreen = (props) => (
    <AuthStack.Navigator 
    headerMode="none" 
    screenOptions={{ 
    animationEnabled:true,
    animationTypeForReplace:"pop"
    }} >
        <AuthStack.Screen
            name="Login"
            {...props}
            component={LoginScreen}
        />
        <AuthStack.Screen
            name="ForgotPass"
            component={ForgotPassword}
            {...props}
        />
        <AuthStack.Screen
            name="Register"
            component={Register}
            {...props}
        />
    </AuthStack.Navigator>
);


export default function(props) {
    const [firstOpenSlider, setfirstOpenSlider] = React.useState(null);

    async function getNetStat() {
        let status = await Network.getNetworkStateAsync();
        if (!status.isConnected || !status.isInternetReachable || !status.type) {
            Alert.alert(
                'İnternet Xətası',
                "İnternetə qoşulub təkrar yoxlayın",
                [
                    {
                        text: t('cancel'),
                        style: 'cancel',
                    },
                ],
                {cancelable: true}
            );
        }
    }

    function changeStat() {
        AsyncStorage.setItem('firstslider', 'Ok');
        AsyncStorage.getItem('firstslider').then((a) => {
            setfirstOpenSlider(a);
        });
    }

    function getfirstOpen() {
        AsyncStorage.getItem('firstslider').then((a) => {
            setfirstOpenSlider(a);
        });
    }

    function getFirstOpened(props) {
        return firstOpenSlider == null ? 
        (<AppSlider callfunc={() => changeStat()} {...props} />) : 
        (<NavigateAuth {...props} />);
    }

    function NavigateAuth(props) {
        return (<AuthStackScreen {...props} />)
    }

    React.useEffect(() => {
        getNetStat();
        getLang();
        getfirstOpen();
        getFirstOpened();
    }, []);

    function SystemOpen(props) {
        const [isready, setisReady] = React.useState(false);
        React.useEffect(() => {
            setTimeout(() => {
                setisReady(true);
            }, 1000);
        }, []);
        return isready ? (<NavigateAuth {...props} />) : (<Splash/>);
    }

    return (
        <Root>
            <NavigationContainer>
                <SystemOpen {...props}/>
            </NavigationContainer>
        </Root>
    );
}

