import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {enableScreens} from 'react-native-screens';
import {getLang, t} from './src/functions/lang';
import {AntDesign} from "@expo/vector-icons";
import AsyncStorage from '@react-native-community/async-storage';
import * as Network from 'expo-network';
import {Provider} from 'react-redux';
import store from './src/functions/store';
import {Alert,View} from 'react-native';
import {Root} from 'native-base';
import TabComponent from './src/functions/screenfunctions/tabs/tabstyle';
enableScreens();

// screens
import AppSlider from './src/screens/appintro/appslider';
import Splash from './src/screens/Splash/Splash';
import LoginScreen from './src/screens/auth/global/loginscreen';
import Register from './src/screens/auth/global/register';
import SetFinger from './src/screens/auth/verify/SetFinger';
import MobileVerify from './src/screens/auth/verify/mobileverify';
import ForgotPassword from './src/screens/auth/global/forgetpass';
import ProgramLock from './src/screens/auth/verify/programlock'

import Home from './src/screens/tabs/home/home'
import BarcodeStarter from './src/screens/tabs/barcode/barcodestarter';
import BucketHome from './src/screens/tabs/bucket/BucketHome';
import Profile from './src/screens/tabs/info/profile';

const AuthStack = createStackNavigator();
const AuthStackScreen = (props) => (
    <AuthStack.Navigator 
    headerMode="none" 
    screenOptions={{ 
    animationEnabled:true,
    animationTypeForReplace:"push"
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
        <AuthStack.Screen
            name="SetFinger"
            component={SetFinger}
            {...props}
        />
        <AuthStack.Screen
            name="MobileVerify"
            component={MobileVerify}
            {...props}
        />
    </AuthStack.Navigator>
);

const VerifyStack=createStackNavigator();
const VerifyStackScreen=(props)=>(
    <VerifyStack.Navigator 
        headerMode="none" 
        screenOptions={{ 
        animationEnabled:true,
        animationTypeForReplace:"pop"
        }} >
        <VerifyStack.Screen name="ProgramLock" component={ProgramLock} />
        <VerifyStack.Screen
            name="FP"
            component={ForgotPassword}
            {...props}
        />
    </VerifyStack.Navigator>
);

const Tabs=createBottomTabNavigator();
const TabsScreen=(props)=>(
    <Tabs.Navigator
        headerMode="none"
        initialRouteName="Home"
        activeColor="#7c9d32"
        inactiveColor="rgba(0,0,0,.5)"
        barStyle={{backgroundColor: '#fff',height:"100%", borderColor: '#fff', borderWidth: 0, borderRadius: 0}}
        screenOptions={({route}) => ({
            tabBarIcon: ({color = "#7c9d32"}) => {
                const icons = {
                    Home: 'home',
                    BarcodeStarter: 'plus',
                    // Campaign: 'paperclip',
                    BucketHome: 'shoppingcart',
                    Profile: 'profile',
                };
                return (
                    <AntDesign
                        name={icons[route.name]}
                        color={color}
                        size={25}
                    />
                )
            },
            tabBarColor: "#ffffff",
        })}
    >
    <Tabs.Screen name="Home" component={Home} options={{ 
        tabBarButton:(props)=><TabComponent label={t('tabs.home')} />
     }} />
    <Tabs.Screen name="BarcodeStarter" component={BarcodeStarter} />
    <Tabs.Screen name="BucketHome" component={BucketHome} />
    <Tabs.Screen name="Profile" component={Profile} />
    </Tabs.Navigator>
);


export default function(props) {
    const [firstOpenSlider, setfirstOpenSlider] = React.useState(null);
    const [userToken,setUserToken]=React.useState(null);

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

    function SwitchProgram(props){        
        return true ? (<TabsScreen {...props} />) : (<VerifyStackScreen {...props}  />);
    }

    function NavigateAuth(props) {
        return !userToken ? (<SwitchProgram {...props}/>) : (<AuthStackScreen {...props}/>);
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

