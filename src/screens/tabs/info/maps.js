import React from "react";
import { View, StyleSheet } from "react-native";
import { Tabs, Tab } from "native-base";
import TabMapsLists from "./components/maps/TabMapsLists";
import TabMapsView from "./components/maps/TabMapsView";
import HeaderDrawer from "./components/header";
import { t } from "../../../functions/lang";

export default class Map extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <HeaderDrawer {...this.props} name={t("drawer.map")} />
        <Tabs
          tabStyle={styles.tabsBg}
          activeTabStyle={styles.activeTab}
          containerStyle={styles.tabsBg}
        >
          <Tab
            tabStyle={styles.tabsBg}
            activeTabStyle={styles.activeTab}
            containerStyle={styles.tabsBg}
            heading={t("maps.tablist.title")}
            activeTextStyle={{ color:"#7c9d32" }}
          >
            <TabMapsLists />
          </Tab>
          <Tab
            tabStyle={styles.tabsBg}
            activeTabStyle={styles.activeTab}
            containerStyle={styles.tabsBg}
            heading={t("maps.tabview.title")}
            activeTextStyle={{ color:"#7c9d32" }}
          >
            <TabMapsView />
          </Tab>
        </Tabs>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tabsBg: {
    backgroundColor: "#fff",
    borderTopWidth:2,
    borderColor: "#fff",
  },
  activeTab: {
    backgroundColor: "#fff",
    borderTopWidth:2,
    borderColor: "#7c9d32",
  },
});
