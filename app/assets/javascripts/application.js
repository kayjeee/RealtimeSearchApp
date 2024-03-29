  // Global variables
  const searchBox = $('#searchBox');
  const searchResultsDiv = $('#searchResults');
  const userLogTableBody = $('#userLogTableBody');
  let typingTimer;
  let incompleteSearches = [];

// With a standard page redirect
$('#trendsLink').on('click', function (e) {
window.location.href = '/trends';
});

   // Function to fetch and display search trends
  function fetchSearchTrends() {
    $.ajax({
      url: '/trends', // Updated to match the correct endpoint
      type: 'GET',
      success: function (data) {
        // Render search trends on the page
        renderSearchTrendsTable(data);
      },
      error: function (error) {
        console.error(`Error fetching search trends: ${error.statusText}`);
      }
    });
  }
  // Function to check if a string is a complete sentence
  function isCompleteSentence(sentence) {
    return sentence.trim().endsWith('.') || sentence.trim().endsWith('!') || sentence.trim().endsWith('?');
  }

  // Function to check for completeness using language processing (replace with actual implementation)
  function checkCompletenessUsingLanguageProcessing(sentence) {
    const minLengthForCompleteness = 10;
    const keywordsForCompleteness = ["how", "why"];

    const trimmedSentence = sentence.trim().toLowerCase();
    const endsWithPunctuation = /[.!?]$/.test(trimmedSentence);

    const isComplete =
      trimmedSentence.length >= minLengthForCompleteness &&
      (keywordsForCompleteness.some(keyword => trimmedSentence.includes(keyword)) || endsWithPunctuation);

    return isComplete;
  }

  // Function triggered on user input
  function handleSearch() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(sendSearchQuery, 15);
  }

  // Function to send search query
  function sendSearchQuery() {
    const searchQuery = searchBox.val().trim();

    if (searchQuery !== "") {
      // Analyze the search query for completeness
      const isComplete = isCompleteSentence(searchQuery);

      // Log the search query with completeness status
      const summary = isComplete ? "Complete" : "Incomplete";
      console.log(`User searched for: "${searchQuery}" (${summary})`);

      // Only log the searchQuery if it's a valid question
      if (isComplete) {
        logSearch(searchQuery);
      }

      // Update the previous search query and display regardless of completeness
      displaySearchResult(searchQuery);
    }
  }

  // Function to display search result
  function displaySearchResult(query) {
    searchResultsDiv.html(`<p>${query}</p>`);
  }

  // Function to log search on the backend
  function logSearch(query) {
    // Get the CSRF token from the meta tag
    const csrfToken = $('meta[name=csrf-token]').attr('content');

    // Include the CSRF token in the headers of the AJAX request
    $.ajax({
      url: '/search',
      type: 'POST',
      data: { query: query },
      headers: {
        'X-CSRF-Token': csrfToken
      },
      success: function (data) {
        // Check if data is defined and has the 'ip' property before extracting the IP address
        if (data && data.ip) {
          // Extract the IP address from the response and add to the user log table if the question is valid
          const ip = data.ip;
          // Check if the question is valid before adding it to the table
          if (isCompleteSentence(query)) {
            addToUserLogTable(ip, query);
          } else {
            console.log(`Invalid search query: "${query}"`);
          }
        } else {
          console.error(`Error: Invalid data received from the server`);
        }
      },
      error: function (error) {
        console.error(`Error logging search query: ${error.statusText}`);
      }
    });
  }

  // Function to add data to the user log table if the question is valid
  function addToUserLogTable(ip, query) {
    // Retrieve existing user log data from sessionStorage
    const existingUserLogData = JSON.parse(sessionStorage.getItem('userLogData')) || [];
    // Add the new entry to the user log data
    existingUserLogData.push({ ip, query });
    // Save the updated user log data to sessionStorage
    sessionStorage.setItem('userLogData', JSON.stringify(existingUserLogData));

    // Update the table with the new data
    renderUserLogTable(existingUserLogData);
  }

  // Function to render user log table
  function renderUserLogTable(userLogData) {
    userLogTableBody.empty(); // Clear the table body
    // Populate the table with the user log data
    userLogData.forEach(entry => {
      userLogTableBody.append(`<tr><td>${entry.ip}</td><td>${entry.query}</td></tr>`);
    });
  }

  // Check if there is user log data in sessionStorage and render the table
  const existingUserLogData = JSON.parse(sessionStorage.getItem('userLogData')) || [];
  renderUserLogTable(existingUserLogData);

  // Function to analyze search queries
  function analyzeSearchQuery(searchQuery) {
    if (isCompleteSentence(searchQuery)) {
      console.log(`User searched for: "${searchQuery}"`);
    } else {
      // Apply heuristic checks for completeness
      const isComplete = checkCompletenessUsingHeuristics(searchQuery);
      if (isComplete) {
        console.log(`User searched for: "${searchQuery}"`);
      } else {
        console.log(`Incomplete search query: "${searchQuery}"`);
        storeIncompleteSearch(searchQuery);
      }
    }
  }

  // Function to check for completeness using heuristics
  function checkCompletenessUsingHeuristics(sentence) {
    const minLengthForCompleteness = 10;
    const keywordsForCompleteness = ["how", "why", "what", "where", "when"];

    const trimmedSentence = sentence.trim().toLowerCase();

    if (trimmedSentence.length >= minLengthForCompleteness) {
      return keywordsForCompleteness.some(keyword => trimmedSentence.includes(keyword));
    }

    return false;
  }

  // Function to store incomplete searches for summarization
  function storeIncompleteSearch(searchQuery) {
    incompleteSearches.push(searchQuery);
    // Periodically summarize incomplete searches (e.g., every 5 seconds)
    setTimeout(summarizeIncompleteSearches, 5000);
  }

  // Function to summarize incomplete searches
  function summarizeIncompleteSearches() {
    // Check if there are any incomplete searches stored
    if (incompleteSearches.length > 0) {
      // Loop through each incomplete search query
      incompleteSearches.forEach((searchQuery) => {
        // Check completeness using heuristics
        const isComplete = checkCompletenessUsingHeuristics(searchQuery);
        // Determine completeness status for logging
        const summary = isComplete ? "Complete" : "Incomplete";
        // Log the search query with completeness status
        if (isComplete) {
          console.log(`User searched for: "${searchQuery}" (${summary})`);
          // Log the complete search query on the backend
          logSearch(searchQuery);
        } else {
          console.log(`User searched for: "${searchQuery}" (${summary})`);
          // Store the incomplete search query for later processing
          storeIncompleteSearch(searchQuery);
          logSearch(summary);
        }
      });

      // Summarize incomplete searches
      const summary = summarizeText(incompleteSearches.join(" "));
      incompleteSearches = [];
      console.log(`Summary of incomplete searches: ${summary}`);
    }
  }

  // Placeholder function for text summarization (replace with actual implementation)
  function summarizeText(text) {
    return text.substring(0, 50);
  }

  // Example usage
  const userSearches = [
    "how to learn JavaScript.",
    "best programming courses",
    "JavaScript frameworks",
    "machine learning tutorials?"
  ];

  // Summarize searches and check completeness using the enhanced heuristic
  for (const searchQuery of userSearches) {
    const isComplete = checkCompletenessUsingLanguageProcessing(searchQuery);
    const summary = isComplete ? "Complete" : "Incomplete";
    console.log(`User searched for: "${searchQuery}" (${summary})`);
  }

  // Inside your existing script

// Function to fetch and display user logs
function fetchUserLogs() {
$.ajax({
  url: '/user_logs',
  type: 'GET',
  success: function (data) {
    // Render user logs on the page
    renderUserLogTable(data);
  },
  error: function (error) {
    console.error(`Error fetching user logs: ${error.statusText}`);
  }
});
}

// Call fetchUserLogs on page load
$(document).ready(function () {
fetchUserLogs();
});
