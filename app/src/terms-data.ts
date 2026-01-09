export interface TermClause {
    title: string;
    items: string[];
}

export const TERMS_AND_CONDITIONS: TermClause[] = [
    {
        title: "Agent Registration",
        items: [
            "All agents are required to pay a non-refundable registration fee of GHS 20.",
            "Payment activates agent access, discounted agent prices, and commission-earning opportunities.",
        ],
    },
    {
        title: "Payments Before Orders",
        items: [
            "Wondermat GH operates strictly on a prepaid model.",
            "Agents must fund their wallet before purchasing any data bundles.",
            "No order will be processed until full payment has been received.",
            "All transactions are final once processed.",
        ],
    },
    {
        title: "Data Delivery",
        items: [
            "Data delivery may be instant or delayed depending on telecom network validation systems.",
            "Some phone numbers may receive data earlier due to provider-level checks.",
            "Delivery times are not guaranteed, although every request is handled promptly.",
        ],
    },
    {
        title: "Pricing & Profits",
        items: [
            "Registered agents receive exclusive discounted prices.",
            "Agents may resell data at any price and retain 100% of the profit margin.",
            "Prices may change due to telecom provider or market adjustments.",
        ],
    },
    {
        title: "Responsibility for Wrong Numbers",
        items: [
            "Agents are fully responsible for verifying phone numbers before submission.",
            "Wondermat GH bears no responsibility for data sent to wrong numbers.",
            "Wrong-number transactions cannot be reversed, corrected, or refunded.",
            "Agents must double-check all numbers before placing orders.",
        ],
    },
    {
        title: "Platform Usage & Compliance",
        items: [
            "All payments must be made through official Wondermat GH merchant channels only.",
            "Agents must comply with all telecommunications and digital service regulations.",
            "Fraud, misuse, or violations may result in account suspension or termination.",
        ],
    },
    {
        title: "Network Provider Dependency & Commitment to Delivery",
        items: [
            "Network delays or downtimes are outside the control of Wondermat GH.",
            "Delivering data remains our top operational priority.",
            "Every validly paid order will be delivered once the network permits.",
            "Successful payment guarantees eventual data delivery.",
        ],
    },
    {
        title: "Liability Limitations",
        items: [
            "Wondermat GH is not responsible for wrong-number orders.",
            "Network provider delays or failures are excluded from liability.",
            "Agent or customer disputes are not our responsibility.",
            "Loss of resale profits is not compensable.",
            "Maximum liability is limited to the value of the undelivered service only.",
        ],
    },
    {
        title: "Amendments",
        items: [
            "Wondermat GH may update these Terms at any time.",
            "Continued use of the platform constitutes acceptance of updates.",
        ],
    },
    {
        title: "Acceptance",
        items: [
            "By registering or using Wondermat GH, you confirm full acceptance of these Terms.",
            "Continued platform usage signifies ongoing acceptance of amendments.",
        ],
    },
    {
        title: "Strict Policy: No Social Media Advertising",
        items: [
            "Agents are prohibited from advertising Wondermat GH on any social media platform.",
            "This includes Facebook, Instagram, WhatsApp Status, TikTok, Twitter, Snapchat, and others.",
            "Violation results in permanent account deletion without warning.",
            "This policy protects system stability and platform integrity.",
            "No exceptions will be made under any circumstances.",
        ],
    },
];
