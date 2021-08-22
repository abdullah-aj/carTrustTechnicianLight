import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {en as translationEN} from './en';
import {ar as translationAR} from './ar';

// the translations
const resources = {
    en: {
        translation: {...translationEN},
    },
    ar: {
        translation: {...translationAR},
    },
};


export function initializeLang(lang = 'en', cb) {
    i18n
        .use(initReactI18next) // passes i18n down to react-i18next
        .init({
            lng: lang ? lang : 'en',
            debug: true,
            resources,
            interpolation: {
                escapeValue: false, // react already safes from xss
            },
        }, cb);
};


export default i18n;
