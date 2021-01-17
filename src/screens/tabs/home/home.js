import React, { Component } from 'react'
import {View,Dimensions} from 'react-native'
import Textpopins from '../../../functions/screenfunctions/text';

const {width,height}=Dimensions.get("window");

export default class Home extends Component {
    render() {
        return (
            <View style={{ 
            width,
            height,
            backgroundColor:"red",
            justifyContent:"center",
            alignItems:"center",
            alignContent:"center",
            textAlign:"center" }}>
                <Textpopins>Home</Textpopins>
            </View>
        )
    }
}
