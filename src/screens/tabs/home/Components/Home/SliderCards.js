import * as React from 'react';
import {StyleSheet, Dimensions, SafeAreaView, View, FlatList, Animated, ActivityIndicator} from 'react-native';
import firebase from '../../../../../functions/firebase/firebaseConfig';
import CardOne from "./CardOne";

const {width, height} = Dimensions.get('window');
export default function SliderCards({props}) {
    const [cards, setcards] = React.useState(null)
    const [refreshing, setrefreshing] = React.useState(true)

    function getInfo() {
        var datas=[];
        firebase.database()
                .ref('users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/cards')
                .on('value', (data) => {
                    data.forEach((data) => {
                        datas.push(data.val());
                    });
                });
        setcards(datas)
        setrefreshing(false)
        renderBody();
    }

    React.useEffect(() => {
        getInfo();
        setInterval(() => {
            getInfo()
        }, 13000)
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
                    backgroundColor:"#fff",
                    justifyContent: 'center',
                }}>
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
                />
            </View>
        );

    }

    function renderBody() {
        return (
            <View>
                {refreshing ? (
                    <View style={{
                        width: width,
                        height: "100%",
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
                                // paddingTop: height / 55,
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
            {renderBody()}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        width: width,
        height: 201,
    },
});
