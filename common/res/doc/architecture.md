Every purchase may have all or some of these data.

**Client side**
1. Create or request a new purchase
2. Read the purchase with txId

**Admin Side**
1. Create or request a new purchase
2. Read the purchase with txId
3. Update the purchase with txId
4. Delete the purchase with txId

**Server**
1. Receive request from client and admin.
2. Modify database.
3. Send API requests for(paystack, provider).
4. Modify database on response of API request.
5. Respond to client or admin.

These Characteristics gives a clear criteria for every data we need.
**Data Structure**
1. Interface and Types
   - Object interface: All the data in the database.
   - Form interface: What we need from the user to proceed.
   - Request interface: Data needed to make a new request.
   - Server API request interface: What server needs to send to provider.

2. Data Flow.
   - Form interface
   - Request interface
   - Database Object Interface
   - Request interface

**Functions Flow**
   - Client request
   - Database Creation
   - Server response
   - API calls
   - Update Database

**Object**
- Action Database type
- Database Collection folder
- Server CRUD Object
- Admin CRUD
- Client CRUD


**Purchases**
- Bundle
- AFA
- Result Checker

**Special**
- Register New Agent

