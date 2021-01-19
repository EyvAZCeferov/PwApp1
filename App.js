import * as React from "react";
import {NavigationContainer, useLinkProps} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
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
import DrawerStyle from './src/functions/screenfunctions/drawer/drawerstyle';
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
import Campaigns from './src/screens/tabs/campaign/Campaigns';
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
const TabsScreen=()=>(
    <Tabs.Navigator
        headerMode="none"
        initialRouteName="Home"
    >
    <Tabs.Screen name="Home" component={HomeStackScreen} options={{ 
        tabBarButton:(props)=><TabComponent labid="home" label={t('tabs.home')} {...props} />,
     }}   />
    <Tabs.Screen name="BarcodeStarter" component={BarcodeStarter} options={{ 
        tabBarButton:(props)=><TabComponent labid="barcode" label={t('tabs.barcode')} {...props} />,
     }}  />
    <Tabs.Screen name="BucketHome" component={BucketHome}  options={{ 
        tabBarButton:(props)=><TabComponent labid="bucket" label={t('tabs.bucket')} {...props} />,
     }} />
    <Tabs.Screen name="Campaigns" component={Campaigns} options={{ 
        tabBarButton:(props)=><TabComponent labid="campaigns" label={t('tabs.campaigns')} {...props} />,
     }} />
    </Tabs.Navigator>
);

const HomeStack=createDrawerNavigator();
const HomeStackScreen=()=>(
    <HomeStack.Navigator
        headerMode="none"
        initialRouteName="Home"
        drawerContent={(props)=><DrawerStyle {...props} />}
        >
        <HomeStack.Screen name="Home" component={Home} />
    </HomeStack.Navigator>
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

