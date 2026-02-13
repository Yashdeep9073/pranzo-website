<template>
  <section class="order-success">
    <div class="card">
      <!-- Success Icon -->
      <div class="icon-wrapper">
        <i class="ph ph-check-circle"></i>
      </div>

      <!-- Title -->
      <h1 class="title">Order Confirmed 🎉</h1>

      <!-- Message -->
      <p class="message">
        Thank you for your purchase!  
        Your payment was successful and your order is now being processed.
      </p>

      <!-- Order Details -->
      <div class="details">
        <div class="detail-row">
          <span>Order ID</span>
          <strong>#{{ orderId }}</strong>
        </div>

        <div class="detail-row">
          <span>Total Paid</span>
          <strong>₹{{ total }}</strong>
        </div>

        <div class="detail-row">
          <span>Payment Status</span>
          <strong class="success">Paid</strong>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <NuxtLink to="/" class="btn primary">
          Continue Shopping
        </NuxtLink>

        <NuxtLink to="/orders" class="btn outline">
          View My Orders
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const orderId = route.query.orderId || 'N/A'
const total = route.query.total || '0.00'
</script>

<style scoped>
.order-success {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  padding: 20px;
}

.card {
  background: #fff;
  max-width: 480px;
  width: 100%;
  padding: 40px 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.icon-wrapper {
  font-size: 72px;
  color: #16a34a;
  margin-bottom: 16px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #111827;
}

.message {
  font-size: 15px;
  color: #6b7280;
  margin-bottom: 28px;
  line-height: 1.6;
}

.details {
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 28px;
  text-align: left;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.success {
  color: #16a34a;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.3s;
}

.btn.primary {
  background: #3b82f6;
  color: #fff;
}

.btn.primary:hover {
  background: #2563eb;
}

.btn.outline {
  border: 1px solid #d1d5db;
  color: #111827;
}

.btn.outline:hover {
  background: #f3f4f6;
}
</style>
