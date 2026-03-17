// @ts-expect-error - html file import
import template from "./menu.html";

import FilterButtons from "./FilterButtons";
import ContentButtons from "./ContentButtons";
import ToolButtons from "../../enum/TOOL_PRESETS";
import { PROFILES } from "../../enum/PROFILES";

import renderButtons from "./renderButtons";
import adjustFontSize from "../../tools/adjustFontSize";
import renderTools from "./renderTools";
import reset from "./reset";
import runAccessibility from "./runAccessibility";

import { ILanguage, LANGUAGES } from "../../i18n/Languages";

import css from "./menu.css";
import enableContrast from "@/tools/enableContrast";
import { pluginConfig } from "@/globals/pluginConfig";
import { userSettings, saveUserSettings } from "@/globals/userSettings";
import { changeLanguage } from "@/i18n/changeLanguage";
import toggleMenu from "./toggleMenu";
import { $widget } from "../widget/widget";
import { escapeHTML } from "@/utils/escape";

export default function renderMenu() {
    const $container: HTMLElement = document.createElement("div");
    $container.innerHTML = `<style>${css}</style>` + template;

    const $menu = $container.querySelector(".asw-menu");
    if (pluginConfig?.position?.includes("right")) {
        $menu.style.right = '0px';
        $menu.style.left = 'auto';
    }

    $menu.querySelector(".content").innerHTML = renderButtons(ContentButtons);
    $menu.querySelector(".tools").innerHTML = renderButtons(ToolButtons, 'asw-tools');
    $menu.querySelector(".contrast").innerHTML = renderButtons(FilterButtons, 'asw-filter');
    $menu.querySelector(".profiles").innerHTML = PROFILES.map(profile =>
        `<button class="asw-btn asw-profile-btn" type="button" data-key="${escapeHTML(profile.key)}">
            <span class="asw-translate">${escapeHTML(profile.label)}</span>
        </button>`
    ).join('');

    // *** States UI Rendering ***
    const states = userSettings?.states;

    const fontSize = Number(states?.fontSize) || 1;
    if (fontSize != 1) {
        $menu.querySelector(".asw-amount").textContent = `${(fontSize * 100).toFixed(0)}%`;
    }

    if (states) {
        const buttons = Array.from($menu.querySelectorAll('.asw-btn'));

        Object.entries(states).forEach(([key, value]) => {
            if (value && key !== "fontSize") {
                const selector = key === "contrast" ? states[key] : key;
                const btn = buttons.find(b => b.dataset.key === selector);
                if (btn) btn.classList.add("asw-selected");
            }
        });
    }

    // *** Translations ***
    if (!userSettings.lang && pluginConfig?.lang) {
        userSettings.lang = pluginConfig.lang;
    }

    if (!LANGUAGES.some(lang => lang.code === userSettings.lang)) {
        userSettings.lang = "en";
    }

    const $lang = $menu.querySelector("#asw-language");
    const langOptions = LANGUAGES.map((lang: ILanguage) => `<option value="${escapeHTML(lang.code)}">${escapeHTML(lang.label)}</option>`).join('');
    $lang.innerHTML = langOptions;
    $lang.value = userSettings.lang;
    $lang.addEventListener("change", (event) => {
        changeLanguage(event.target.value);
    });

    // *** Utils ***
    $container.querySelectorAll('.asw-menu-close, .asw-overlay').forEach((el) =>
        el.addEventListener('click', toggleMenu)
    );

    $container.querySelectorAll('.asw-menu-reset').forEach((el) =>
        el.addEventListener('click', reset)
    );

    // *** Controls ***
    $menu.querySelectorAll(".asw-plus, .asw-minus").forEach((el: HTMLElement) => {
        el.addEventListener("click", () => {
            const difference = 0.1;

            let fontSize = userSettings?.states?.fontSize || 1;
            if (el.classList.contains('asw-minus')) {
                fontSize -= difference;
            } else {
                fontSize += difference;
            }

            fontSize = Math.max(fontSize, 0.1);
            fontSize = Math.min(fontSize, 2);
            fontSize = Number(fontSize.toFixed(2));

            document.querySelector(".asw-amount").textContent = `${(fontSize * 100).toFixed(0)}%`;

            adjustFontSize(fontSize);
            userSettings.states.fontSize = fontSize;

            saveUserSettings();
        });
    });

    $menu.querySelectorAll(".asw-btn").forEach((el: HTMLElement) => {
        el.addEventListener("click", () => {
            const key = el.dataset.key;
            const isSelected = !el.classList.contains("asw-selected");

            if (el.classList.contains("asw-profile-btn")) {
                const profile = PROFILES.find(p => p.key === key);
                if (profile) {
                    const buttons = Array.from($menu.querySelectorAll('.asw-btn'));
                    
                    if (isSelected) {
                        // Deselect other profiles
                        $menu.querySelectorAll(".asw-profile-btn").forEach((btn: HTMLElement) => 
                            btn.classList.remove("asw-selected")
                        );
                        el.classList.add("asw-selected");

                        // Reset states completely before applying new profile
                        userSettings.states = {};

                        // Apply profile states
                        Object.assign(userSettings.states, profile.states);
                    } else {
                        el.classList.remove("asw-selected");
                        // Clear all states when turning off the profile
                        userSettings.states = {};
                    }

                    saveUserSettings();
                    runAccessibility();

                    // Sync all buttons to reflect current settings
                    buttons.forEach((btn: HTMLElement) => {
                        const btnKey = btn.dataset.key;
                        if (btn.classList.contains('asw-profile-btn')) return;

                        if (btn.classList.contains('asw-filter')) {
                            btn.classList.toggle("asw-selected", userSettings.states.contrast === btnKey);
                        } else {
                            btn.classList.toggle("asw-selected", !!userSettings.states[btnKey]);
                        }
                    });

                    // Sync font size display
                    const fs = Number(userSettings.states.fontSize) || 1;
                    $menu.querySelector(".asw-amount").textContent = `${(fs * 100).toFixed(0)}%`;
                }
                return;
            }
            
            // --- Contrast ---
            if (el.classList.contains("asw-filter")) {
                $menu.querySelectorAll(".asw-filter").forEach((el: HTMLElement) =>
                    el.classList.remove("asw-selected")
                );

                if (isSelected) {
                    el.classList.add("asw-selected");
                }

                userSettings.states.contrast = isSelected ? key : false;
                enableContrast(userSettings.states.contrast);

                saveUserSettings();

                return;
            }
            
            el.classList.toggle("asw-selected", isSelected);
            userSettings.states[key] = isSelected;
            renderTools();

            saveUserSettings();
        });
    });

    $widget.appendChild($container);

    return $container;
}