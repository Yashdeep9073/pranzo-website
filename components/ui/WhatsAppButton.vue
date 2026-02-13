<template>
  <!-- Floating WhatsApp Icon -->
  <div class="whatsapp-icon" @click="toggle">
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" />
  </div>

  <!-- WhatsApp Window -->
  <div v-if="open" class="whatsapp-window">
    <div class="headerr">
      <span>WhatsApp Support</span>
      <span class="close" @click="open = false">✖</span>
    </div>

    <div class="body">
      <p>Hi 👋</p>
      <p>Click below to chat with our support team on WhatsApp.</p>

      <a :href="whatsappLink" target="_blank" class="whatsapp-btn">
        Continue on WhatsApp
      </a>

      <small>Typically replies in a few minutes</small>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const open = ref(false);

const phone = "8219773546";
const message = "Hi, I need help with my order.";

const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(
  message 
)}`;

const toggle = () => {
  open.value = !open.value;
};
</script>

<style scoped>
.whatsapp-icon {
  position: fixed;
  left: 20px;
  bottom: calc(60px + env(safe-area-inset-bottom));
  width: 56px;
  height: 56px;
  background: #25d366;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10000;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
}

.whatsapp-icon img {
  width: 26px;
}

.whatsapp-window {
  position: fixed;
  left: 16px;
  bottom: calc(88px + env(safe-area-inset-bottom));
  width: 100%;
  max-width: 320px;      
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  overflow: hidden;    
}


.headerr { 
  background: linear-gradient(135deg, #25d366, #16a34a);
  color: white;
  padding: 12px 14px;
  font-weight: 600;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap;
}


.body {
  padding: 14px;
  font-size: 14px;
  line-height: 1.5;
  color: #1f2937;
  word-wrap: break-word;
}


.whatsapp-btn {
  display: block;
  width: 100%;
  background: #25d366;
  color: white;
  text-align: center;
  padding: 12px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  margin: 12px 0;
  white-space: nowrap;
}


.body small {
  display: block;
  margin-top: 6px;
  color: #6b7280;
  font-size: 12px;
}

@media (max-width: 420px) {
  .whatsapp-window {
    left: 12px;
    right: 12px;
    width: auto;
    max-width: none;
  }
}


</style>
