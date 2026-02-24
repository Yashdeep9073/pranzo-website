<template>
  <section class="terms py-80">
    <div class="container container-lg">
      <!-- Page Header with Background -->
      <div class="terms-header mb-60">
        <div class="header-bg"></div>
        <div class="header-content text-center">
          <div class="header-icon mb-20">
            <i class="ph ph-shield-check"></i>
          </div>
          <h1 class="page-title mb-20">Terms of Use</h1>
          <div class="header-meta">
            <span class="meta-badge">
              <i class="ph ph-calendar"></i>
              Last updated: {{ new Date().toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Terms Content with Enhanced Cards -->
      <div class="terms-wrapper">
        <!-- Section 1 -->
        <div class="terms-section mb-32" data-aos="fade-up" data-aos-delay="100">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-handshake"></i>
            </div>
            <h2 class="section-title">1. Acceptance of Terms</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              By accessing and using Kartmania ("the Website"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>
        </div>

        <!-- Section 2 -->
        <div class="terms-section mb-32" data-aos="fade-up" data-aos-delay="200">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-lock"></i>
            </div>
            <h2 class="section-title">2. Privacy Policy</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              Your use of our Website is also governed by our Privacy Policy, which can be found 
              <NuxtLink to="/privacy" class="text-link">here</NuxtLink>. 
              Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
            </p>
          </div>
        </div>

        <!-- Section 3 -->
        <div class="terms-section mb-32" data-aos="fade-up" data-aos-delay="300">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-user-check"></i>
            </div>
            <h2 class="section-title">3. Eligibility</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              By using this Site, you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these terms. If you are under 18, you may use this service only with the involvement of a parent or guardian.
            </p>
          </div>
        </div>

        <!-- Section 4 -->
        <div class="terms-section mb-32" data-aos="fade-up" data-aos-delay="400">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-shopping-bag"></i>
            </div>
            <h2 class="section-title">4. Products and Services</h2>
          </div>
          <div class="section-content">
            <div class="subsection mb-20">
              <div class="subsection-header">
                <h3 class="subsection-title">4.1. Product Information</h3>
              </div>
              <p class="section-text">
                We strive to be as accurate as possible in the description of our products. However, we do not warrant that product descriptions, colors, information, or other content of the Site are accurate, complete, reliable, current, or error-free.
              </p>
            </div>
            <div class="subsection">
              <div class="subsection-header">
                <h3 class="subsection-title">4.2. Pricing</h3>
              </div>
              <p class="section-text">
                Prices for our products are subject to change without notice. We reserve the right to modify or discontinue a product at any time. We are not liable to you or to any third-party for any modification, price change, suspension, or discontinuance of a product.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 5 -->
        <div class="terms-section mb-32" data-aos="fade-up" data-aos-delay="500">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-credit-card"></i>
            </div>
            <h2 class="section-title">5. Orders and Payment</h2>
          </div>
          <div class="section-content">
            <div class="subsection mb-20">
              <div class="subsection-header">
                <h3 class="subsection-title">5.1. Order Acceptance</h3>
              </div>
              <p class="section-text">
                We reserve the right to refuse or cancel any order for any reason at any time. This may be due to product availability, errors in the description or price of the product, error in your order, or other reasons.
              </p>
            </div>
            <div class="subsection">
              <div class="subsection-header">
                <h3 class="subsection-title">5.2. Payment Methods</h3>
              </div>
              <p class="section-text">
                We accept various payment methods including credit/debit cards, UPI, and other digital payment options. All payment information is encrypted and secure.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 6 -->
        <div class="terms-section mb-32" data-aos="fade-up" data-aos-delay="600">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-truck"></i>
            </div>
            <h2 class="section-title">6. Shipping and Delivery</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              Delivery times are estimates and cannot be guaranteed. We are not liable for any delays in shipments. Risk of loss and title for all merchandise ordered on this Site pass to you when the merchandise is delivered to the shipping carrier.
            </p>
          </div>
        </div>

        <!-- Section 7 -->
        <div class="terms-section mb-32" data-aos="fade-up" data-aos-delay="700">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-arrow-counter-clockwise"></i>
            </div>
            <h2 class="section-title">7. Returns and Refunds</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              Our return policy is outlined on our 
              <NuxtLink to="/returns" class="text-link">Returns & Refunds</NuxtLink> page. 
              Please review this policy before making a purchase.
            </p>
          </div>
        </div>

        <!-- Section 8 -->
        <div class="terms-section mb-32" data-aos="fade-up" data-aos-delay="800">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-copyright"></i>
            </div>
            <h2 class="section-title">8. Intellectual Property</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              All content included on this Site, such as text, graphics, logos, images, digital downloads, and data compilations, is the property of Kartmania or its content suppliers and protected by international copyright laws.
            </p>
          </div>
        </div>

        <!-- Section 9 -->
        <div class="terms-section mb-32" data-aos="fade-up" data-aos-delay="900">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-shield-warning"></i>
            </div>
            <h2 class="section-title">9. User Conduct</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              You may not use our products for any illegal or unauthorized purpose. You may not use the Site in a way that could damage, disable, or impair the Site, or interfere with any other party's use of the Site.
            </p>
          </div>
        </div>

        <!-- Section 10 -->
        <div class="terms-section mb-32" data-aos="fade-up" data-aos-delay="1000">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-warning"></i>
            </div>
            <h2 class="section-title">10. Limitation of Liability</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              In no event shall Kartmania, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Site.
            </p>
          </div>
        </div>

        <!-- Section 11 -->
        <div class="terms-section mb-32" data-aos="fade-up" data-aos-delay="1100">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-handshake"></i>
            </div>
            <h2 class="section-title">11. Indemnification</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              You agree to indemnify and hold Kartmania and its parents, subsidiaries, affiliates, officers, employees, agents, partners and licensors harmless from any claim or demand, including reasonable attorneys' fees, made by any third-party due to or arising out of your breach of these Terms.
            </p>
          </div>
        </div>

        <!-- Section 12 -->
        <div class="terms-section mb-32" data-aos="fade-up" data-aos-delay="1200">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-scales"></i>
            </div>
            <h2 class="section-title">12. Governing Law</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
            </p>
          </div>
        </div>

        <!-- Section 13 -->
        <div class="terms-section mb-32" data-aos="fade-up" data-aos-delay="1300">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-note-pencil"></i>
            </div>
            <h2 class="section-title">13. Changes to Terms</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              We reserve the right, at our sole discretion, to change, modify, add, or remove portions of these Terms at any time. It is your responsibility to check these Terms periodically for changes.
            </p>
          </div>
        </div>

        <!-- Section 14 -->
        <div class="terms-section mb-32" data-aos="fade-up" data-aos-delay="1400">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-envelope"></i>
            </div>
            <h2 class="section-title">14. Contact Information</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              Questions about the Terms of Use should be sent to us at 
              <a href="mailto:support@kartmania.com" class="text-link">support@kartmania.com</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
useHead({
  title: "Terms of Use - Kartmania",
  meta: [
    {
      name: 'description',
      content: 'Read Kartmania\'s Terms of Use. Learn about your rights and responsibilities when using our e-commerce platform.'
    }
  ]
})
</script>

<style scoped>
/* Enhanced Appearance with Project's Color Theme */

/* Header Section */
.terms-header {
  position: relative;
  padding: 60px 0;
  overflow: hidden;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--main-600) 0%, var(--main-two-600) 100%);
  opacity: 0.1;
  border-radius: 20px;
}

.header-content {
  position: relative;
  z-index: 2;
}

.header-icon {
  width: 80px;
  height: 80px;
  background: var(--main-600);
  color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-family: var(--heading-font);
  font-size: var(--heading-two);
  color: hsl(var(--black));
  font-weight: 700;
  line-height: 1.2;
}

.meta-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--main-100);
  color: var(--main-600);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

/* Terms Content */
.terms-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.terms-section {
  padding: 0;
  background: hsl(var(--white));
  border-radius: 16px;
  border: 1px solid var(--neutral-40);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.terms-section:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

/* Section Header */
.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 32px;
  background: linear-gradient(135deg, var(--main-50), var(--main-100));
  border-bottom: 1px solid var(--neutral-40);
}

.section-icon {
  width: 48px;
  height: 48px;
  background: var(--main-600);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-family: var(--heading-font);
  font-size: var(--heading-four);
  color: hsl(var(--black));
  font-weight: 600;
  margin: 0;
}

/* Section Content */
.section-content {
  padding: 32px;
}

.section-text {
  font-family: var(--body-font);
  font-size: 16px;
  line-height: 1.7;
  color: hsl(var(--black));
  opacity: 0.8;
  margin-bottom: 0;
}

/* Subsections */
.subsection {
  margin-bottom: 24px;
}

.subsection:last-child {
  margin-bottom: 0;
}

.subsection-header {
  margin-bottom: 12px;
}

.subsection-title {
  font-family: var(--heading-font);
  font-size: 18px;
  color: var(--main-600);
  font-weight: 600;
  margin: 0;
}

.subsection {
  padding-left: 24px;
  border-left: 3px solid var(--main-600);
  margin-left: 8px;
}

/* Links */
.text-link {
  color: var(--main-600);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.text-link:hover {
  color: var(--main-800);
  border-bottom-color: var(--main-600);
}

/* Responsive Design */
@media (max-width: 768px) {
  .terms-header {
    padding: 40px 0;
  }
  
  .header-icon {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }
  
  .page-title {
    font-size: var(--heading-three);
  }
  
  .section-header {
    padding: 20px 24px;
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .section-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .section-title {
    font-size: var(--heading-five);
  }
  
  .section-content {
    padding: 24px;
  }
  
  .section-text {
    font-size: 15px;
  }
  
  .subsection {
    padding-left: 16px;
    margin-left: 0;
  }
}

@media (max-width: 480px) {
  .terms-header {
    padding: 30px 0;
  }
  
  .header-icon {
    width: 50px;
    height: 50px;
    font-size: 25px;
  }
  
  .meta-badge {
    font-size: 13px;
    padding: 6px 12px;
  }
  
  .section-header {
    padding: 16px 20px;
  }
  
  .section-content {
    padding: 20px;
  }
  
  .section-text {
    font-size: 14px;
  }
  
  .subsection {
    padding-left: 12px;
  }
}
</style>
