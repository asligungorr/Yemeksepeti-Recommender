document.addEventListener('DOMContentLoaded', function() {
  console.log('Popup script loaded');

  const chatbox = document.getElementById('chatbox');
  const userInput = document.getElementById('userInput');
  const sendButton = document.getElementById('sendButton');

  if (!chatbox || !userInput || !sendButton) {
    console.error('One or more required elements not found in the DOM');
    return;
  }

  let restaurants = [];
  let conversationHistory = [];

  function addMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.textContent = message;
    chatbox.appendChild(messageElement);
    chatbox.scrollTop = chatbox.scrollHeight;
    conversationHistory.push({role: sender === 'user' ? 'user' : 'model', parts: [{text: message}]});
  }

  async function getRestaurantData() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log('Current tab:', tabs[0].url);
        
        chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          files: ['content.js']
        }, () => {
          if (chrome.runtime.lastError) {
            console.error('Script injection error:', chrome.runtime.lastError);
            reject("Error: Could not inject script. Please make sure you're on a Yemeksepeti page.");
            return;
          }
          
          chrome.tabs.sendMessage(tabs[0].id, {action: "getRestaurantData"}, function(response) {
            console.log('Received response from content script:', response);
            if (chrome.runtime.lastError) {
              console.error('Runtime error:', chrome.runtime.lastError);
              reject("An error occurred. Please try again.");
              return;
            }
            if (response && response.restaurants && response.restaurants.length > 0) {
              console.log('Restaurants found:', response.restaurants.length);
              resolve(response.restaurants);
            } else {
              console.log('No restaurants found in the response');
              reject("No restaurants found. Please make sure you're on a Yemeksepeti search results page and that the page has fully loaded.");
            }
          });
        });
      });
    });
  }


  async function getAIResponse(userMessage) {
    console.log('Getting recommendation for:', {restaurants, userPreferences});
    const API_KEY = 'şifree';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

    
    const systemPrompt = `Given these restaurants: ${JSON.stringify(restaurants)} and user preferences: "${userPreferences}", recommend the best restaurant that matches the user's criteria. Focus on the most relevant restaurant rather than listing multiple options. Structure your response as follows:

          1. Start with "Based on your preferences for [list key preferences], I recommend [Restaurant Name]."
          2. Provide 2-3 bullet points explaining why this restaurant is the best match, focusing on the user's specific preferences.
          3. Include relevant details such as rating, delivery time, and delivery cost.
          4. If there's a close second choice, briefly mention it at the end.

          Ensure the response is concise yet informative, similar to this example:

          Based on your preferences for express delivery and low delivery cost, as well as your desire for a burger restaurant, I recommend McDonald's. Here's why:
          • Express delivery: McDonald's offers express delivery, ensuring your food arrives quickly.
          • Low delivery cost: They provide free delivery, saving you money on delivery fees.
          • Burger specialty: As a well-known burger restaurant, they offer a wide variety of burger options.
          
          McDonald's also has a solid rating of 3.1 out of 5, indicating generally positive customer experiences. Their estimated delivery time is 30-45 minutes.

          If McDonald's doesn't appeal to you, KFC could be a good alternative, also offering express delivery and free delivery costs, with a focus on fried chicken and some burger options.`
     
    
          const requestBody = {
            contents: [
              {
                role: 'user',
                parts: [{text: systemPrompt}]
              },
              ...conversationHistory,
              {
                role: 'user',
                parts: [{text: userMessage}]
              }
            ],
            generationConfig: {
              temperature: 0.5,
              topK: 30,
              topP: 0.9,
              maxOutputTokens: 256,
            },
       
          };
      
          try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestBody)
            });
      
            if (!response.ok) {
              console.error('API response error:', response.statusText);
              return `Error: API response failed with status ${response.status}. ${response.statusText}`;
            }
        
            const data = await response.json();
            if (data.candidates && data.candidates.length > 0) {
              return data.candidates[0].content.parts[0].text;
            } else {
              console.error('No valid response data:', data);
              return 'Error: No valid response data from the AI.';
            }
          } catch (error) {
            console.error('Error:', error);
            return 'An error occurred while getting the AI response. Please check your API key and try again.';
          }
        }

  async function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (userMessage) {
      addMessage('user', userMessage);
      userInput.value = '';

      addMessage('bot', 'Thinking...');

      // Treat the user message itself as their preferences
      userPreferences = userMessage;

      try {
        if (restaurants.length === 0) {
          restaurants = await getRestaurantData();
        }
        const aiResponse = await getAIResponse(userMessage);
        chatbox.removeChild(chatbox.lastChild); // Remove "Thinking..." message
        addMessage('bot', aiResponse);
      } catch (error) {
        chatbox.removeChild(chatbox.lastChild); // Remove "Thinking..." message
        addMessage('bot', error.toString());
      }
    }
  }

  sendButton.addEventListener('click', handleUserInput);

  userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  });

  // Initial greeting
  addMessage('bot', 'Hello! I can help you find the best restaurant from Yemeksepeti based on your preferences. What kind of food are you looking for, and do you have any specific requirements like fast delivery or low costs?');
});
