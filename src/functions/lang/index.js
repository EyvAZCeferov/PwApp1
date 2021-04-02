// Libraries
import * as Localization from 'expo-localization';
import i18n from "ex-react-native-i18n";
import AsyncStorage from '@react-native-community/async-storage';
// Trasnlations

import en from './en.json';
import az from './az.json';
import ru from './ru.json';


// Bind Translations

i18n.translations = {
    en,
    az,
    ru,
}

// PhoneLocalization

export const getLang = async () => {
    i18n.fallbacks = true;
    try {
        if (await AsyncStorage.getItem('language')) {
            await AsyncStorage.getItem('language').then((lang) => {
                i18n.locale = lang;
                Localization.locale = lang;
                i18n.locale = Localization.locale;

            });
        } else {
            i18n.locale = 'az';
            Localization.locale = 'az';
            i18n.locale=Localization.locale;
        }
        i18n.initAsync();
    } catch (error) {
        alert(error);
    }
}

getLang();

export const setLang = async (lang) => {
    try {
        AsyncStorage.setItem('language', lang);
        i18n.locale = lang;
        Localization.locale = lang;
        i18n.initAsync();
    } catch (error) {
        alert('Dil Seçilmədi.');
    }
}

// Function

export function t(key) {
    return i18n.t(key);
}
