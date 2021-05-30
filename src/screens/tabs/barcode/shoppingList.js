import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import RecentOperation from "./components/recentoperations";
import { StatusBar } from "expo-status-bar";
import PayCards from "./components/paying";
import { AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
class ShoppingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: true,
      checkid: null,
    };
  }

  componentDidMount() {
    const params = this.props.route.params;
    if (params.checkid != null) {
      this.setState({ refresh: false, checkid: params.checkid });
      this.renderArena();
    }
  }

  goBack() {
    this.setState({
      refresh: true,
    });
    this.props.navigation.goBack();
  }

  renderArena() {
    const params = this.props.route.params;
    return (
      <View style={styles.content}>
        {this.state.refresh ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <StatusBar backgroundColor="#fff" style="dark" />
            <ActivityIndicator size="large" color="#5C0082" />
          </View>
        ) : (
          <View>
            <StatusBar backgroundColor="#5C0082" style="light" />
            <SafeAreaView style={styles.upperView}>
              <View
                style={{
                  position: "absolute",
                  top: 20,
                  left: 0,
                  backgroundColor: "#5C0082",
                  width: width,
                  zIndex: 2,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "transparent",
                    padding: 7,
                    width: 40,
                    height: 40,
                    zIndex: 16,
                  }}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <AntDesign name="left" color="#fff" size={25} />
                </TouchableOpacity>
              </View>
              <PayCards
                id={params.id}
                cardNumb={params.selectedCard}
                {...this.props}
              />
            </SafeAreaView>
            <View style={styles.downerView}>
              <RecentOperation value={this.props.bucketitems} {...this.props} />
            </View>
          </View>
        )}
      </View>
    );
  }

  render() {
    return <View style={styles.content}>{this.renderArena()}</View>;
  }
}

const mapStateToProps = (state) => {
  return {
    bucketitems: state.bucketitems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addtoCard: (product) => dispatch({ type: "ADD_TO_CART", payload: product }),
  };
};
// export default connect(mapStateToProps, mapDispatchToProps)(ShoppingList);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  upperView: {
    maxHeight: height / 1.5,
    minHeight: 250,
    backgroundColor: "#fff",
  },
  downerView: {
    maxHeight: height / 2.5,
    minHeight: 250,
    backgroundColor: "#fff",
  },
});
