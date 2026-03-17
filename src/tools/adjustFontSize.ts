import {
    ICON_SELECTOR
} from '@/enum/Selectors';

const FONT_SIZE_SELECTOR = 'h1,h2,h3,h4,h5,h6,p,a,dl,dt,li,ol,th,td,span,blockquote,.asw-text';
const ICON_SELECTOR_SET = new Set(ICON_SELECTOR);

export default function adjustFontSize(multiply:number = 1) {
    document
        .querySelectorAll(FONT_SIZE_SELECTOR)
        .forEach((el: HTMLElement) => {
            // Skip elements that contain any class in ICON_SELECTOR_SET
            if ([...el.classList].some(cls => ICON_SELECTOR_SET.has(cls))) {
                return;
            }

            // Get the original font size
            const orgFontSize = Number(el.dataset.aswOrgFontSize) || parseInt(window.getComputedStyle(el).fontSize);

            // If no font size stored in data, set it now
            if (!el.dataset.aswOrgFontSize) {
                el.dataset.aswOrgFontSize = String(orgFontSize);
            }

            // Calculate new font size
            const newFontSize = orgFontSize * multiply;

            // Only apply if it's different from the current style or if we are resetting to 1
            if (multiply !== 1) {
                el.style.fontSize = `${newFontSize}px`;
            } else if (el.style.fontSize && el.dataset.aswOrgFontSize) {
                // If multiply is 1, but we have a hardcoded size, remove it to let CSS take over again
                el.style.fontSize = '';
            }
        });
}