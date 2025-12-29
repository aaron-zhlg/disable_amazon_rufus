document.addEventListener('DOMContentLoaded', function() {
  const toggle = document.getElementById('toggle');
  const statusText = document.getElementById('status-text');

  function updateStatusText(isChecked) {
      statusText.textContent = isChecked ? "Rufus is hidden" : "Rufus is visible";
      statusText.style.color = isChecked ? "#007600" : "#d00"; // Green for hidden (good), Red for visible
  }

  // Load saved state
  chrome.storage.sync.get(['enabled'], function(result) {
    if (result.enabled !== undefined) {
      toggle.checked = result.enabled;
    } else {
        // Default to true
        toggle.checked = true;
    }
    updateStatusText(toggle.checked);
  });

  // Save state on change
  toggle.addEventListener('change', function() {
    const isEnabled = toggle.checked;
    updateStatusText(isEnabled);
    
    chrome.storage.sync.set({enabled: isEnabled}, function() {
      // Send message to content script to update immediately
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "toggle", enabled: isEnabled});
        }
      });
    });
  });
});
