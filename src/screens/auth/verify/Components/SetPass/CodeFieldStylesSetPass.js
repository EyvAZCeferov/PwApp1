import {StyleSheet, Dimensions} from 'react-native';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
export const CELL_SIZE = 50;
export const CELL_BORDER_RADIUS = 0;
export const DEFAULT_CELL_BG_COLOR = '#fff';
export const NOT_EMPTY_CELL_BG_COLOR = '#C90052';
export const ACTIVE_CELL_BG_COLOR = '#f1f1f1';

const styles = StyleSheet.create({
    codeareaSetPas: {
        height: 60,
        marginVertical: 10,
        width: width,
    },
    codeFieldRoot: {
        height: CELL_SIZE,
        marginVertical: 0,
        paddingHorizontal: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    cell: {
        marginHorizontal: 15,
        height: CELL_SIZE,
        width: CELL_SIZE,
        lineHeight: CELL_SIZE,
        fontSize: 35,
        backgroundColor: '#fff',
        textAlign: 'center',
        color: '#C90052',
        borderColor: 'transparent',
        borderBottomColor: "rgba(0,0,0,.5)",
        borderBottomWidth: 1.54,
        borderRadius: 0,
    },
    root: {
        height: height,
    }
});

export default styles;
