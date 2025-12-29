console.log("Disable Amazon Rufus extension loaded.");

const STYLE_ID = 'disable-amazon-rufus-style';
const RUFUS_SELECTOR = '.rufus-panel-container';

// CSS to hide the element
// Using !important to override inline styles
const CSS_RULES = `
  ${RUFUS_SELECTOR} {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    height: 0 !important;
    width: 0 !important;
    pointer-events: none !important;
    overflow: hidden !important;
    position: absolute !important;
    z-index: -9999 !important;
  }
`;

// Function to inject or remove styles
function updateState(isEnabled) {
    const existingStyle = document.getElementById(STYLE_ID);

    if (isEnabled) {
        if (!existingStyle) {
            const style = document.createElement('style');
            style.id = STYLE_ID;
            style.textContent = CSS_RULES;
            (document.head || document.documentElement).appendChild(style);
            console.log('Amazon Rufus hidden.');
        }
    } else {
        if (existingStyle) {
            existingStyle.remove();
            console.log('Amazon Rufus shown.');
        }
    }
}

// Initialize state
chrome.storage.sync.get(['enabled'], function(result) {
    // Default to true if not set
    const isEnabled = result.enabled !== undefined ? result.enabled : true;
    updateState(isEnabled);
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "toggle") {
        updateState(request.enabled);
    }
});
