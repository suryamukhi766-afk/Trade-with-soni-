# Security Specification: Trade with Soni

## 1. Data Invariants
1. **User Journal Isolation**: A user can only create, read, update, and delete their own journal trades under `/users/{userId}/trades/{tradeId}`. No other authenticated user can read another trader's P&L or private journal entries.
2. **Signals Integrity**: Trading signals in `/signals/{signalId}` are readable by all authenticated traders to receive live calls, but mutations (create, update, delete) are strictly validated and authorized to the signal author or admin.
3. **Community Safety**: Community messages in `/community_messages/{messageId}` require valid authenticated identity (`userId == request.auth.uid`), message size limits (<= 500 characters), and author name limits (<= 100 characters). Deletions are limited to message author or admin.
4. **Market Levels**: Key levels in `/market_levels/{levelId}` can be read by all authenticated users, but written only by authorized authors/admins.
5. **ID Poisoning Guard**: All document IDs must conform to `isValidId()` regex `^[a-zA-Z0-9_\-]+$` with max size 128 characters.

## 2. The Dirty Dozen Payloads (Targeting Rejection)
1. **Unauthenticated Signal Creation**: Unauthenticated client posting fake pump-and-dump signals. -> REJECTED (auth != null required).
2. **Journal Trade Cross-User Theft**: User B trying to list or read `/users/UserA/trades` to view User A's private capital and trades. -> REJECTED (`userId == request.auth.uid`).
3. **Spoofed Author in Journal**: User A writing a trade under `/users/UserA/trades/trade1` with `userId: "UserB"`. -> REJECTED (data.userId must equal `request.auth.uid`).
4. **Massive Payload Injection in Community**: Injection of a 2MB payload into `message`. -> REJECTED (string size <= 500 enforced).
5. **Shadow Field Exploitation**: User submitting extra admin flags (`isAdmin: true`, `isVerified: true`) in signal payload. -> REJECTED (strict keys / `hasOnly` schema checks).
6. **Path Traversal / Malformed ID**: Document ID containing directory traversal like `../trades/123`. -> REJECTED (`isValidId` regex guard).
7. **Signal Hijacking**: User B attempting to edit or delete User A's signal. -> REJECTED (`authorId == request.auth.uid`).
8. **Blanket Query Scraping**: Malicious client running unbounded collection group query without constraints. -> REJECTED.
9. **Negative Price Poisoning**: Submitting trade entry price as negative number `-50000`. -> REJECTED (`entryPrice is number && entryPrice > 0`).
10. **State Corruption in Closed Trades**: Attempting to mutate a closed journal trade after settlement without valid schema. -> REJECTED.
11. **Impersonating Soni (isMentor spoofing)**: Standard user setting `isMentor: true` in community message. -> REJECTED (mentor verification required).
12. **Null Request Resource on Delete**: Calling update/read helper during delete causing null reference crash. -> REJECTED (explicit context-aware checks).
