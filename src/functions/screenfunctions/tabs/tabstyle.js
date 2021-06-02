import React, { useRef } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Transition, Transitioning } from "react-native-reanimated";
import ICONS from "./src/ICONS";
import { Ionicons } from "@expo/vector-icons";
import Textpopins from "../text";

const { width } = Dimensions.get("window");

export default function TabComponent({
  labid,
  label,
  accessibilityState,
  onPress,
}) {
  const focused = accessibilityState.selected;
  const icon = !focused ? ICONS.icons[labid] : ICONS.icons[`${labid}FOCUSED`];

  const transition = (
    <Transition.Sequence>
      <Transition.Out type="fade" durationMs={5} />
      <Transition.Change interpolation="easeInOut" durationMs={100} />
      <Transition.In type="fade" durationMs={10} />
    </Transition.Sequence>
  );

  const ref = useRef();

  return (
    <TouchableOpacity
      style={{ width: width / 4.1, height: "100%" }}
      onPress={() => {
        ref.current.animateNextTransition();
        onPress();
      }}
    >
      <Transitioning.View
        focused={focused}
        labid={labid}
        ref={ref}
        transition={transition}
        style={[styles.background]}
      >
        <View style={[styles.cont, { justifyContent: "center" }]}>
          <Ionicons
            name={icon}
            size={focused ? 25 : 21}
            color="#5C0082"
            style={focused ? { fontWeight: "bold" } : null}
          />
          {!focused ? (
            <Textpopins
              style={[
                styles.label,
                { color: focused ? textColors[labid] : "#5C0082" },
              ]}
            >
              {label}
            </Textpopins>
          ) : null}
        </View>
      </Transitioning.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  background: {
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  cont: {
    width: "100%",
    height: "100%",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
  },
  label: {
    fontWeight: "700",
    fontSize: 12,
    marginLeft: 5,
    textAlign: "center",
  },
  icon: {
    maxWidth: 16,
    maxHeight: 16,
    minHeight: 14,
    minWidth: 14,
  },
});
