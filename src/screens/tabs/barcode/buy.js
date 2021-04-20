import React, {useState, useEffect} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import {Camera} from "expo-camera";
import {StatusBar} from "expo-status-bar";
import {Entypo, AntDesign} from "@expo/vector-icons";
import Textpopins from '../../../functions/screenfunctions/text'
import BarcodeMask from "react-native-barcode-mask";
import firebase from "../../../functions/firebase/firebaseConfig";
import NoBarcode from "./components/noBarcode";
import {t} from "../../../functions/lang";

const {width, height} = Dimensions.get("window");
export default function Buy(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [flashMode, setFlashMode] = useState("off");
    const [barcode, setbarcode] = useState(null);
    const [modalState, setModalState] = useState(false);
    const params = props.route.params;
    const checkid = params.uid;

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    if (hasPermission === null) {
        return <View/>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    function flashToggle() {
        if (flashMode == "torch") {
            setFlashMode("off");
        } else {
            setFlashMode("torch");
        }
    }

    function toggleModal() {
        setModalState(!modalState);
    }

    function renderContent() {
        if (modalState) {
            return (
                <NoBarcode
                    {...props}
                    bar={(e) => barcodeWrited(e)}
                    togMod={() => toggleModal()}
                />
            );
        } else {
            return (
                <View style={{flex: 1}}>
                    <StatusBar hidden={true}/>
                    <Camera
                        style={{flex: 1}}
                        type="back"
                        flashMode={flashMode}
                        focusable={true}
                        onBarCodeScanned={(item) => barcodeScanned(item)}
                        autoFocus={true}
                        focusDepth={10}
                        videoStabilizationMode={500}
                    >
                        <BarcodeMask
                            outerMaskOpacity={0.6}
                            edgeBorderWidth={3}
                            edgeColor={"#7c9d32"}
                            animatedLineColor="#DD2C00"
                            animatedLineHeight={2}
                            showAnimatedLine={true}
                            animated={true}
                            animatedLineWidth={"90%"}
                            lineAnimationDuration={1400}
                            useNativeDriver={true}
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                alignContent: "center",
                                textAlign: "center",
                                margin: "auto",
                                padding: "auto",
                            }}
                        />
                    </Camera>
                    <View
                        style={{
                            position: "absolute",
                            top: 15,
                            width: width,
                            height: 140,
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                width: width,
                                height: 50,
                                marginTop: 30,
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                alignContent: "center",
                                textAlign: "center",
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    minHeight: 45,
                                    maxHeight: 60,
                                    minWidth: 45,
                                    maxWidth: 60,
                                    marginLeft: 30,
                                    borderRadius: 5,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignContent: "center",
                                    textAlign: "center",
                                    backgroundColor: "rgba(0,0,0,.5)",
                                }}
                                onPress={() => {
                                    props.navigation.goBack();
                                }}
                            >
                                <AntDesign name="left" size={25} color="#fff"/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    minHeight: 45,
                                    maxHeight: 60,
                                    minWidth: 45,
                                    maxWidth: 60,
                                    marginRight: 30,
                                    borderRadius: 5,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignContent: "center",
                                    textAlign: "center",
                                    backgroundColor: "#7c9d32",
                                }}
                                onPress={() => {
                                    flashToggle();
                                }}
                            >
                                {iconRender()}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View
                        style={{
                            position: "absolute",
                            bottom: 15,
                            right: 0,
                            left: 0,
                            width: width,
                            height: 80,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                minHeight: 45,
                                maxHeight: 60,
                                minWidth: 150,
                                maxWidth: 200,
                                borderRadius: 5,
                                flexDirection: "row",
                                justifyContent: "space-around",
                                alignItems: "center",
                                alignContent: "center",
                                textAlign: "center",
                                backgroundColor: "#7c9d32",
                                marginLeft: "auto",
                                marginRight: 10,
                            }}
                            onPress={() => toggleModal()}
                        >
                            <Entypo
                                name="edit"
                                style={{paddingHorizontal: 15, paddingVertical: 10}}
                                size={30}
                                color="#fff"
                            />
                            <Text
                                style={{color: "#fff", fontSize: 14, fontWeight: "bold"}}
                                children={t("barcode.paying.noBarcode")}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }

    function iconRender() {
        if (flashMode == "torch") {
            return (
                <Entypo
                    name="flash"
                    style={{paddingHorizontal: 5, paddingVertical: 2}}
                    size={40}
                    color="rgb(255,255,255)"
                />
            );
        } else {
            return (
                <Entypo
                    name="flash"
                    style={{paddingHorizontal: 5, paddingVertical: 2}}
                    size={40}
                    color="rgba(255,255,255,.3)"
                />
            );
        }
    }

    function barcodeWrited(e) {
        setbarcode(e);
        barcodeScanned({data: barcode});
        setModalState(!modalState);
    }

    function barcodeScanned(item) {
        var element = null;

        function updateData(a) {
            var qyt = 1;
            var user = firebase.auth().currentUser;
            var dataexists = false;
            firebase
                .database()
                .ref(
                    "users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/checks/" + checkid + "/products/" + a.barcode
                )
                .once("value", (data) => {
                    if (data.exists()) {
                        var a = JSON.stringify(data.toJSON());
                        var as = JSON.parse(a);
                        qyt = parseInt(as.qty + 1);
                        dataexists = true;
                    }
                });
            if (dataexists) {
                firebase
                    .database()
                    .ref(
                        "users/" +
                        user.uid +
                        "/checks/" +
                        checkid +
                        "/products/" +
                        a.barcode
                    )
                    .update({
                        price: parseFloat(a.price * qyt),
                        qty: qyt,
                    });
            }
            dataexists = false;
            qyt = 1;
        }

        function addOrUpdate(a) {
            var user = firebase.auth().currentUser;
            firebase
                .database()
                .ref("users/Dj8BIGEYS1OIE7mnOd1D2RdmchF3/checks/" + checkid + "/products/")
                .orderByKey()
                .equalTo(a.barcode)
                .limitToFirst(1)
                .once("value", (data) => {
                    if (data.numChildren() > 0) {
                        updateData(a);
                    } else {
                        firebase
                            .database()
                            .ref(
                                "users/" +
                                user.uid +
                                "/checks/" +
                                checkid +
                                "/products/" +
                                a.barcode
                            )
                            .set({
                                barcode: a.barcode,
                                name: a.name,
                                price: parseFloat(1 * a.price),
                                checkId: checkid,
                                qty: 1,
                            });
                    }
                });
        }

        if (item != null) {
            var dataBarcode = item;
            firebase
                .database()
                .ref("allChecks/" + dataBarcode.data)
                .on("value", (data) => {
                    element = data.toJSON();
                    if (element !== null) {
                        addOrUpdate(element);
                    } else {
                        alert("Məhsul Tapılmadı");
                    }
                    dataBarcode = null;
                });
        }
        props.navigation.navigate("Buy");
    }

    return (
        <View style={{flex: 1}}>
            <StatusBar hidden={true}/>
            {renderContent()}
        </View>
    );
}
