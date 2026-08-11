---
marp: true
theme: default
class: lead
size: 16:9
style: |
  @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Roboto:wght@400;500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
  
  section {
    background-color: #FAFAFA;
    color: #202124;
    font-family: 'Roboto', sans-serif;
    padding: 60px 80px;
    position: relative;
  }
  
  /* Top App Bar Style for Headers */
  h1 {
    font-family: 'Google Sans', sans-serif;
    color: #b05c6a;
    font-weight: 700;
    font-size: 2.2em;
    border-bottom: 2px solid #E8EAED;
    padding-bottom: 12px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  h2, h3 {
    font-family: 'Google Sans', sans-serif;
    color: #3C4043;
    font-weight: 500;
  }
  
  ul {
    font-size: 1.1em;
    line-height: 1.8;
    color: #3C4043;
    list-style: none; /* We will use icons instead */
    padding-left: 0;
  }
  
  li {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .icon {
    font-family: 'Material Symbols Outlined';
    color: #b05c6a;
    font-size: 28px;
  }
  
  .icon-error { color: #D93025; }
  .icon-success { color: #137333; }
  
  .highlight {
    color: #b05c6a;
    font-weight: 500;
  }
  
  /* Material 3 Alerts */
  .alert {
    background: #FCE8EB; /* Custom Brand Container */
    color: #b05c6a; /* On Brand Container */
    padding: 16px 24px;
    margin: 24px 0;
    border-radius: 16px;
    font-size: 0.95em;
    font-family: 'Google Sans', sans-serif;
    box-shadow: 0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .alert-tip {
    background: #E6F4EA; 
    color: #137333;
  }
  
  .alert-important {
    background: #FEF7E0;
    color: #B06000;
  }
  
  /* Layout */
  .two-column {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 40px;
    align-items: center;
  }
  .two-column.reverse {
    grid-template-columns: 0.8fr 1.2fr;
  }
  
  /* Images with Material Elevation */
  img {
    border-radius: 24px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
    max-height: 420px;
    max-width: 100%;
    object-fit: contain;
  }
  
  /* Elevated Cards */
  .text-box {
    background: #FFFFFF;
    padding: 32px;
    border-radius: 24px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
  }
  
  /* Floating Action Button (FAB) */
  .fab {
    position: absolute;
    bottom: 40px;
    right: 40px;
    background-color: #b05c6a;
    color: white;
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 8px 3px rgba(60,64,67,0.15), 0 1px 3px rgba(60,64,67,0.3);
  }
  .fab .material-symbols-outlined {
    font-size: 32px;
  }
---

<!-- slide -->
# <span class="material-symbols-outlined">storefront</span> Rang E Renju
**From Instagram to Scaling Your Business**

<br>
Welcome, Rang E Renju Team! We're excited to show you the new custom e-commerce platform we've built, focusing on speed, usability, and beautiful design.

<div class="fab">
  <span class="material-symbols-outlined">arrow_forward</span>
</div>

---

<!-- slide -->
# <span class="material-symbols-outlined">trending_down</span> The Current Journey
**The Challenge:**

Currently, managing Instagram DM sales involves:
<ul>
  <li><span class="icon icon-error">cancel</span> <strong>Manual Work:</strong> Typing codes, sharing UPI, tracking stock.</li>
  <li><span class="icon icon-error">warning</span> <strong>Lack of Accountability:</strong> Messages get lost.</li>
  <li><span class="icon icon-error">monitoring</span> <strong>Limited Analytics:</strong> Hard to know what drives traffic.</li>
</ul>

<div class="alert alert-important">
  <span class="material-symbols-outlined">lightbulb</span>
  <div><strong>The Solution:</strong> An automated web store that connects with your Instagram presence, reducing manual workload while retaining your personal touch.</div>
</div>

---

<!-- slide -->
# <span class="material-symbols-outlined">explore</span> The New Customer Journey 
**Designed for Discovery**

<div class="two-column">
<div>

**Key Features:**
<ul>
  <li><span class="icon">auto_awesome</span> <strong>Hero Section:</strong> Instantly showcases your collection.</li>
  <li><span class="icon">school</span> <strong>How It Works:</strong> Educates the customer (Discover → Search → Pay).</li>
  <li><span class="icon">search</span> <strong>Direct Code Search:</strong> Dedicated input field for product codes.</li>
</ul>

<div class="alert alert-tip">
  <span class="material-symbols-outlined">smartphone</span>
  <div><strong>Mobile First:</strong> Optimized with generous touch targets and fast load times, adhering to Material Design standards.</div>
</div>

</div>
<div>

![homepage](homepage.png)

</div>
</div>

---

<!-- slide -->
# <span class="material-symbols-outlined">manage_search</span> The Shop & Product Lookup
**Bridging Instagram and the Web**

<div class="two-column reverse">
<div>

![shop](shop.png)

</div>
<div class="text-box">

**Category Filters:**
Filter seamlessly by "Sarees" or "Kurtis". 

**Product Search:**
<ul>
  <li><span class="icon">bolt</span> <div><span class="highlight">Fast & Forgiving:</span> Typos and lowercase are handled automatically.</div></li>
  <li><span class="icon">inventory_2</span> <div><span class="highlight">Inventory Sync:</span> Reflects real-time stock. No more "Is this available?" DMs for sold-out items!</div></li>
</ul>

</div>
</div>

---

<!-- slide -->
# <span class="material-symbols-outlined">verified_user</span> Secure UPI Payment
**Frictionless Purchasing**

<div class="two-column">
<div>

<ul>
  <li><span class="icon">no_accounts</span> <strong>No Account Required:</strong> Reduces abandoned carts.</li>
  <li><span class="icon">payments</span> <strong>Direct UPI Integration:</strong> Highlights UPI clearly with clear calls to action.</li>
  <li><span class="icon">shield</span> <strong>Trust Signals:</strong> Emphasizes secure payments and WhatsApp support.</li>
</ul>

<div class="alert alert-important">
  <span class="material-symbols-outlined">chat</span>
  <div><strong>Objection Handling:</strong> Instant WhatsApp confirmations provide a familiar trust layer.</div>
</div>

</div>
<div>

![checkout](checkout.png)

</div>
</div>

---

<!-- slide -->
# <span class="material-symbols-outlined">local_shipping</span> Automated Tracking
**Reducing Support DMs**

<div class="two-column reverse">
<div>

![track](track.png)

</div>
<div class="text-box">

**Order Tracking:**
Customers visit `/track` for live updates. 

**WhatsApp Integration:**
<ul>
  <li><span class="icon">send</span> Send tracking updates via WhatsApp.</li>
  <li><span class="icon">forum</span> Click-to-chat links pre-fill order details.</li>
  <li><span class="icon">check_circle</span> Replaces chaotic DMs with organized conversations.</li>
</ul>

</div>
</div>

---

<!-- slide -->
# <span class="material-symbols-outlined">rocket_launch</span> Let's Launch Your Store!
**Next Steps & Feedback**

<div class="two-column">
<div>

**Questions for You:**
<ul>
  <li><span class="icon">checklist</span> How many products are ready to list?</li>
  <li><span class="icon">sync</span> How do you want to handle inventory sync?</li>
  <li><span class="icon">schedule</span> What is your ideal timeline to go live?</li>
</ul>

<div class="alert">
  <span class="material-symbols-outlined">favorite</span>
  <div><strong>Our Goal:</strong> Smoother operations so you have more time to source beautiful textiles!</div>
</div>

</div>
<div>

![whatsapp](whatsapp.jpeg)

</div>
</div>

<div class="fab">
  <span class="material-symbols-outlined">done</span>
</div>
