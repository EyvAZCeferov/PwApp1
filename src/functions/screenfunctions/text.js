import React, { useState } from 'react';
import { Text,View,StyleSheet,Dimensions } from 'react-native'
import {Poppins_400Regular,useFonts} from "@expo-google-fonts/poppins";

const {width}=Dimensions.get("window");

export default function Textpopins (props) {

   const [fontloaded,setfontloaded]=useState(false);

    function getFont(){
        let [fontload] = useFonts({
            Poppins_400Regular,
        });

        console.log(fontload);
        
        if(fontload){
            setfontloaded(true);
        }
    }


    return (
        <View style={styles.textContainer}>
            {fontloaded ? 
                (
                    <Text style={[{
                        fontSize: props.size ? props.size : 18,
                        color: props.color ? props.color : "rgba(0,0,0,.8)",
                        textAlign: "center",
                        fontFamily: "Poppins_400Regular"
                    }, props.style ? props.style : null]}>
                        {props.children}
                    </Text>
                )
            :
                (
                    <Text style={[{
                        fontSize: props.size ? props.size : 18,
                        color: props.color ? props.color : "rgba(0,0,0,.8)",
                        textAlign: "center",
                    }, props.style ? props.style : null]}>
                        {props.children}
                    </Text>
                )
            }
        </View>
    );
   
}

const styles=StyleSheet.create({
    textContainer:{
        width:width,
    }
});