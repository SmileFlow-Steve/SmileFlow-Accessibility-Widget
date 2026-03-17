import runAccessibility from "@/views/menu/runAccessibility";
import { renderWidget } from "@/views/widget/widget"

import { 
    userSettings,
    getSavedUserSettings
} from '@/globals/userSettings';

import {
    pluginConfig
} from "./globals/pluginConfig";
import { changeLanguage } from "./i18n/changeLanguage";

export default function smileflow({
    options
}) {
    const savedSettings = getSavedUserSettings();

    Object.assign(pluginConfig, options);
    
    if (savedSettings && typeof savedSettings === 'object') {
        Object.assign(userSettings, savedSettings);
    }
    
    runAccessibility();
    renderWidget();

    return {
        changeLanguage
    }
}