export default function screenReader(enable: boolean) {
    if (enable) {
        // @ts-expect-error - Attaching custom property to window for later removal
        window.__asw__onClickScreenReader = (event: MouseEvent) => {
            const clickedElement = event.target as HTMLElement;

            if (clickedElement && !["BODY", "HEAD", "HTML"].includes(clickedElement.nodeName)) {
                const text = clickedElement.innerText || clickedElement.textContent;
                if (text && 'speechSynthesis' in window) {
                    if (speechSynthesis.speaking) {
                        speechSynthesis.cancel();
                    }
                    const utterance = new SpeechSynthesisUtterance(text.trim());
                    speechSynthesis.speak(utterance);
                }
            }
        };

        document.addEventListener('click',
            // @ts-expect-error - Retrieving custom property from window
            window.__asw__onClickScreenReader
        );
    } else {
        // @ts-expect-error - Retrieving custom property from window
        if (window.__asw__onClickScreenReader) {
            document.removeEventListener('click',
                // @ts-expect-error - Retrieving custom property from window
                window.__asw__onClickScreenReader
            );
            // @ts-expect-error - Deleting custom property from window
            delete window.__asw__onClickScreenReader;
        }
        if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
        }
    }
}
