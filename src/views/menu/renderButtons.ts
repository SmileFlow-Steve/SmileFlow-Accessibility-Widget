import { escapeHTML } from "@/utils/escape";

export default function renderButtons(buttons, btnClass?: string) {
    let _html = '';

    for (let i = buttons.length; i--;) {
        const button = buttons[i];

        _html += `<button class="asw-btn ${escapeHTML(btnClass || '')}" type="button" data-key="${escapeHTML(button.key)}" title="${escapeHTML(button.label)}">${button.icon}<span class="asw-translate">${escapeHTML(button.label)}</span></button>`;
    }

    return _html;
}
