import React from 'react';
import {StyleSheet, Dimensions, SafeAreaView, View, FlatList, Animated, ActivityIndicator} from 'react-native';
import firebase from '../../../../../functions/firebase/firebaseConfig';
import CardOne from "./CardOne";
import axios from "axios";

const {width, height} = Dimensions.get('window');
export default function SliderCards() {
    const [cards, setcards] = React.useState(null)
    const [refreshing, setrefreshing] = React.useState(true)

    async function getInfo() {
        setrefreshing(true);
        let response = await axios.get("actions/cards");
        setcards(response.data)
        setrefreshing(false)
        renderBodyContent();
    }

    React.useEffect(() => {
        getInfo();
        setInterval(() => {
            getInfo()
        }, 15085045)
    }, []);

    function onHandleRefresh() {
        setrefreshing(true);
        getInfo();
    }

    const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
    const y = new Animated.Value(0);
    const onScroll = Animated.event([{nativeEvent: {contentOffset: {y}}}], {
        useNativeDriver: true,
    });

    function renderCardOne({item, index}) {
        return (
            <CardOne {...{index, y, item}} />
        )
    }

    function ComponentSep() {
        return <View/>
    }

    function renderCards() {
        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: "#fff",
                    justifyContent: 'center',
                }}>
                {!cards || cards == null ? getInfo() : (
                    <AnimatedFlatlist
                        vertical={true}
                        scrollEventThrottle={20}
                        windowSize={width}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        loop={true}
                        refreshing={refreshing}
                        onRefresh={onHandleRefresh}
                        data={cards}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderCardOne}
                        disableVirtualization
                        ItemSeperatorComponent={ComponentSep}
                        {...{onScroll}}
                        useNativeDriver={true}
                    />
                )}
            </View>
        );

    }

    function renderBodyContent() {
        return (
            <View>
                {refreshing ? (
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center"
                    }}>
                        <ActivityIndicator color="#7c9d32" animating={true} size="large"/>
                    </View>
                ) : (
                    <View style={styles.container}>
                        <SafeAreaView
                            style={{
                                flex: 1,
                                paddingTop: height / 55,
                            }}>
                            {renderCards()}
                        </SafeAreaView>
                    </View>
                )}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {renderBodyContent()}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: 201,
        backgroundColor: "#fff"
    },
});
