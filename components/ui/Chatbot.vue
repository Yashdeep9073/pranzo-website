<template>
  <!-- Floating Chat Icon -->
  <div class="chatbot-icon" @click.stop="toggleChat">
    💬
      <span v-if="showHey" class="chatbot-hey">Hey 👋</span>

  </div>

  <!-- Chat Window -->
  <div 
    v-if="open"
    class="chatbot-window"
    ref="chatbox"
    @click.stop
  >
    <!-- Header -->
    <div class="chatbot-header">
      <span>Chat Support</span>
      <span class="close" @click="open = false">✖</span>
    </div>

    <!-- Demo Questions -->
    <div class="chatbot-quick-questions">
      <span
        v-for="(q, index) in demoQuestions"
        :key="index"
        @click="handleQuickQuestion(q)"
      >
        {{ q }}
      </span>
    </div>

    <!-- Messages -->
    <div class="chatbot-messages" ref="messageBox">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['message', msg.from]"
      >
        {{ msg.text }}
      </div>
    </div>

    <!-- Input -->
    <div class="chatbot-input">
      <input
        v-model="input"
        placeholder="Type your message..."
        @keydown.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";

/* ---------- STATE ---------- */
const open = ref(false);
const input = ref("");
const waitingFor = ref(null);
const showHey = ref(false);
let startTimeout = null;
let toggleInterval = null;
let stopTimeout = null;
const messages = ref([
  { from: "bot", text: "Hi 👋 How can I help you?" }
]);

/* ---------- DEMO QUESTIONS ---------- */
const demoQuestions = [
  "Where is my order?",
  "Track my order",
  "I want to return my order",
  "Refund status",
  "Any offers available?"
];

/* ---------- REFS ---------- */
const chatbox = ref(null);
const messageBox = ref(null);

/* ---------- HELPERS ---------- */
const normalizeText = (text) => text.toLowerCase().trim();

const randomOrderStatus = () => {
  const statuses = [
    " Your order is confirmed and being packed.",
    " Your order has been dispatched.",
    " Your order is out for delivery.",
    " Your order has been delivered.",
    " Your order will be delivered by tomorrow."
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const randomRefundStatus = () => {
  const statuses = [
    " Your refund has been initiated.",
    " Refund is under process.",
    " Refund completed successfully.",
    " Refund will reflect in 2–3 days."
  ];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

/* ---------- BOT LOGIC ---------- */
const getBotReply = (text) => {
  // f bot is waiting for something
  if (waitingFor.value === "orderId") {
    waitingFor.value = null;
    return randomOrderStatus();
  }

  if (waitingFor.value === "refundId") {
    waitingFor.value = null;
    return randomRefundStatus();
  }

  //  Normal intent detection
  if (text.includes("order") || text.includes("track")) {
    waitingFor.value = "orderId";
    return " Please share your Order ID.";
  }

  if (text.includes("return")) {
    waitingFor.value = "orderId";
    return " Please share your Order ID for return.";
  }

  if (text.includes("refund")) {
    waitingFor.value = "refundId";
    return " Please share your Order ID to check refund status.";
  }

  if (text.includes("offer") || text.includes("discount")) {
    return " Big Sale Live! Up to 40% off on selected items.";
  }

  if (text.includes("hello") || text.includes("hi")) {
    return "Hello  How can I help you today?";
  }

  return " Sorry, I didn’t understand. Please try another question.";
};

/* ---------- ACTIONS ---------- */
const toggleChat = () => {
  open.value = !open.value;
  if (open.value) scrollToBottom();
};

const sendMessage = () => {
  if (!input.value.trim()) return;

  const rawText = input.value;
  const text = normalizeText(rawText);

  messages.value.push({ from: "user", text: rawText });
  scrollToBottom();

  const reply = getBotReply(text);

  setTimeout(() => {
    messages.value.push({ from: "bot", text: reply });
    scrollToBottom();
  }, 400);

  input.value = "";
};

const handleQuickQuestion = (q) => {
  input.value = q;
  sendMessage();
};

/* ---------- SCROLL ---------- */
const scrollToBottom = async () => {
  await nextTick();
  if (messageBox.value) {
    messageBox.value.scrollTop = messageBox.value.scrollHeight;
  }
};

/* ---------- OUTSIDE CLICK ---------- */
const handleOutsideClick = (event) => {
  if (chatbox.value && !chatbox.value.contains(event.target)) {
    open.value = false;
  }
};

/* ---------- LIFECYCLE (SSR SAFE) ---------- */
onMounted(() => {
      if (!process.client) return;
if (!process.client) return;

  //  Start after 30 seconds
  startTimeout = setTimeout(() => {
    showHey.value = true;

    // Toggle every 30 seconds
    toggleInterval = setInterval(() => {
      showHey.value = !showHey.value;
    }, 10 * 1000); 

    stopTimeout = setTimeout(() => {
      showHey.value = false;
      clearInterval(toggleInterval);
    }, 4 * 60 * 1000);

  }, 3 * 1000);
});

// onBeforeUnmount(() => {
//   if (!process.client) return;
 
//   if (process.client) {
//     document.addEventListener("click", handleOutsideClick);
//   }
// });

onBeforeUnmount(() => {
      if (process.client) {
    document.removeEventListener("click", handleOutsideClick);
  }
     clearTimeout(startTimeout);
  clearTimeout(stopTimeout);
  clearInterval(toggleInterval);

});
</script>


<style scoped>
/* ---------- FLOATING ICON ---------- */
.chatbot-hey {
  position: absolute;
  right: 65px;
  bottom: 50%;
  transform: translateY(50%);
  background: #ffffff;
  color: rgb(4, 138, 174);
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 16px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  animation: fadeIn 0.3s ease;
}

/* Small arrow */
/* .chatbot-hey::after {
  content: "";
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: transparent transparent transparent #020617;
} */

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(50%) translateX(5px);
  }
  to {
    opacity: 1;
    transform: translateY(50%) translateX(0);
  }
}

.chatbot-icon {
  position: fixed;
  right: 20px;
  margin-bottom: 40px;
  bottom: calc(20px + env(safe-area-inset-bottom));
  width: 56px;
  height: 56px;
background: linear-gradient( 
  135deg,
  #8922c5,  
  #026793,   
  #555555   
);

  color: white;
  border-radius: 50%;
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10000;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
}


/* ---------- CHAT WINDOW ---------- */
.chatbot-window {
  position: fixed;
  right: 20px;
  bottom: calc(90px + env(safe-area-inset-bottom));
  width: 320px;
  height: 420px;
  background: #fff;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  z-index: 10000;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3);
}

/* ---------- HEADER ---------- */
.chatbot-header {
  background: #4f46e5;
  color: white;
  padding: 10px 12px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  border-radius: 14px 14px 0 0;
}

.close {
  cursor: pointer;
}

/* ---------- QUICK QUESTIONS ---------- */
.chatbot-quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px;
  border-bottom: 1px solid #eee;
}

.chatbot-quick-questions span {
  background: #eef2ff;
  color: #3730a3;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 6px;
  cursor: pointer;
}

/* ---------- MESSAGES ---------- */
.chatbot-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.message {
  max-width: 80%;
  margin-bottom: 8px;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 14px;
}

.message.user {
  background: #4f46e5;
  color: white;
  margin-left: auto;
}

.message.bot {
  background: #f1f1f1;
  color: #333;
}

/* ---------- INPUT ---------- */
.chatbot-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
}

.chatbot-input input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.chatbot-input button {
  margin-left: 6px;
  padding: 6px 10px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
