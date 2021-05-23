import React from "react";
import {View, StyleSheet, Dimensions, Text, SafeAreaView} from "react-native";
import NumberButtons from "./Components/NumberButtons";

const {width, height} = Dimensions.get("window");
import AsyncStorage from "@react-native-community/async-storage";
import {StatusBar} from "expo-status-bar";
import CodeFieldSetPass from "./Components/SetPass/CodeFieldSetPass";
import {t} from "../../../functions/lang";
import * as LocalAuthentication from "expo-local-authentication";
import {CreateAccContext} from "../../../functions/Hooks/Authentication/CreateAccount/CreateAccContext";
import Constants from "expo-constants";
import Textpopins from "../../../functions/screenfunctions/text";
import Codefield from "./Components/ProgramLock/CodeField";

var reqems = "";
export default class SetPass extends React.Component {
    static contextType = CreateAccContext

    constructor(props) {
        super(props);
        this.state = {
            pass1: "",
            pass2: "",
            setFinger: false,
        };
    }

    async getStat() {
        await AsyncStorage.getItem("haveFinger").then((a) => {
            if (a != null) {
                this.setState({setFinger: true});
            } else {
                this.hasHardware();
            }
        });
    }

    async hasHardware() {
        let permission = await LocalAuthentication.hasHardwareAsync();
        if (permission) {
            let type = await LocalAuthentication.supportedAuthenticationTypesAsync(1);
            let isFinger = type.includes(1);
            if (isFinger) {
                this.setState({setFinger: true});
            }
        }
    }

    async resetStat() {
        this.getStat();
    }

    funcStat() {
        setInterval(() => {
            this.completed();
        }, 0);
    }

    componentDidMount() {
        this.funcStat();
        this.resetStat();
    }

    async completed() {
        const params = this.props.route.params;
        if (this.state.pass1 !== "" && this.state.pass2 !== "") {
            if (this.state.pass1 === this.state.pass2) {
                await AsyncStorage.setItem("localAuthPass", this.state.pass1);
                if (params.name = "Settings") {
                    this.props.navigation.pop();
                } else {
                    this.props.navigation.navigate("SetFinger");
                }
            }
        }
    }

    changeVal(val) {
        reqems = reqems + val;
        if (this.state.pass1.length <= 3) {
            this.setState({pass1: reqems});
            if (this.state.pass1.length === 3) {
                reqems = "";
            }
        } else if (this.state.pass1.length > 3) {
            this.setState({pass2: reqems});
            if (this.state.pass2.length === 3) {
                reqems = "";
            }
        }
    }

    clearVal() {
        reqems = "";
        this.setState({pass1: "", pass2: ""});
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <StatusBar backgroundColor="#5C0082" style="dark"/>
                    <Textpopins
                        style={{fontSize: 25, color: "#fff"}}>{t('loginregister.setpass.title')}</Textpopins>
                </View>
                <View style={styles.content}>
                    <CodeFieldSetPass completed={() => this.completed()} value={this.state.pass1} {...this.props} />
                    <Textpopins
                        style={{
                            color: "#000",
                            paddingVertical: 0,
                            fontSize: 14,
                            textAlign: "center"
                        }}
                    >
                        {t("loginregister.setpass.newpassword")}
                    </Textpopins>
                    <CodeFieldSetPass completed={() => this.completed()} value={this.state.pass2} {...this.props} />
                    <Textpopins
                        style={{
                            color: "#000",
                            paddingVertical: 0,
                            fontSize: 14,
                            textAlign: "center"
                        }}
                    >
                        {t("loginregister.setpass.repeatpassword")}
                    </Textpopins>
                    <NumberButtons
                        clearVal={() => this.clearVal()}
                        changeVal={(e) => this.changeVal(e)}
                        {...this.props}
                    />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#5C0082',
    },
    header: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "transparent"
    },
    content: {
        flex: 0.8,
        backgroundColor: '#fff',
        paddingBottom: Constants.statusBarHeight * 8
    },
    center: {
        textAlign: "center",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
    },
});
