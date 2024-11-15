// Toggle chat popup visibility
document.getElementById("chatbot-button").addEventListener("click", () => {
    document.getElementById("chatbot-popup").classList.toggle("hidden");
    document.getElementById("greeting-screen").classList.add("hidden");
    document.getElementById("chat-window").classList.remove("hidden");
    document.getElementById("employee-selection").classList.add("hidden");
  
    // Show chat window with any existing messages or an empty background
    if (document.getElementById("chat-output").children.length === 0) {
      document.getElementById("chat-window").style.backgroundColor = "#fff";
    }
  });
  
  // Close chat popup
  document.getElementById("close-chat").addEventListener("click", () => {
    document.getElementById("chatbot-popup").classList.add("hidden");
  });
  
  // Add event listeners to quick action buttons
  document.querySelectorAll(".quick-action-button").forEach(button => {
    button.addEventListener("click", () => {
      document.getElementById("greeting-screen").classList.add("hidden");
      document.getElementById("chat-window").classList.remove("hidden");
      addMessage(button.textContent, "user-message");
      sendMessageToAPI(button.textContent);
    });
  });
  
  // Add event listener for the send button and "Enter" key
document.getElementById("send-button").addEventListener("click", handleSendMessage);
document.getElementById("user-input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevents form submission if inside a form
    handleSendMessage();
  }
});

function handleSendMessage() {
  const userInput = document.getElementById("user-input").value.trim();
  if (!userInput) return;

  addMessage(userInput, "user-message");
  document.getElementById("user-input").value = "";

  // Check for specific command
  if (userInput.toLowerCase() === "take me to finance") {
    changeIframeURL("https://my300187.s4hana.ondemand.com/ui#Launchpad-openFLPPage?pageId=ZSE_SP_DEMO_BUILD&spaceId=ZSE_SP_DEMO_BUILD"); // Replace with your actual finance URL
  } else if (userInput.toLowerCase() === "take me home")  {
    changeIframeURL("https://my300187.s4hana.ondemand.com/ui#Shell-home"); // Replace with your actual finance URL
  } else {
    sendMessageToAPI(userInput);
  }
}

// Function to change the URL of the iframe
function changeIframeURL(url) {
  const iframe = document.getElementById("content-iframe"); // Ensure you have an iframe with this ID
  if (iframe) {
    iframe.src = url;
    addMessage("Navigating to the requested page.", "bot-message", true);
  }
}
  
  // Adds messages to the chat output, with optional formatting for bot messages
  function addMessage(text, className, isBot = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = className;
  
    // Format bot messages if `isBot` is true
    messageDiv.innerHTML = isBot ? formatResponse(text) : text;
  
    document.getElementById("chat-output").appendChild(messageDiv);
    document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight;
  }
  
  // Formats bot responses for better readability
  function formatResponse(text) {
    return text
      .replace(/###\s(.+?)(?=\n|$)/g, "<h4>$1</h4>") // Headers marked with "###"
      .replace(/(\d+\.)\s/g, "<br><strong>$1</strong> ") // Numbered list (e.g., "1. ")
      .replace(/(\d+\.\d+)\s/g, "<br>&nbsp;&nbsp;<strong>$1</strong> ") // Sub-numbered steps (e.g., "1.1")
      .replace(/-\s/g, "<br>&bull; ") // Bullet points (e.g., "- item")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text (e.g., "**text**")
      .replace(/(?:\r\n|\r|\n)/g, "<br>"); // Newline characters to <br>
  }
  
  // Sends the message to the API and handles the response
  async function sendMessageToAPI(message) {
    showThinkingMessage();
  
    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
  
      removeThinkingMessage();
      addMessage(data.reply, "bot-message", true); // `true` for bot formatting
  
      // Show employee selection if required in the response
      if (data.reply.includes("Is this position similar to the position of one of your direct reports?")) {
        document.getElementById("employee-selection").classList.remove("hidden");
      } else {
        document.getElementById("employee-selection").classList.add("hidden");
      }
    } catch (error) {
      console.error("Error:", error);
      removeThinkingMessage();
      addMessage("Sorry, there was an error processing your request.", "bot-message");
    }
  }
  
  // Show "Thinking..." animation
  function showThinkingMessage() {
    const thinkingMessage = document.createElement("div");
    thinkingMessage.className = "thinking-message";
    thinkingMessage.id = "thinking-message";
    thinkingMessage.innerHTML = 'Thinking<span class="dots"></span>';
    document.getElementById("chat-output").appendChild(thinkingMessage);
    document.getElementById("chat-window").scrollTop = document.getElementById("chat-window").scrollHeight;
  }
  
  // Remove "Thinking..." animation
  function removeThinkingMessage() {
    const thinkingMessage = document.getElementById("thinking-message");
    if (thinkingMessage) {
      thinkingMessage.remove();
    }
  }
  