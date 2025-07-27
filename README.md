# Yemeksepeti Recommender

## About the Project

**Yemeksepeti Restaurant Recommender** is a Chrome extension that helps users find the best restaurant on the Yemeksepeti website based on their preferences using AI-powered recommendations.

The extension dynamically scrapes restaurant data from Yemeksepeti, analyzes it with modern AI models according to user preferences, and presents tailored restaurant suggestions to improve user experience by making quick and informed decisions.

## Features

- Real-time scraping of restaurant data such as names, ratings, and delivery times
- AI-powered personalized recommendations using Google Gemini model
- User-friendly popup interface for inputting preferences and receiving suggestions
- Built with Chrome Extension Manifest V3 for enhanced security and performance

## Technologies Used

- JavaScript, HTML, CSS
- Chrome Extensions API (Manifest V3)
- Google Gemini AI Model API
- Fetch API 

## Installation and Usage

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the project folder.
5. Navigate to the Yemeksepeti website.
6. Click the extension icon, enter your preferences, and get personalized restaurant recommendations.

## File Structure

- `background.js` – Background service worker handling data storage and AI calls.
- `content.js` – Content script scraping restaurant data from the webpage.
- `popup.html` – Popup UI displayed when clicking the extension icon.
- `popup.js` – Handles user input, communicates with AI, and updates the popup UI.
- `manifest.json` – Extension configuration file.

## Example

When a user enters preferences such as "fast delivery and low-cost burger restaurants," the extension will recommend the most suitable restaurant with key details.

Example output:

 Based on your preferences, I recommend McDonald's.

- Offers fast delivery.

- Low delivery fees.

- Wide variety of burger options.
