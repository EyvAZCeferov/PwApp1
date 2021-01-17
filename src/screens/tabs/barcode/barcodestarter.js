import React, { Component } from 'react'
import {View} from 'react-native'
import Textpopins from '../../../functions/screenfunctions/text';


export default class BarcodeStarted extends Component {
    render() {
        return (
            <View style={{ flex:1,justifyContent:"center",alignItems:"center",alignContent:"center",textAlign:"center" }}>
                <Textpopins>BarcodeStarted</Textpopins>
            </View>
        )
    }
}
