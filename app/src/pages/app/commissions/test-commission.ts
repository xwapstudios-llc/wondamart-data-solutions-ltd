import type {CommissionDoc} from "@common/types/commissions.ts";
import { Timestamp } from "firebase/firestore";

const testCommissions: CommissionDoc[] = [
  {
    uid: "USR_7742_ALPHA",
    id: "TX_2026_Q1_001",
    year: 2026,
    monthIndex: 0, // January
    payed: true,
    endOfMonth: Timestamp.fromMillis(1738367999000),
    updatedAt: Timestamp.fromMillis(1738368500000),
    commissions: [
      {
        txID: "SALE_A101",
        commission: 450.50,
        date: Timestamp.fromMillis(1735732800000)
      },
      {
        txID: "SALE_A102",
        commission: 125.00,
        date: Timestamp.fromMillis(1736942400000)
      }
    ]
  },
  {
    uid: "USR_9910_BETA",
    id: "TX_2026_Q1_003",
    year: 2026,
    monthIndex: 2, // March
    payed: false,
    endOfMonth: Timestamp.fromMillis(1743465599000),
    updatedAt: Timestamp.fromMillis(1743465600000),
    commissions: [] // Testing edge case for empty commission array
  },
  {
    uid: "USR_7742_ALPHA",
    id: "TX_2026_Q1_002",
    year: 2026,
    monthIndex: 1, // February
    payed: false,
    endOfMonth: Timestamp.fromMillis(1740787199000),
    updatedAt: Timestamp.fromMillis(1740820000000),
    commissions: [
      {
        txID: "SALE_B201",
        commission: 980.75,
        date: Timestamp.fromMillis(1739188800000)
      }
    ]
  }
];

export { testCommissions };
