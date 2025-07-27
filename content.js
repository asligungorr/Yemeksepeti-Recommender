console.log('Content script is running on:', window.location.href);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('Message received in content script:', request);
  if (request.action === "getRestaurantData") {
    const restaurants = [];
    
    // Target the specific class for restaurant names
    const restaurantElements = document.querySelectorAll('.vendor-name');
    
    console.log('Found restaurant elements:', restaurantElements.length);
    
    restaurantElements.forEach((element, index) => {
      const restaurantCard = element.closest('.restaurant-card'); // Assuming there's a parent element with this class
      
      const restaurant = {
        name: element.textContent.trim(),
        rating: restaurantCard?.querySelector('.vendor-rating')?.textContent.trim(),
        deliveryTime: restaurantCard?.querySelector('.delivery-time')?.textContent.trim(),
        // Add more fields as necessary
      };
      
      console.log(`Restaurant ${index + 1}:`, restaurant);
      
      if (restaurant.name) {
        restaurants.push(restaurant);
      }
    });

    console.log('Scraped restaurants:', restaurants);
    
    sendResponse({restaurants: restaurants});
  }
  return true; // Keeps the message channel open for async response
});