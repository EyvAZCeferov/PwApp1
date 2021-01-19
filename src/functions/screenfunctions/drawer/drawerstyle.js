import React from 'react';
import {View, SafeAreaView,StyleSheet,Dimensions,Text,TouchableOpacity} from 'react-native';
import {Thumbnail} from 'native-base';
import Constants from 'expo-constants';
import {StatusBar} from "expo-status-bar";
import { AntDesign } from '@expo/vector-icons';
const icon=require('../../../../assets/icon-ios.png');
import {t} from '../../lang'
const {width,height}=Dimensions.get("window");

export default function DrawerStyle (props){
    
    return (
        <View>
            <StatusBar backgroundColor="#fff" style="dark" />
            <SafeAreaView style={styles.container}>
                <View style={styles.profileSection}>
                    <Thumbnail style={{ width:60,height:60 }} source={icon} />
                    <Text 
                        style={{ fontSize:16,color:"#7c9d32" }}>
                        Eyvaz Cəfərov
                    </Text>
                </View>
                <View style={styles.seperator} />
                <TouchableOpacity style={styles.oneElement} >
                    <AntDesign name="home" size={24} color="#7c9d32" />
                    <Text 
                        style={{ fontSize:14,color:"#7c9d32" }}>
                        {t('drawer.home')}
                    </Text>
                    <View />
                </TouchableOpacity>
                <View style={styles.seperator} />
                <TouchableOpacity style={styles.oneElement} >
                    <AntDesign name="logout" size={24} color="#7c9d32" />
                    <Text 
                        style={{ fontSize:14,color:"#7c9d32" }}>
                        {t('drawer.logout')}
                    </Text>
                    <View />
                </TouchableOpacity>
                <View style={styles.seperator} />
            </SafeAreaView>
        </View>
    );
}



const styles=StyleSheet.create({
    container:{
        width:"100%",
        height:height,
        marginTop:Constants.statusBarHeight,
        backgroundColor:"#fff",
        flexWrap:"wrap"
    },
    profileSection:{
        width:"100%",
        height:70,
        flexDirection:"row",
        alignContent:"center",
        alignItems:"center",
        justifyContent:"space-around",
        paddingHorizontal:15,
    },
    oneElement:{
        width:"100%",
        height:30,
        flexDirection:"row",
        alignContent:"center",
        alignItems:"center",
        justifyContent:"space-around",
        paddingVertical:5,
    },
    seperator:{
        width:"100%",
        marginVertical:5,
        borderColor:"#7c9d32",
        borderWidth:2,
    },
});