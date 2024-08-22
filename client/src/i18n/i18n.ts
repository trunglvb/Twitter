/* eslint-disable import/no-named-as-default-member */
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import EN from '../locales/locales.en.json'
import VI from '../locales/locales.vi.json'

export const resources = {
  en: {
    translation: EN
  },
  vi: {
    translation: VI
  }
} as const

export const defaultNS = 'translation'

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', //default
  ns: ['translation'],
  fallbackLng: 'en', //trong truong hop khong xac dinh duoc ngon ngu,
  interpolation: {
    escapeValue: false // react already safes from xss
  },
  defaultNS: defaultNS
})

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
}
