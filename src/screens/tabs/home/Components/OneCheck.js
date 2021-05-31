import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Header, Left, Body, Button, Content } from "native-base";

const { width, height } = Dimensions.get("window");
import { QRCode as CustomQRCode } from "react-native-custom-qr-codes-expo";
import { StatusBar } from "expo-status-bar";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { t } from "../../../../functions/lang";
import Textpopins from "../../../../functions/screenfunctions/text";
import Constants from "expo-constants";
import axios from "axios";

let priceAll = 0;
let edv = 0;
export default class OneCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: null,
      check: null,
      edvStat: "not",
      refresh: true,
      checkid: null,
      priceAll: 0,
      edv: 0,
    };
  }

  async getInfo() {
    this.setState({ refresh: true });
    const params = this.props.route.params;
    const { checkid } = params;
    let priceAll = 0;
    this.setState({ checkid });
    await axios.get("actions/shops/" + checkid).then((e) => {
      this.setState({
        check: e.data,
      });
    });
    await axios.get("/actions/shops/" + checkid + "/products").then((e) => {
      this.setState({
        products: e.data,
      });
    });
    if (this.state.products != null) {
      this.state.products.map((element) => {
        priceAll = priceAll + parseFloat(element.price);
      });
    }
    this.setState({ priceAll });
    edv = (((parseFloat(priceAll) * 18) / 100) * 10) / 100;
    this.setState({ edv });
    this.renderViews();
    setTimeout(() => {
      this.renderPage();
      this.setState({ refresh: false });
    }, 1000);
  }

  componentDidMount() {
    this.setState({ refresh: true });
    this.getInfo();
  }

  renderViews() {
    return (
      <View style={[styles.bgTransparent, styles.center]}>
        <View style={[styles.bgTransparent, styles.center]}>
          {this.renderHeader()}
        </View>
        <View style={[styles.bgTransparent, styles.center]}>
          {this.renderContent()}
        </View>
        <View style={[styles.bgTransparent, styles.center]}>
          {this.renderFooter()}
        </View>
      </View>
    );
  }

  renderHeader() {
    return (
      <View style={[styles.bgTransparent, styles.center]}>
        <View style={styles.headerTop}>
          <View
            style={[
              styles.center,
              {
                flexDirection: "row",
                marginVertical: 4,
                width: "100%",
                paddingHorizontal: 10,
              },
            ]}
          >
            <Textpopins
              children={t("check.tsAd") + " : "}
              style={{ fontWeight: "700", fontSize: 16 }}
            />
            <Textpopins
              children={this.state.check.get_customer.name["az_name"]}
              style={{ fontWeight: "700", fontSize: 16 }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginVertical: 4,
              width: "100%",
              paddingHorizontal: 10,
            }}
          >
            <Textpopins
              children={
                t("check.tsAddress") + " : " + this.state.check.user
                  ? this.state.check.user
                  : t("check.tsAddress") + " : "
              }
            />
          </View>
          <View style={{ marginVertical: 10 }} />
          <View
            style={{
              flexDirection: "row",
              marginVertical: 4,
              width: "100%",
              paddingHorizontal: 10,
            }}
          >
            <Textpopins
              children={
                t("check.voad") +
                " : " +
                this.state.check.get_customer.name["az_name"]
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginVertical: 4,
              width: "100%",
              paddingHorizontal: 10,
            }}
          >
            <Textpopins
              children={
                t("check.voen") + " " + this.state.check.marketVoen ?? null
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginVertical: 4,
              width: "100%",
              paddingHorizontal: 10,
            }}
          >
            <Textpopins
              children={
                t("check.objectCode") + " " + this.state.check.marketCode ??
                null
              }
            />
          </View>
          <View style={{ marginVertical: 10 }} />
        </View>
        <View style={styles.headerCenter}>
          <View
            style={[
              styles.center,
              {
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                marginVertical: 4,
                width: width,
              },
            ]}
          >
            <Textpopins
              children={t("check.selCheck") + " "}
              style={{ textAlign: "left", fontWeight: "700", fontSize: 16 }}
            />
            <Textpopins
              children={this.state.checkid}
              style={{ textAlign: "left", fontWeight: "700", fontSize: 16 }}
            />
          </View>
        </View>
        <View style={[styles.headerFooter]}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 4,
              width: "100%",
              paddingHorizontal: 10,
            }}
          >
            <Textpopins children={t("check.kassir") + ":"} />
            <Textpopins children={this.state.check.kassirName ?? null} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 4,
              width: "100%",
              paddingHorizontal: 9,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Textpopins children={t("check.tarix") + ": "} />
              <Textpopins
                children={this.convertStampDate(
                  new Date(this.state.check.created_at),
                  "date"
                )}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Textpopins children={t("check.saat") + ": "} />
              <Textpopins
                children={this.convertStampDate(
                  new Date(this.state.check.created_at),
                  "hour"
                )}
              />
            </View>
          </View>
        </View>
        <Seperator />
      </View>
    );
  }

  renderContent() {
    return (
      <View style={[styles.bgTransparent, styles.center]}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Textpopins
              style={styles.tableBigArena}
              children={t("check.productName")}
            />
            <Textpopins children={t("check.productQyt")} />
            <Textpopins children={t("check.productPrice")} />
            <Textpopins children={t("check.productSum")} />
          </View>
          <View style={styles.tableContent}>
            <FlatList
              data={this.state.products}
              renderItem={this.renderProducts}
              keyExtractor={(item, index) => index.toString()}
              focusable={true}
            />
          </View>
          <Seperator type="table" />
          <View style={styles.tableFooter}>
            <View style={styles.tableFooterElements}>
              <Textpopins
                children={t("check.productSum")}
                style={{ fontSize: 16, fontWeight: "bold" }}
              />
              <Textpopins
                children={Math.fround(this.state.priceAll)
                  .toString()
                  .substring(0, 4)}
                style={{ fontSize: 16, fontWeight: "bold" }}
              />
            </View>
            <View style={styles.tableFooterElements}>
              <Textpopins children={t("check.edv18")} />
              <Textpopins
                children={Math.fround(this.state.edv)
                  .toString()
                  .substring(0, 4)}
              />
            </View>
            <View style={styles.tableFooterElements}>
              <Textpopins children={t("check.sumVergi")} />
              <Textpopins
                children={Math.fround(this.state.edv)
                  .toString()
                  .substring(0, 4)}
              />
            </View>
            <View style={{ marginVertical: 5 }} />
            <Seperator />
            <View style={{ marginVertical: 10 }} />
          </View>
          <View style={styles.tableFooter}>
            <View style={styles.tableFooterElements}>
              <Textpopins children={t("check.nagdsiz")} />
              <Textpopins
                children={Math.fround(this.state.priceAll)
                  .toString()
                  .substring(0, 4)}
              />
            </View>
            <View style={styles.tableFooterElements}>
              <Textpopins children={t("check.bonus")} />
              <Textpopins children="0.00" />
            </View>
            <View style={{ marginVertical: 5 }} />
            <Seperator />
            <View style={{ marginVertical: 10 }} />
          </View>
          <View style={styles.tableFooter}>
            <View style={styles.tableFooterElements}>
              <Textpopins
                style={{ maxWidth: "50%", minWidth: "10%" }}
                children={t("check.gunerzindevurulmuscekler")}
              />
              <Textpopins
                style={{ maxWidth: "50%", minWidth: "10%" }}
                children={this.state.check.checkCount}
              />
            </View>
            <View style={styles.tableFooterElements}>
              <Textpopins
                style={{ maxWidth: "50%", minWidth: "10%" }}
                children={t("check.kassaninmodeli")}
              />
              <Textpopins
                style={{ maxWidth: "50%", minWidth: "10%" }}
                children="Az Smart Ficsal Box"
              />
            </View>
            <View style={styles.tableFooterElements}>
              <Textpopins
                style={{ maxWidth: "50%", minWidth: "10%" }}
                children={t("check.kassaAparatınınZavodNomresi")}
              />
              <Textpopins
                style={{ maxWidth: "50%", minWidth: "10%" }}
                children={this.state.check.cassaAparatZavod}
              />
            </View>
            <View style={styles.tableFooterElements}>
              <Textpopins
                style={{ maxWidth: "50%", minWidth: "10%" }}
                children={t("check.ficsalId")}
              />
              <Textpopins
                style={{ maxWidth: "50%", minWidth: "10%" }}
                children={this.state.checkid}
              />
            </View>
            <View style={styles.tableFooterElements}>
              <Textpopins
                style={{ maxWidth: "50%", minWidth: "10%" }}
                children={t("check.nmqQeydNomresi")}
              />
              <Textpopins
                style={{ maxWidth: "50%", minWidth: "10%" }}
                children={this.state.nmqCount}
              />
            </View>
            <View style={{ marginVertical: 5 }} />
            <Seperator />
            <View style={{ marginVertical: 10 }} />
          </View>
        </View>
      </View>
    );
  }

  renderProducts({ item, index }) {
    function countSum(item) {
      var result = null;
      var qyt = item.qty ? parseFloat(item.qty) : 1;
      var price = item.price ? parseFloat(item.price) : 0;
      result = qyt * price;
      return result;
    }

    return (
      <View
        key={index}
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          marginVertical: 5,
        }}
      >
        <Textpopins style={{ width: "35%" }} children={item.name} />
        <Textpopins children={item.qyt} />
        <Textpopins children={countSum(item) / item.qyt} />
        <Textpopins children={countSum(item)} />
      </View>
    );
  }

  renderFooter() {
    return (
      <View style={[styles.bgTransparent, styles.center]}>
        <QrCode val={"https://www.facebook.com"} />
        <View
          style={[
            styles.center,
            {
              height: 50,
              width: width,
              backgroundColor: "#AF0045",
              marginVertical: 15,
              marginTop: 25,
            },
          ]}
        >
          <Textpopins
            children="Pay And Win"
            style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}
          />
        </View>
        <Textpopins
          children={t("check.edvTitle")}
          style={{ fontSize: 20, fontWeight: "bold" }}
        />
        <Seperator />
        <View style={{ marginBottom: 20, width: width }}>
          {this.edvGeriQaytar()}
        </View>
      </View>
    );
  }

  edvGeriQaytar() {
    if (this.state.edvStat == "not") {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "90%",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Textpopins
            style={{ fontSize: 18, fontWeight: "bold", paddingLeft: 10 }}
            children={t("check.edvStatNot")}
          />
          <Button
            info
            focusable={true}
            style={[styles.center, { width: 30, height: 30, borderRadius: 15 }]}
          >
            <AntDesign name="plus" color="#fff" size={24} />
          </Button>
        </View>
      );
    } else if (this.state.edvStat == "pending") {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "90%",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Textpopins
            style={{ fontSize: 18, fontWeight: "bold", paddingLeft: 5 }}
            children={t("check.edvStatPending")}
          />
          <Button
            warning
            focusable={true}
            style={[styles.center, { width: 30, height: 30, borderRadius: 15 }]}
          >
            <View
              style={[
                styles.center,
                {
                  width: 5,
                  height: 5,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                },
              ]}
            />
          </Button>
        </View>
      );
    } else if (this.state.edvStat == "success") {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "90%",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Textpopins
            style={{ fontSize: 18, fontWeight: "bold", paddingLeft: 5 }}
            children={t("check.edvStatSuccess")}
          />
          <Button
            success
            focusable={true}
            style={[styles.center, { width: 30, height: 30, borderRadius: 15 }]}
          >
            <View
              style={[
                styles.center,
                {
                  width: 5,
                  height: 5,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                },
              ]}
            />
          </Button>
        </View>
      );
    }
  }

  convertStampDate(unixtimestamp, type) {
    var months_arr = [
      "Yanvar",
      "Fevral",
      "Mart",
      "Aprel",
      "May",
      "İyun",
      "İyul",
      "Avqust",
      "Sentyabr",
      "Oktyabr",
      "Noyabr",
      "Dekabr",
    ];

    var date = new Date(unixtimestamp * 1);

    var year = date.getFullYear();

    var month = months_arr[date.getMonth()];

    var day = date.getDate();

    var hours = date.getHours();

    var minutes = "0" + date.getMinutes();

    var seconds = "0" + date.getSeconds();

    var fulldate =
      day + " " + month + " " + year + " " + hours + ":" + minutes.substr(-2);
    if (type == "hour") {
      fulldate = hours + ":" + minutes.substr(-2);
      return fulldate;
    } else if (type == "date") {
      fulldate = day + " " + month + " " + 2020;
      return fulldate;
    } else {
      return fulldate;
    }
  }

  renderPage() {
    if (this.state.refresh) {
      return (
        <View style={[styles.container, styles.center]}>
          <ActivityIndicator
            size="large"
            color="#AF0045"
            animating={true}
            focusable={true}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <Header style={[styles.bgTransparent, styles.header]}>
            <StatusBar style="dark" animated={true} backgroundColor="#fff" />
            <Left style={styles.bgTransparent}>
              <StatusBar style="dark" animated={true} backgroundColor="#fff" />
              <TouchableOpacity
                style={[styles.bgTransparent, { paddingLeft: 10 }]}
                onPress={() => this.props.navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#AF0045" />
              </TouchableOpacity>
            </Left>
            <Body style={styles.bgTransparent}>
              <StatusBar style="dark" animated={true} backgroundColor="#fff" />
              <Text style={styles.headerBodyText}>
                {this.convertStampDate(new Date(this.state.check.created_at))}
              </Text>
            </Body>
          </Header>
          <Content>
            <View style={[styles.content, styles.center, styles.bgTransparent]}>
              <ScrollView style={styles.bgTransparent}>
                {this.renderViews()}
              </ScrollView>
            </View>
          </Content>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="dark" animated={true} backgroundColor="#fff" />
        {this.renderPage()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: "#fff",
  },
  center: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  bgTransparent: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    shadowColor: "transparent",
    elevation: 0,
  },
  header: {
    marginTop: width / 14,
    paddingBottom: 10,
    height: width / 6.8,
    borderColor: "#fff",
  },
  headerTop: {
    width: width - 30,
  },
  headerCenter: {
    marginVertical: 10,
  },
  headerBodyText: {
    color: "#AF0045",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "left",
    paddingLeft: 0,
  },
  headerFooter: {
    width: width - 20,
  },
  content: {
    width: width,
    height: "100%",
    marginBottom: height / 10,
  },
  table: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  tableHeader: {
    borderColor: "#000",
    borderWidth: 0,
    width: "90%",
    borderBottomWidth: 4,
    flexDirection: "row",
    paddingHorizontal: 2,
    justifyContent: "space-between",
  },
  tableBigArena: {
    width: "45%",
  },
  tableContent: {
    width: "85%",
    paddingHorizontal: 2,
    flexDirection: "column",
  },
  tableFooter: {
    width: "90%",
    paddingHorizontal: 2,
    flexDirection: "column",
  },
  tableFooterElements: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
});

function Seperator(props) {
  let widthLength = width / 5;

  function getSymbol(type) {
    var symbols = [];
    if (type === "table") {
      widthLength = width / 4.5;
      for (var i = 0; i < widthLength + width / 48; i++) {
        symbols.push("-");
      }
    } else {
      for (var i = 0; i < widthLength; i++) {
        symbols.push("*");
      }
    }
    return (
      <Text
        style={{
          color: "#000",
          fontSize: 12,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {symbols}
      </Text>
    );
  }

  return (
    <View style={{ width: width, marginVertical: 15 }}>
      {getSymbol(props.type)}
    </View>
  );
}

function QrCode(props) {
  if (props != null) {
    return (
      <CustomQRCode
        content={props.val}
        size={width / 1.25}
        color="#000"
        codeStyle="square"
        innerEyeStyle="square"
        outerEyeStyle="square"
      />
    );
  }
}
