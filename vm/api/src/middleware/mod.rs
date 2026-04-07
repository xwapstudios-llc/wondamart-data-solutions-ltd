
// I need these middleware layers
// 1. A general layer for all origen for webhooks ()
// 2. A wondamart only layers for each. E.g. Guests, Clients, Admins
// 3. A firebase auth layer for Clients, Admins

pub mod cors;
pub mod firebase;