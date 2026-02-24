<template>
  <section class="security py-80">
    <div class="container container-lg">
      <!-- Page Header with Background -->
      <div class="security-header mb-60">
        <div class="header-bg"></div>
        <div class="header-content text-center">
          <div class="header-icon mb-20">
            <i class="ph ph-shield-check"></i>
          </div>
          <h1 class="page-title mb-20">Security</h1>
          <div class="header-meta">
            <span class="meta-badge">
              <i class="ph ph-calendar"></i>
              Last updated: {{ new Date().toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Security Content with Enhanced Cards -->
      <div class="security-wrapper">
        <!-- Section 1 -->
        <div class="security-section mb-32" data-aos="fade-up" data-aos-delay="100">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-lock"></i>
            </div>
            <h2 class="section-title">1. Data Protection</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              We implement industry-standard security measures to protect your personal and financial information.
            </p>
            <div class="subsection mb-20">
              <div class="subsection-header">
                <h3 class="subsection-title">1.1. Encryption</h3>
              </div>
              <p class="section-text">
                All data transmitted between your browser and our servers is encrypted using SSL/TLS protocols with 256-bit encryption.
              </p>
            </div>
            <div class="subsection">
              <div class="subsection-header">
                <h3 class="subsection-title">1.2. Secure Storage</h3>
              </div>
              <p class="section-text">
                Sensitive data is stored in encrypted databases with restricted access and regular security audits.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 2 -->
        <div class="security-section mb-32" data-aos="fade-up" data-aos-delay="200">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-credit-card"></i>
            </div>
            <h2 class="section-title">2. Payment Security</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              Your payment information is protected through multiple layers of security.
            </p>
            <div class="subsection mb-20">
              <div class="subsection-header">
                <h3 class="subsection-title">2.1. PCI Compliance</h3>
              </div>
              <p class="section-text">
                We are PCI DSS compliant and never store complete credit card information on our servers.
              </p>
            </div>
            <div class="subsection">
              <div class="subsection-header">
                <h3 class="subsection-title">2.2. Fraud Detection</h3>
              </div>
              <p class="section-text">
                Advanced fraud detection systems monitor transactions for suspicious activities in real-time.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 3 -->
        <div class="security-section mb-32" data-aos="fade-up" data-aos-delay="300">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-user-lock"></i>
            </div>
            <h2 class="section-title">3. Account Security</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              Protect your account with our advanced security features.
            </p>
            <div class="subsection mb-20">
              <div class="subsection-header">
                <h3 class="subsection-title">3.1. Password Protection</h3>
              </div>
              <p class="section-text">
                Strong password requirements, salted hashing, and regular password security checks.
              </p>
            </div>
            <div class="subsection">
              <div class="subsection-header">
                <h3 class="subsection-title">3.2. Two-Factor Authentication</h3>
              </div>
              <p class="section-text">
                Optional 2FA available via SMS, email, or authenticator apps for enhanced account protection.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 4 -->
        <div class="security-section mb-32" data-aos="fade-up" data-aos-delay="400">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-monitor"></i>
            </div>
            <h2 class="section-title">4. System Security</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              Our infrastructure is designed with multiple security layers to prevent unauthorized access.
            </p>
            <div class="subsection mb-20">
              <div class="subsection-header">
                <h3 class="subsection-title">4.1. Firewalls & WAF</h3>
              </div>
              <p class="section-text">
                Web Application Firewall and network firewalls protect against common attacks and vulnerabilities.
              </p>
            </div>
            <div class="subsection">
              <div class="subsection-header">
                <h3 class="subsection-title">4.2. Regular Updates</h3>
              </div>
              <p class="section-text">
                Continuous security patches and system updates to protect against emerging threats.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 5 -->
        <div class="security-section mb-32" data-aos="fade-up" data-aos-delay="500">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-eye"></i>
            </div>
            <h2 class="section-title">5. Monitoring & Auditing</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              We continuously monitor our systems for security threats and conduct regular audits.
            </p>
            <div class="subsection mb-20">
              <div class="subsection-header">
                <h3 class="subsection-title">5.1. 24/7 Monitoring</h3>
              </div>
              <p class="section-text">
                Real-time security monitoring with automated threat detection and response systems.
              </p>
            </div>
            <div class="subsection">
              <div class="subsection-header">
                <h3 class="subsection-title">5.2. Third-Party Audits</h3>
              </div>
              <p class="section-text">
                Regular security assessments by independent cybersecurity firms to validate our security measures.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 6 -->
        <div class="security-section mb-32" data-aos="fade-up" data-aos-delay="600">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-user-shield"></i>
            </div>
            <h2 class="section-title">6. Your Role in Security</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              Help us keep your account secure by following these best practices.
            </p>
            <div class="subsection mb-20">
              <div class="subsection-header">
                <h3 class="subsection-title">6.1. Strong Passwords</h3>
              </div>
              <p class="section-text">
                Use unique, complex passwords and enable two-factor authentication on your account.
              </p>
            </div>
            <div class="subsection">
              <div class="subsection-header">
                <h3 class="subsection-title">6.2. Phishing Awareness</h3>
              </div>
              <p class="section-text">
                Never share your login credentials and verify emails are from official Kartmania domains.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 7 -->
        <div class="security-section mb-32" data-aos="fade-up" data-aos-delay="700">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-bug"></i>
            </div>
            <h2 class="section-title">7. Vulnerability Reporting</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              We take security seriously and encourage responsible vulnerability disclosure.
            </p>
            <div class="subsection mb-20">
              <div class="subsection-header">
                <h3 class="subsection-title">7.1. Bug Bounty Program</h3>
              </div>
              <p class="section-text">
                Report security vulnerabilities through our responsible disclosure program for rewards.
              </p>
            </div>
            <div class="subsection">
              <div class="subsection-header">
                <h3 class="subsection-title">7.2. Response Time</h3>
              </div>
              <p class="section-text">
                We commit to responding to security reports within 24 hours and resolving critical issues promptly.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 8 -->
        <div class="security-section mb-32" data-aos="fade-up" data-aos-delay="800">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-warning"></i>
            </div>
            <h2 class="section-title">8. Incident Response</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              Our incident response team is prepared to handle security events quickly and effectively.
            </p>
            <div class="subsection mb-20">
              <div class="subsection-header">
                <h3 class="subsection-title">8.1. Rapid Response</h3>
              </div>
              <p class="section-text">
                Immediate containment and investigation of any security incidents within minutes of detection.
              </p>
            </div>
            <div class="subsection">
              <div class="subsection-header">
                <h3 class="subsection-title">8.2. User Notification</h3>
              </div>
              <p class="section-text">
                Prompt notification to affected users in case of any data breach or security incident.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 9 -->
        <div class="security-section mb-32" data-aos="fade-up" data-aos-delay="900">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-certificate"></i>
          </div>
          <h2 class="section-title">9. Compliance & Certifications</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              We maintain industry-standard security certifications and comply with data protection regulations.
            </p>
            <div class="subsection mb-20">
              <div class="subsection-header">
                <h3 class="subsection-title">9.1. GDPR Compliance</h3>
              </div>
              <p class="section-text">
                Full compliance with GDPR and other data protection regulations for user privacy rights.
              </p>
            </div>
            <div class="subsection">
              <div class="subsection-header">
                <h3 class="subsection-title">9.2. Security Certifications</h3>
              </div>
              <p class="section-text">
                Regular audits and certifications from recognized security authorities and compliance bodies.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 10 -->
        <div class="security-section mb-32" data-aos="fade-up" data-aos-delay="1000">
          <div class="section-header">
            <div class="section-icon">
              <i class="ph ph-envelope"></i>
            </div>
            <h2 class="section-title">10. Contact Security Team</h2>
          </div>
          <div class="section-content">
            <p class="section-text">
              Report security concerns or vulnerabilities to our dedicated security team.
            </p>
            <div class="subsection mb-20">
              <div class="subsection-header">
                <h3 class="subsection-title">10.1. Security Email</h3>
              </div>
              <p class="section-text">
                For security concerns: 
                <a href="mailto:security@kartmania.com" class="text-link">security@kartmania.com</a>
              </p>
            </div>
            <div class="subsection">
              <div class="subsection-header">
                <h3 class="subsection-title">10.2. Emergency Contact</h3>
              </div>
              <p class="section-text">
                For critical security incidents: 
                <a href="mailto:emergency@kartmania.com" class="text-link">emergency@kartmania.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
useHead({
  title: "Security - Kartmania",
  meta: [
    {
      name: 'description',
      content: 'Learn about Kartmania\'s security measures, data protection, and how we keep your information safe.'
    }
  ]
})
</script>

<style scoped>
/* Enhanced Appearance with Project's Color Theme */

/* Header Section */
.security-header {
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

/* Security Content */
.security-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.security-section {
  padding: 0;
  background: hsl(var(--white));
  border-radius: 16px;
  border: 1px solid var(--neutral-40);
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.security-section:hover {
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
  .security-header {
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
  .security-header {
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
