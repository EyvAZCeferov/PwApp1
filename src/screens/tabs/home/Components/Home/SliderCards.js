import React from "react";
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  View,
  FlatList,
  Animated,
} from "react-native";
import CardOne from "./CardOne";

const { width, height } = Dimensions.get("window");
export default function SliderCards(props) {
  const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
  const y = new Animated.Value(0);
  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
    useNativeDriver: true,
  });

  function renderCardOne({ item, index }) {
    return (
      <CardOne
        {...{ index, y, item }}
        cardcount={props ? props.cards.length : 1}
        user={props ? props.user : null}
      />
    );
  }

  function ComponentSep() {
    return <View />;
  }

  function renderCards() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          backgroundColor: "#fff",
          justifyContent: "center",
        }}
      >
        <AnimatedFlatlist
          vertical={true}
          scrollEventThrottle={20}
          windowSize={width}
          bounces={false}
          showsVerticalScrollIndicator={false}
          loop={true}
          data={props.cards}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderCardOne}
          disableVirtualization
          refreshing={props.refreshing}
          onRefresh={() => props.call()}
          ItemSeperatorComponent={ComponentSep}
          {...{ onScroll }}
          useNativeDriver={true}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: height / 55,
        }}
      >
        {props.cards.length > 0 ? renderCards() : null}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 201,
    backgroundColor: "#fff",
  },
});
