export const PROFILES = [
    {
        key: 'visually-impaired',
        label: 'Visually Impaired',
        states: {
            fontSize: 1.2,
            'highlight-links': true,
            'highlight-title': true,
            'big-cursor': true
        }
    },
    {
        key: 'dyslexia-friendly',
        label: 'Dyslexia Friendly',
        states: {
            'readable-font': true,
            'readable-guide': true,
            'line-height': true,
            'letter-spacing': true
        }
    },
    {
        key: 'seizure-safe',
        label: 'Seizure Safe',
        states: {
            'stop-animations': true,
            contrast: 'low-saturation'
        }
    },
    {
        key: 'high-contrast',
        label: 'High Contrast',
        states: {
            contrast: 'high-contrast'
        }
    }
];
