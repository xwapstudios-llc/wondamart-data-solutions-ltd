# **Wondamart Data Solutions – System Requirements Document (Draft)**

## **1. Overview**

Wondamart Data Solutions is an online platform aimed at selling affordable mobile data bundles to consumers across all networks. The goal is to provide **low-cost, fast, and reliable data services** with a user-friendly experience, automated wallet deposits, order history tracking, and a referral rewards program.

---

## **2. Navigation & Footer (Abstracted)**

### **Navigation (Common across pages)**

* **Logo**
* **Company Name**: *Wondamart Data Solutions*
* **Menu Items**: Home, Buy Data, History, Deposit, Earn Rewards, Live Chat, Dashboard, LoginPage/Signup

### **Footer (Common across pages)**

* **Connect with Us**: WhatsApp | Telegram
* **Support**: Telephone, Email, WhatsApp
* **Legal**: Terms & Privacy Policy
* **Copyright**: © 2025 Wondamart Data Solutions – All rights reserved

---

## **3. Core Modules**

### **3.1 Authentication & Accounts**

* **LoginPage**

    * Fields: Email, Password
    * Forgot Password option
* **Signup**

    * Fields: First Name, Last Name, Gender, Age, Telephone, Email, Status, City, Region, Referral Code, Password & Confirm Password
* **Account Overview**

    * Balance Display
    * Orders Summary (last 7 days, 30 days, all-time)
    * Bundle Purchase History (line graph: GB purchased vs period)
    * Recent Activity (table of top-ups & orders – last 5 transactions)

---

### **3.2 Dashboard**

* Welcome message with username
* Quick access to Buy Data, History, Deposit, Earn Rewards, Live Chat
* Wallet balance and transaction summary

---

### **3.3 Buy Data**

* **Order Form**

    * Network (MTN, Telecel, AT)
    * Bundle (2-day expiry, 30-day expiry, non-expiry)
    * Amount (whole figures only)
    * Quantity (auto-calculated per GB rate)
    * Phone Number & Confirm Phone Number
* **Order Placement**

    * Real-time validation before submission

---

### **3.4 Order History**

* **Table Fields**

    * Date/Time
    * Order Serial Number
    * Network
    * Bundle Type
    * Phone Number
    * Quantity
    * Amount
    * Status (Processing, Failed, Delivered)

---

### **3.5 Wallet & Deposits**

* **Top-up Wallet**

    * Integrated Secure Payment Gateways
* **Transaction History Table**

    * Date/Time
    * Transaction Serial Number
    * Type (Top-up, Order)
    * Network
    * Phone Number
    * Amount
    * Status (Processing, Failed, Received)

---

### **3.6 Rewards Program**

* **Referral System**

    * Users share unique referral links
    * New users register via referral link
    * Referrer earns points per data purchase by referred users
    * Points redeemable for free data
* **Benefits**

    * Unlimited earnings potential
    * More referrals = more rewards

---

## **4. Key Objectives**

* Provide **cheap and accessible mobile data** across all networks.
* Deliver a **seamless user experience** with account management, transaction history, and real-time order updates.
* Build a **trustworthy platform** with transparent operations, reliable delivery, and secure payment handling.
* Encourage **organic growth** via a referral-driven rewards system.
