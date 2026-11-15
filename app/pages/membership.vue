<script setup lang="ts">
import { membershipBankDetails, membershipFees, membershipPaymentFormUrl, membershipUpi } from '~~/content/site/membership'

const rupees = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

useSeoMeta({
  title: 'Membership',
  description: 'INPA membership fees for founding, life, annual, and institutional or corporate members, with bank transfer and UPI payment details.',
  robots: 'noindex, follow',
})
</script>

<template>
  <div>
    <header class="page-hero">
      <div class="container membership-container">
        <h1>Membership</h1>
      </div>
    </header>

    <section class="section" aria-labelledby="membership-fees-heading">
      <div class="container membership-container">
        <h2 id="membership-fees-heading">Membership fees</h2>
        <dl class="membership-fees">
          <div v-for="fee in membershipFees" :key="fee.category">
            <dt>{{ fee.category }}</dt>
            <dd>{{ rupees.format(fee.amount) }}</dd>
          </div>
        </dl>
      </div>
    </section>

    <section class="section section--subtle" aria-labelledby="membership-payment-heading">
      <div class="container membership-container">
        <h2 id="membership-payment-heading">Payment details</h2>
        <p class="payment-intro">Enter the fee for your membership category when paying by bank transfer or UPI.</p>

        <div class="payment-methods">
          <section aria-labelledby="membership-bank-heading">
            <h3 id="membership-bank-heading">Bank transfer</h3>
            <dl class="bank-details">
              <div v-for="detail in membershipBankDetails" :key="detail.label">
                <dt>{{ detail.label }}</dt>
                <dd>{{ detail.value }}</dd>
              </div>
            </dl>
          </section>

          <section class="upi-payment" aria-labelledby="membership-upi-heading">
            <h3 id="membership-upi-heading">Pay by UPI</h3>
            <img :src="membershipUpi.qrImage" width="462" height="462" alt="UPI payment QR code for the Indian Nuclear Physics Association">
            <p>Scan the QR code with your UPI app.</p>
            <dl>
              <dt>UPI ID</dt>
              <dd>{{ membershipUpi.id }}</dd>
            </dl>
          </section>
        </div>

        <section class="payment-report" aria-labelledby="membership-report-heading">
          <div>
            <h3 id="membership-report-heading">After you pay</h3>
            <p>Have your transaction reference or UTR ready. The Google Form opens in a new tab.</p>
          </div>
          <a class="button button--navy" :href="membershipPaymentFormUrl" target="_blank" rel="noopener noreferrer">Submit payment details</a>
        </section>

        <p class="membership-contact">For application and eligibility details, <NuxtLink class="text-link" to="/contact">contact INPA</NuxtLink>.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.membership-container {
  --content-width: 64rem;
}

.membership-fees {
  margin-block: 0;
  border-block: 1px solid var(--color-border);
}

.membership-fees > div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.5rem 1rem;
  padding-block: 0.875rem;
}

.membership-fees > div + div {
  border-top: 1px solid var(--color-border);
}

.membership-fees dt {
  font-weight: 650;
  line-height: 1.4;
}

.membership-fees dd {
  margin: 0;
  color: var(--color-navy-800);
  font-size: clamp(1.375rem, 3vw, 2rem);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1.3;
}

.payment-intro {
  max-width: 60ch;
  margin-bottom: 2rem;
  color: var(--color-text-muted);
}

.payment-methods {
  display: grid;
  align-items: start;
  gap: 2rem;
}

.payment-methods h3 {
  margin-bottom: 1rem;
}

.bank-details,
.upi-payment dl {
  margin-block: 0;
}

.bank-details > div {
  padding-block: 0.75rem;
  border-top: 1px solid var(--color-border);
}

.bank-details dt,
.upi-payment dt {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.bank-details dd,
.upi-payment dd {
  margin: 0;
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}

.upi-payment {
  text-align: center;
}

@media (width < 45rem) {
  .upi-payment {
    padding: clamp(1rem, 3vw, 1.75rem);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
  }
}

.upi-payment p {
  margin-bottom: 0.75rem;
  color: var(--color-text-muted);
}

.upi-payment img {
  width: min(100%, 15rem);
  height: auto;
  margin: 0 auto 0.75rem;
}

.upi-payment dd {
  font-size: 0.875rem;
}

.payment-report {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
  margin-top: 2rem;
  padding-block: 1.5rem;
  border-block: 1px solid var(--color-border);
}

.payment-report h3 {
  margin-bottom: 0.5rem;
}

.payment-report p {
  max-width: 52ch;
  margin-bottom: 0;
  color: var(--color-text-muted);
}

.membership-contact {
  margin-block: 1.5rem 0;
}

@media (min-width: 45rem) {
  .membership-fees {
    display: grid;
    grid-template-columns: repeat(3, 1fr) 1.2fr;
  }

  .membership-fees > div {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: 1fr auto;
    align-items: start;
    padding: 1rem clamp(0.75rem, 2vw, 1.5rem);
  }

  .membership-fees > div:first-child {
    padding-inline-start: 0;
  }

  .membership-fees > div + div {
    border-top: 0;
    border-inline-start: 1px solid var(--color-border);
  }

  .payment-methods {
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    gap: clamp(2rem, 5vw, 4rem);
  }
}

@media (min-width: 60rem) {
  .bank-details > div {
    display: grid;
    grid-template-columns: 8rem minmax(0, 1fr);
    gap: 0.75rem;
  }

  .bank-details dt {
    padding-top: 0.075rem;
  }
}
</style>
