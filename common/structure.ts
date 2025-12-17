// Now there are clear paths. Not nested.

// Data Bundles.
// Data bundles live in the database as a clear map with id.
// Network and category is abstracted and not a folder or document.
// Eg. MTN/Non-Expiry is not a thing.
// But all bundle has a field to show where they belong.
// network and validity is a field.
// After fetching and querying for a network, we can then sort them.
// this allows for a long and dynamic ways of adding data bundles.

// Transactions
// These are broken down into types
// Account-Deposit
// Bundle-purchase
// AFA-purchase
// Result-Checker-purchase

// Commissions
// Now we are not sure if we'll calculate form earned or do a batch per month.

// // Commission-Earned?
// This is where we add up commissions per every transaction
// pros:
// single source of truth
// No magor database reads
// Paid can be canceled out easily
// cons:
// Create per every transaction if we want to keep reference.
// More api and usage
// Complex

// // Batch calculation
// pros:
// No need for more database collections
// Simple to implement
// cons:
// Too much database reads per user session
// Cannot easily know paid and unpaid

// // Commission-Deposit?
