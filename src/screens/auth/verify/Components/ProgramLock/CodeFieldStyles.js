import { StyleSheet, Dimensions } from "react-native";

var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;
export const CELL_SIZE = 50;
export const CELL_BORDER_RADIUS = 0;
export const DEFAULT_CELL_BG_COLOR = "#EBECF0";
export const NOT_EMPTY_CELL_BG_COLOR = "#C90052";
export const ACTIVE_CELL_BG_COLOR = "#EBECF0";

const styles = StyleSheet.create({
  codearea: {
    height: 70,
    width: width,
    
  },
  codeFieldRoot: {
    height: CELL_SIZE,
    marginVertical: 0,
    paddingHorizontal: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    
  },
  cell: {
    marginHorizontal: 15,
    height: CELL_SIZE,
    width: CELL_SIZE,
    lineHeight: CELL_SIZE - 5,
    fontSize: 30,
    backgroundColor: "#EBECF0",
    textAlign: "center",
    color: "#C90052",
    borderColor: "transparent",
    borderRadius: 0,
    borderColor: "#7c9d32",
    borderBottomWidth: 2,
  },
  root: {
    height: "100%",
  },
});

export default styles;
