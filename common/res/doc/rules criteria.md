Let's prepare the firestor rules.

# Database Collections
## users(user profile and info)
`users/{user-id}`
- Readers
	- Users with id = {user-id}
	- Admin and SDK
- Writers
	- Users with id = {user-id}
	- Admin and admin SDK
- Locked fields
    - email: string
    - referalCode: string
    - referedCode: string
    - firstName:string, lastName until 91 days less than {user-id}.namesUpdatedAt

## wallets(user account balance and commissions)
`wallets/{user-id}`
- Readers
	- Users with id = {user-id}
	- Admin and admin SDK
- Writers
	- Admin and admin SDK

## transactions(purchases)
`transactions/{tx-id}`
- Readers
	- Users with {tx-id}.uid = {user-id}
	- Admin and admin SDK
- Writers
	- admin SDK only.

## admins(Admin info)
`admins/{admin-id}`
- Readers
	- Admin and admin SDK
- Writers
	- admin SDK only.

## data-bundles(to hold data-package infos)
- Readers
	- All
- Writers
	- Admin and admin SDK

## All Databases // Fallback
- Read, Write, Create, Update: false
// All create is done by cloud admin sdk.

# Note
- Writers
- admin SDK only. // means users or admin cannot write. Unless an backend.
- Admin and admin SDK only. // means users write. Unless Admin and backend.
