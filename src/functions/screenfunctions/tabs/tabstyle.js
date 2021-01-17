import React, { Component } from 'react';
import { View,TouchableOpacity,StyleSheet } from 'react-native';
import Textpopins from '../text';
import {AntDesign} from "@expo/vector-icons";

export default function TabComponent({label}){
    return(
        <View>
            <View>
                <Textpopins>{label}</Textpopins>
            </View>
        </View>
    )
}

const styles=StyleSheet.create({});