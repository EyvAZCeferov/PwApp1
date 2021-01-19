import React from 'react';
import {View, Dimensions, SafeAreaView, StyleSheet} from 'react-native';
import {
    Button,
    Thumbnail,
} from 'native-base';
import Constants from 'expo-constants';
const {width,height} = Dimensions.get('window');
import {AntDesign, Ionicons} from "@expo/vector-icons";
import RecentOperations from "./Components/Home/RecentOperations";
import SliderCards from './Components/Home/SliderCards';
import {StatusBar} from "expo-status-bar";

const icon = require('../../../../assets/adaptive-icon.png');

export default class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    UNSAFE_componentWillMount(){
        this.renderContent();
    }

    renderContent(){
        return(
            <View style={styles.contentArena}>
                <SliderCards {...this.props} />
                <RecentOperations {...this.props} />
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex:1, backgroundColor:"#fff" }}>
                <StatusBar style="dark" backgroundColor="#fff"/>
                <SafeAreaView style={{ flex:1, marginTop:Constants.statusBarHeight }}>
                    <View style={styles.header}>
                        <Button
                            transparent
                            onPress={()=>this.props.navigation.toggleDrawer()}
                            >
                            <AntDesign name="menufold" size={24} color="#7c9d32"/>
                        </Button>
                        <Thumbnail source={icon} style={styles.icon}/>
                        <Button
                            transparent
                            onPress={() => this.props.navigation.navigate('Notification')}>
                            <Ionicons name="ios-notifications" size={24} color="#7c9d32"/>
                        </Button>
                    </View>
                        {this.renderContent()}
                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        flexDirection:"row",
        justifyContent: 'space-between',
        paddingHorizontal:5,
        width: width,
        paddingBottom:2,
        borderBottomColor:"#7c9d32",
        borderBottomWidth:2,
    },
    icon: {
        width: 45,
        height: 45,
    },
    contentArena: {
       width:width,
    //    backgroundColor:"red",
    },
});
