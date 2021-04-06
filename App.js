import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { enableScreens } from "react-native-screens";
import { getLang, t } from "./src/functions/lang";
import AsyncStorage from "@react-native-community/async-storage";
import { Provider } from "react-redux";
import store from "./src/functions/store";
import { Root } from "native-base";
import TabComponent from "./src/functions/screenfunctions/tabs/tabstyle";
import DrawerStyle from "./src/functions/screenfunctions/drawer/drawerstyle";
import ShoppingList from "./src/screens/tabs/barcode/shoppingList";

enableScreens();
console.disableYellowBox = true;
import AppSlider from "./src/screens/appintro/appslider";
import Splash from "./src/screens/Splash/Splash";

import LoginScreen from "./src/screens/auth/global/loginscreen";
import Register from "./src/screens/auth/global/register";
import SetFinger from "./src/screens/auth/verify/SetFinger";
import MobileVerify from "./src/screens/auth/verify/mobileverify";
import ForgotPassword from "./src/screens/auth/global/forgetpass";
import ProgramLock from "./src/screens/auth/verify/programlock";
import SetPass from "./src/screens/auth/verify/SetPass";

import Home from "./src/screens/tabs/home/home";
import Notification from "./src/screens/tabs/home/notifications";
import NotificationOne from "./src/screens/tabs/home/notificationone";
import Cards from "./src/screens/tabs/info/cards";
import Bonuses from "./src/screens/tabs/info/bonuses";
import Pininfo from "./src/screens/tabs/info/pininfo";
import Account from "./src/screens/tabs/info/accounts";
import Map from "./src/screens/tabs/info/maps";
import History from "./src/screens/tabs/info/history";
import Contactus from "./src/screens/tabs/info/contactus";
import Settings from "./src/screens/tabs/info/settings";
import Termofuse from "./src/screens/tabs/info/termofuse";

import BarcodeStarted from "./src/screens/tabs/barcode/barcodestarter";
import SelectCard from "./src/screens/tabs/barcode/selectcard";
import Buy from "./src/screens/tabs/barcode/buy";
import PayThanks from "./src/screens/tabs/barcode/paythanks";

import BucketStarter from "./src/screens/tabs/bucket/bucketstarter";
import SelectCardBucket from "./src/screens/tabs/bucket/selectcard";
import BucketHome from "./src/screens/tabs/bucket/BucketHome";
import WishList from "./src/screens/tabs/bucket/wishlists";
import CartList from "./src/screens/tabs/bucket/cartlists";
import InCustomer from "./src/screens/tabs/bucket/MarketResearch";
import Campaigns from "./src/screens/tabs/campaign/Campaigns";
import Campaign from "./src/screens/tabs/campaign/campaign";
import Customer from "./src/screens/tabs/campaign/customer";
import ProductInfo from "./src/screens/tabs/bucket/productinfo";

import { ProgramLockContext } from "./src/functions/Hooks/Authentication/Lock/ProgramLockContext";
import i18n from "ex-react-native-i18n";
import * as Localization from "expo-localization";

const AuthStack = createStackNavigator();
const AuthStackScreen = (props) => (
  <AuthStack.Navigator
    headerMode="none"
    screenOptions={{
      animationEnabled: true,
      animationTypeForReplace: "push",
    }}
  >
    <AuthStack.Screen name="Login" {...props} component={LoginScreen} />
    <AuthStack.Screen name="ForgotPass" component={ForgotPassword} {...props} />
    <AuthStack.Screen name="Register" component={Register} {...props} />
    <AuthStack.Screen name="SetPass" component={SetPass} />
    <AuthStack.Screen name="SetFinger" component={SetFinger} {...props} />
    <AuthStack.Screen name="MobileVerify" component={MobileVerify} {...props} />
  </AuthStack.Navigator>
);

const VerifyStack = createStackNavigator();
const VerifyStackScreen = (props) => (
  <ProgramLockContext.Provider>
    <VerifyStack.Navigator
      headerMode="none"
      screenOptions={{
        animationEnabled: true,
        animationTypeForReplace: "pop",
      }}
    >
      <VerifyStack.Screen name="ProgramLock" component={ProgramLock} />
      <VerifyStack.Screen name="FP" component={ForgotPassword} {...props} />
    </VerifyStack.Navigator>
  </ProgramLockContext.Provider>
);

const Tabs = createBottomTabNavigator();
const TabsScreen = () => (
  <Tabs.Navigator headerMode="none" initialRouteName="Home">
    <Tabs.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarButton: (props) => (
          <TabComponent labid="home" label={t("tabs.home")} {...props} />
        ),
      }}
    />
    <Tabs.Screen
      name="BarcodeStarted"
      component={BarcodeStackScreen}
      options={{
        tabBarButton: (props) => (
          <TabComponent labid="barcode" label={t("tabs.barcode")} {...props} />
        ),
      }}
    />
    <Tabs.Screen
      name="Bucket"
      component={BucketStackScreen}
      options={{
        tabBarButton: (props) => (
          <TabComponent labid="bucket" label={t("tabs.bucket")} {...props} />
        ),
      }}
    />
    <Tabs.Screen
      name="Campaigns"
      component={CampaignsStackScreen}
      options={{
        tabBarButton: (props) => (
          <TabComponent
            labid="campaigns"
            label={t("tabs.campaigns")}
            {...props}
          />
        ),
      }}
    />
  </Tabs.Navigator>
);

const HomeStack = createStackNavigator();
const HomeStackScreen = ({ navigation, route }) => {
  if (route.state && route.state.index > 0) {
    navigation.setOptions({ tabBarVisible: false });
  } else {
    navigation.setOptions({ tabBarVisible: true });
  }
  return (
    <HomeStack.Navigator headerMode="none" initialRouteName="Home">
      <HomeStack.Screen name="Home" component={HomeDrawerStackScreen} />
      <HomeStack.Screen name="Notifications" component={Notification} />
      <HomeStack.Screen name="Notification" component={NotificationOne} />
      <HomeStack.Screen name="Pininfo" component={Pininfo} />
      <HomeStack.Screen name="Termofuse" component={Termofuse} />
      <HomeStack.Screen name="SetFinger" component={SetFinger} />
      <HomeStack.Screen name="SetPass" component={SetPass} />
    </HomeStack.Navigator>
  );
};

const HomeDrawerStack = createDrawerNavigator();
const HomeDrawerStackScreen = ({ navigation, route }) => {
  if (route.state && route.state.index > 0) {
    navigation.setOptions({ tabBarVisible: false });
  } else {
    navigation.setOptions({ tabBarVisible: true });
  }
  return (
    <HomeDrawerStack.Navigator
      headerMode="none"
      initialRouteName="Home"
      drawerContent={(props) => <DrawerStyle {...props} />}
    >
      <HomeDrawerStack.Screen name="Home" component={Home} />
      <HomeDrawerStack.Screen name="Cards" component={Cards} />
      <HomeDrawerStack.Screen name="Bonuses" component={Bonuses} />
      <HomeDrawerStack.Screen name="Account" component={Account} />
      <HomeDrawerStack.Screen name="Maps" component={Map} />
      <HomeDrawerStack.Screen name="History" component={History} />
      <HomeDrawerStack.Screen name="Contactus" component={Contactus} />
      <HomeDrawerStack.Screen name="Settings" component={Settings} />
    </HomeDrawerStack.Navigator>
  );
};

const CampaignsStack = createStackNavigator();
const CampaignsStackScreen = ({ navigation, route }) => {
  if (route.state && route.state.index > 0) {
    navigation.setOptions({ tabBarVisible: false });
  } else {
    navigation.setOptions({ tabBarVisible: true });
  }
  return (
    <CampaignsStack.Navigator headerMode="none" initialRouteName="Campaigns">
      <CampaignsStack.Screen name="Campaigns" component={Campaigns} />
      <CampaignsStack.Screen name="Campaign" component={Campaign} />
      <CampaignsStack.Screen name="Customer" component={Customer} />
    </CampaignsStack.Navigator>
  );
};

const BucketStack = createStackNavigator();
const BucketStackScreen = ({ navigation, route }) => {
  if (route.state && route.state.index > 0) {
    navigation.setOptions({ tabBarVisible: false });
  } else {
    navigation.setOptions({ tabBarVisible: true });
  }
  return (
    <Provider store={store}>
      <BucketStack.Navigator headerMode="none" initialRouteName="BucketStarter">
        <BarcodeStack.Screen name="BucketStarter" component={BucketStarter} />
        <BarcodeStack.Screen
          name="SelectCardBucket"
          component={SelectCardBucket}
        />
        <BucketStack.Screen name="BucketHome" component={BucketHome} />
        <BucketStack.Screen name="WishList" component={WishList} />
        <BucketStack.Screen name="CartList" component={CartList} />
        <BucketStack.Screen name="InCustomer" component={InCustomer} />
        <BucketStack.Screen name="ProductInfo" component={ProductInfo} />
        <BucketStack.Screen name="PayThanks" component={PayThanks} />
      </BucketStack.Navigator>
    </Provider>
  );
};

const BarcodeStack = createStackNavigator();
const BarcodeStackScreen = ({ navigation, route }) => {
  if (route.state && route.state.index > 0) {
    navigation.setOptions({ tabBarVisible: false });
  } else {
    navigation.setOptions({ tabBarVisible: true });
  }
  return (
    <BarcodeStack.Navigator headerMode="none" initialRouteName="BarcodeStarted">
      <BarcodeStack.Screen name="BarcodeStarted" component={BarcodeStarted} />
      <BarcodeStack.Screen name="SelectCard" component={SelectCard} />
      <BarcodeStack.Screen name="ShoppingList" component={ShoppingList} />
      <BarcodeStack.Screen name="Buy" component={Buy} />
      <BarcodeStack.Screen name="PayThanks" component={PayThanks} />
    </BarcodeStack.Navigator>
  );
};

export default function (props) {
  const [firstOpenSlider, setfirstOpenSlider] = React.useState(null);
  const [userToken, setUserToken] = React.useState(null);

  function changeStat() {
    AsyncStorage.setItem("firstslider", "Ok");
    AsyncStorage.getItem("firstslider").then((a) => {
      setfirstOpenSlider(a);
    });
  }

  function getfirstOpen() {
    AsyncStorage.getItem("firstslider").then((a) => {
      setfirstOpenSlider(a);
    });
  }

  function getFirstOpened(props) {
    return firstOpenSlider == null ? (
      <AppSlider callfunc={() => changeStat} {...props} />
    ) : (
      <NavigateAuth {...props} />
    );
  }

  function SwitchProgram(props) {
    const [program, setProgram] = React.useState(true);
    return program ? (
      <TabsScreen {...props} />
    ) : (
      <VerifyStackScreen {...props} />
    );
  }

  function NavigateAuth(props) {
    return !userToken ? (
      <SwitchProgram {...props} />
    ) : (
      <AuthStackScreen {...props} />
    );
  }

  React.useEffect(() => {
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
    return isready ? <NavigateAuth {...props} /> : <Splash />;
  }

  return (
    <Root>
      <NavigationContainer>
        <SystemOpen />
      </NavigationContainer>
    </Root>
  );
}
