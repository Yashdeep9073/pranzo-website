<template>
  <div class="mobile-search-wrapper" @click="openMobileSearch">
    <!-- Search Icon -->
    <span class="icon left">
      <i class="ph ph-magnifying-glass"></i>
    </span>

    <!-- Placeholder -->
    <span class="placeholder">
      What are you looking for?
    </span>

    <!-- Scan Icon -->
    <span class="icon right">
      <i class="ph ph-scan"></i>
    </span>
  </div>
</template>

<script setup>
const openMobileSearch = () => {
  console.log('Open mobile search modal / page')
  
}
</script>
<style scoped>
.mobile-search-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;

  background: #f1f1f1;
  border-radius: 12px;

  height: 44px;
  padding: 0 12px;

  cursor: pointer;
  user-select: none;
}

/* Placeholder text */
.mobile-search-wrapper .placeholder {
  flex: 1;
  font-size: 14px;
  color: #9aa0a6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Icons */
.mobile-search-wrapper .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #9aa0a6;
}

.mobile-search-wrapper .icon.right {
  border-left: 1px solid #ddd;
  padding-left: 10px;
}

/* Hover / active */
.mobile-search-wrapper:active {
  background: #e6e6e6;
}
@media (max-width: 325px) {
  .mobile-search-wrapper {
    height: 40px;
    padding: 0 10px;
  }

  .mobile-search-wrapper .placeholder {
    font-size: 13px;
  }
}

</style>
