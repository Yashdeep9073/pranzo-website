<template>
  <div class="bottom-footer py-8">
    <div class="container container-lg">
      <div class="bottom-footer__inner flex-between flex-wrap gap-16 py-16 border-top border-neutral-50">
<p class="bottom-footer__text text-heading wow fadeInLeft fw-medium">
  Copyright &copy; 
  <span class=" fw-semibold">2025 </span> &nbsp;
  <span class="fw-semibold text-gradient">
    Vibrantick Infotech Solutions
  </span>
.
</p>
       <div class="flex-align gap-8 flex-wrap wow fadeInRight">
  <ul class="flex-align gap-16 social-icons">
    
    <!-- Facebook -->
    <li>
      <a 
        href="https://www.facebook.com/vibranticksolutions"
        target="_blank"
        class="social-icon facebook"
        aria-label="Facebook"
      >
        <i class="ph-fill ph-facebook-logo"></i>
      </a>
    </li>

    <!-- Instagram -->
    <li>
      <a 
        href="https://www.instagram.com/vibrantickinfotech/"
        target="_blank"
        class="social-icon instagram"
        aria-label="Instagram"
      >
        <i class="ph-fill ph-instagram-logo"></i>
      </a>
    </li>

    <!-- LinkedIn -->
    <li>
      <a 
        href="https://www.linkedin.com/company/vibrantick-infotech-solutions/"
        target="_blank"
        class="social-icon linkedin"
        aria-label="LinkedIn"
      >
        <i class="ph-fill ph-linkedin-logo"></i>
      </a>
    </li>

  </ul>
</div>

      </div>
    </div>
  </div>
</template>

<script setup>
// No additional script logic needed for this static bottom footer section.
// WOW.js animations will work if WOW plugin is initialized globally in Nuxt.
</script>

<style scoped>
  .social-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffffff;
  font-size: 20px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  transition: all 0.35s ease;
}

/* Facebook */
.social-icon.facebook {
  color: #1877f2;
}
.social-icon.facebook:hover {
  background: #1877f2;
  color: #fff;
  transform: translateY(-4px);
}

/* Instagram (gradient look) */
.social-icon.instagram {
  color: #e1306c;
}
.social-icon.instagram:hover {
  background: linear-gradient(45deg,#f58529,#dd2a7b,#8134af,#515bd4);
  color: #fff;
  transform: translateY(-4px);
}

/* LinkedIn */
.social-icon.linkedin {
  color: #0a66c2;
}
.social-icon.linkedin:hover {
  background: #0a66c2;
  color: #fff;
  transform: translateY(-4px);
}

  .text-gradient {
  background: linear-gradient(90deg, #c1ac24, #0342e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Scoped styles if any overrides needed; global CSS already handles classes. */
</style>