import * as React from "react";
import { StyleSheet, Text, Dimensions, View, Animated } from "react-native";
import { Right, Left } from "native-base";
import { Col, Grid } from "react-native-easy-grid";
import { LinearGradient } from "expo-linear-gradient";
import customStyle from "../../../../../../assets/Theme";
import { t } from "../../../../../functions/lang";
import { hideNumb } from "../../../../../functions/standart/helper";
import Textpopins from "../../../../../functions/screenfunctions/text";
import axios from "axios";

const { width, height } = Dimensions.get("window");
export default function CardOne({ index, y, item, cardcount, user }) {
  const position = Animated.subtract(index * 200, y);
  const isDissappering = -180;
  const isTop = 0;
  const isBottom = height - 200;
  const isAppering = height;
  const translateY = Animated.add(
    y,
    y.interpolate({
      inputRange: [0, 0.000001 + index * 100],
      outputRange: [0, -index * 180],
      extrapolateRight: "clamp",
    })
  );

  const scale = position.interpolate({
    inputRange: [isDissappering, isTop, isBottom, isAppering],
    outputRange: [0.95, 0.9, 0.9, 0.95],
    extrapolate: "clamp",
  });

  const opacity = position.interpolate({
    inputRange: [isDissappering, isTop, isBottom, isAppering],
    outputRange: [0, 1, 1, 0],
  });

  const cardBgColors = [
    ["rgba(92,0,130,.80)", "rgba(175,0,69,.95)"],
    ["rgba(175,0,69,.95)", "rgba(92,0,130,.80)"],
    ["rgb(75,52,255)", "rgba(70,50,200,0.85)"],
    ["rgb(103,152,255)", "rgba(103,152,255,0.85)"],
    ["rgb(255,195,52)", "rgba(255,195,52,0.85)"],
    ["rgb(191,54,12)", "rgba(191,54,12,0.85)"],
    ["rgb(234,50,29)", "rgba(234,50,29,0.85)"],
    ["rgb(78,52,46)", "rgba(78,52,46,0.85)"],
    ["rgb(66,66,66)", "rgba(66,66,66,0.85)"],
    ["rgb(49,27,146)", "rgba(49,27,146,0.85)"],
    ["rgb(240,98,146)", "rgba(240,98,146,0.85)"],
    ["rgb(130,119,23)", "rgba(130,119,23,0.85)"],
    ["rgb(0,230,118)", "rgba(0,230,118,0.85)"],
    ["rgb(255,213,79)", "rgba(255,213,79,0.85)"],
    ["rgb(129,199,132)", "rgba(129,199,132,0.85)"],
    ["rgb(103,80,101)", "rgba(103,80,101,0.85)"],
    ["rgb(1,80,101)", "rgba(1,80,101,0.85)"],
    ["rgb(2,123,121)", "rgba(2,123,121,0.85)"],
  ];

  function bounces() {
    var elements = [];
    for (let i = 0; i < cardcount; i++) {
      const clear =
        index == i
          ? {
              width: 18,
              height: 8,
              borderRadius: 4,
              backgroundColor: cardBgColors[i][1],
            }
          : { backgroundColor: cardBgColors[i][0] };
      elements.push(<View key={i} style={[styles.cardCount, clear]} />);
    }
    return elements;
  }

  function cardCountBounces() {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 25,
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-around",
          backgroundColor: "transparent",
          alignItems: "center",
          alignContent: "center",
          zIndex: 4,
        }}
      >
        {bounces()}
      </View>
    );
  }

  function renderCards() {
    return (
      <Animated.View
        key={index}
        style={[
          styles.slide,
          { opacity, transform: [{ translateY }, { scale }] },
        ]}
      >
        <LinearGradient
          style={styles.cardBg}
          colors={cardBgColors[index]}
          start={[0.1, 0.1]}
          end={[0.9, 0.9]}
        >
          <View style={styles.rightSec}>
            <Left style={styles.left}>
              <View style={[styles.leftPattern, styles.bigPattern]} />
              <View
                style={[
                  styles.leftPattern,
                  styles.littlePattern,
                  { backgroundColor: cardBgColors[index][0] },
                ]}
              />
              <Text
                style={styles.priceText}
                children={item.price ? item.price + " ₼" : 0 + " ₼"}
              />
            </Left>
            <Right style={styles.right}>
              <Text style={styles.rightText} children={item.type} />
            </Right>
          </View>
          <View style={styles.centerCardNum}>
            <View>
              <Textpopins style={styles.cardNumbText}>
                {hideNumb(item.number)}
              </Textpopins>
            </View>
          </View>
          <View style={styles.cardInfos}>
            <View>
              <Grid>
                <Col style={customStyle.padding5}>
                  <Text
                    style={styles.gridInfoNameSurnameDynamic}
                    children={
                      item.type == "pin"
                        ? user
                          ? user.name
                          : t("loginregister.programlock.namesurname")
                        : t("loginregister.programlock.namesurname")
                    }
                  />
                  <Text
                    style={[
                      styles.gridInfoNameSurnameDynamic,
                      styles.gridInfoNameSurnameStatic,
                    ]}
                    children={t("loginregister.programlock.namesurname")}
                  />
                </Col>
                <Col style={styles.gridInfoMonthYear}>
                  <Text style={styles.monthYearText} children={item.expiry} />
                  <Text
                    style={[styles.monthYearText, styles.monthYearUnderText]}
                    children={t("home.slidercards.expiry")}
                  />
                </Col>
              </Grid>
            </View>
          </View>
        </LinearGradient>
        <View
          style={{
            height: "100%",
            borderColor: "#fff",
            width: 25,
            position: "absolute",
            top: 0,
            right: -10,
            backgroundColor: "#fff",
            borderBottomLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          {cardCountBounces()}
        </View>
      </Animated.View>
    );
  }

  return renderCards();
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 201,
    backgroundColor: "#fff",
  },
  slide: {
    width: width,
    height: 182,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  cardBg: {
    borderRadius: 20,
    height: 190,
    width: 360,
  },
  rightSec: {
    width: 360,
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "space-between",
    height: 80,
  },
  left: {
    position: "absolute",
    top: 0,
    left: 0,
    padding: 0,
    margin: 0,
    width: "35%",
    height: "80%",
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    borderTopLeftRadius: 19,
  },
  leftPattern: {
    width: "100%",
    backgroundColor: "transparent",
    borderBottomRightRadius: 70,
    borderTopLeftRadius: 19,
  },
  bigPattern: {
    width: "100%",
    height: "80%",
    backgroundColor: "#fff",
    zIndex: 2,
  },
  littlePattern: {
    position: "absolute",
    top: "10%",
    width: "80%",
    height: "50%",
    zIndex: 3,
  },
  priceText: {
    position: "absolute",
    top: "20%",
    width: "55%",
    height: "45%",
    zIndex: 4,
    fontSize: 19,
    lineHeight: 19,
    paddingBottom: 0,
    color: "#fff",
    fontWeight: "bold",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  cardCount: {
    width: 10,
    height: 5,
    borderRadius: 2,
    backgroundColor: "transparent",
    marginBottom: 3,
    zIndex: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  right: {
    position: "absolute",
    top: "18%",
    right: "10%",
    padding: 0,
    margin: 0,
    backgroundColor: "transparent",
  },
  rightText: {
    fontSize: 27,
    lineHeight: 27,
    color: "#fff",
    fontWeight: "bold",
    fontStyle: "italic",
    textTransform: "uppercase",
  },
  centerCardNum: {
    position: "absolute",
    top: "40%",
    left: "5%",
  },
  cardNumbText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 22,
    letterSpacing: 1.5,
  },
  cardNumbTextUnderText: {
    fontSize: 13,
    marginTop: 10,
    paddingLeft: 5,
    fontWeight: "normal",
  },
  cardInfos: {
    position: "absolute",
    top: "65%",
    left: "4%",
    width: 350,
  },
  gridInfoNameSurnameDynamic: {
    color: "#fff",
    fontSize: 16,
    marginTop: -1,
    fontWeight: "bold",
  },
  gridInfoNameSurnameStatic: {
    marginTop: 0,
    fontWeight: "normal",
  },
  gridInfoMonthYear: {
    position: "absolute",
    top: -3,
    right: "5%",
    paddingHorizontal: 20,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1.5,
    color: "#fff",
    paddingTop: 5,
  },
  monthYearUnderText: {
    fontWeight: "normal",
    marginTop: -5,
    fontSize: 14,
    marginLeft: 4,
  },
});
