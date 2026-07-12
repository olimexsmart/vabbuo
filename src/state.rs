use sqlx::SqlitePool;

/// Shared application state.
///
/// The pool is cheap to clone, so we store it once and pass it through
/// Axum's state extractor instead of threading database handles by hand.
#[derive(Clone)]
pub struct AppState {
    pub pool: SqlitePool,
}
