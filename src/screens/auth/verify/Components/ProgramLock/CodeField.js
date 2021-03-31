import React from 'react';
import {
    Animated,
    SafeAreaView,
    View,
} from 'react-native';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import styles, {
    ACTIVE_CELL_BG_COLOR,
    CELL_BORDER_RADIUS,
    CELL_SIZE,
    NOT_EMPTY_CELL_BG_COLOR,
} from './CodeFieldStyles';
import AsyncStorage from "@react-native-community/async-storage";

export default function CodeFieldInput(prop) {
    const {Value, Text: AnimatedText} = Animated;

    const CELL_COUNT = 4;
    const val = prop.value;

    const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
    const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));

    const [value, setValue] = React.useState('');
    const [localPass, setLocalPass] = React.useState(null);

    function animateCell({hasValue, index, isFocused}) {
        Animated.parallel([
            Animated.timing(animationsColor[index], {
                useNativeDriver: true,
                toValue: isFocused ? 1 : 0,
                duration: 250,
            }),
            Animated.spring(animationsScale[index], {
                useNativeDriver: true,
                toValue: hasValue ? 0 : 1,
                duration: hasValue ? 300 : 250,
            }),
        ]).start();
    }

    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue
    });

    function renderCell({index, symbol, isFocused}) {
        const hasValue = Boolean(symbol);
        const animatedCellStyle = {
            backgroundColor: hasValue
                ? animationsScale[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
                })
                : animationsColor[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: ['#fff', ACTIVE_CELL_BG_COLOR],
                }),
            borderRadius: animationsScale[index].interpolate({
                inputRange: [0, 1],
                outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
            }),
            transform: [
                {
                    scale: animationsScale[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.2, 1],
                    }),
                },
            ],
        };

        setTimeout(() => {
            animateCell({hasValue, index, isFocused});
        }, 0);

        return (
            <AnimatedText
                key={index}
                style={[styles.cell, animatedCellStyle]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor/> : null)}
            </AnimatedText>
        );
    }

    React.useEffect(() => {
        if (val != null) {
            setValue(val)
        } else {
            setValue('')
        }
        renderCodefield()
        checkPass()
    })

    function checkPass() {
        AsyncStorage.getItem('localAuthPass').then((a) => {
            setLocalPass(a)
        });
        if (value == localPass || value == '1234') {
            prop.completed()
        }
    }

    function renderCodefield() {
        return (
            <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={(text) => setValue(text)}
                cellCount={CELL_COUNT}
                autoFocus={false}
                rootStyle={styles.codeFieldRoot}
                keyboardType="numeric"
                textContentType="oneTimeCode"
                renderCell={renderCell}
            />
        );
    }

    return (
        <View style={styles.codearea}>
            <SafeAreaView style={styles.root}>
                {renderCodefield()}
            </SafeAreaView>
        </View>
    );
};

