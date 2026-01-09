// faqData.ts
export interface FAQItem {
    question: string;
    answer: string;
}

export const FAQS: FAQItem[] = [
    {
        question: "What is Wondamart Data Solutions?",
        answer:
            "Wondamart Data Solutions is a digital platform that enables users to purchase affordable mobile data bundles across supported networks quickly and securely.",
    },
    {
        question: "Which networks are supported?",
        answer:
            "Wondamart currently supports major telecom networks including MTN, Telecel, and AT. Network availability may change based on provider updates.",
    },
    {
        question: "Do I need to register before buying data?",
        answer:
            "Yes. Registration is required to access the platform, fund your wallet, track transactions, and enjoy discounted pricing and rewards.",
    },
    {
        question: "How does payment work?",
        answer:
            "Wondamart operates on a prepaid wallet system. You must fund your wallet before placing any order. Orders are processed only after successful payment.",
    },
    {
        question: "Is data delivery instant?",
        answer:
            "Most data deliveries are instant. However, delivery times may vary due to telecom network validation, congestion, or system delays beyond our control.",
    },
    {
        question: "What happens if my data delivery is delayed?",
        answer:
            "Delayed deliveries are usually caused by network provider systems. Every successfully paid order will be delivered once the network permits.",
    },
    {
        question: "Can I get a refund after purchase?",
        answer:
            "No. All transactions are final once processed. Refunds are not issued for successful payments, wrong numbers, or delivered services.",
    },
    {
        question: "What if I enter a wrong phone number?",
        answer:
            "Users are fully responsible for verifying phone numbers before submission. Data sent to a wrong number cannot be reversed or refunded.",
    },
    {
        question: "Are there any hidden charges?",
        answer:
            "No. All prices displayed on the platform are transparent. There are no hidden fees or post-transaction charges.",
    },
    {
        question: "How does the referral rewards program work?",
        answer:
            "You earn rewards when users register using your referral link and successfully purchase data. Rewards can be redeemed based on platform rules.",
    },
    {
        question: "Is my personal information secure?",
        answer:
            "Yes. Wondamart implements industry-standard security practices to protect user data and transactions.",
    },
    {
        question: "Can my account be suspended?",
        answer:
            "Yes. Fraudulent activity, abuse of the platform, or violation of terms may result in account suspension or permanent termination.",
    },
];
