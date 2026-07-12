# Refactor steps

## Frontend
1. Remove jQuery dependency, rely only on pure JS. 
2. Update Bootstrap to latest version.

## Backend
1. Migrate to a Rust backend (axum+sqlx)
2. Migrate to a simple SQLite DB. 
3. Move mobile detection to frontend (user-agent detection is obsolete)
4. Remove the data gathering logic in AccessLogger.php (that is not legal, nor correct).