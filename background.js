let productData = [];

// Listen for messages from content or popup scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "storeData") {
    productData = message.data;
  }

  if (message.action === "getRecommendations") {
    // Send the user query and scraped data to the backend AI
    fetch('http://localhost:5000/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: message.query,
        data: productData
      })
    })
    .then(response => response.json())
    .then(result => {
      // Send the results back to the popup to display
      chrome.runtime.sendMessage({ action: "displayResults", results: result.recommendations });
    });
  }
});
