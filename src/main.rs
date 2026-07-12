use axum::routing::{get, get_service, post};
use sqlx::sqlite::SqliteConnectOptions;
use std::{net::SocketAddr, str::FromStr};
use tower_http::services::{ServeDir, ServeFile};

use vabbuo::{db, handlers, state::AppState};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // A local SQLite file keeps the rewrite easy to run and easy to back up.
    let database_url =
        std::env::var("DATABASE_URL").unwrap_or_else(|_| "sqlite://vabbuo.sqlite".to_string());

    let options = SqliteConnectOptions::from_str(&database_url)?.create_if_missing(true);
    let pool = sqlx::SqlitePool::connect_with(options).await?;
    db::initialize(&pool).await?;

    let state = AppState { pool };

    let app = axum::Router::new()
        // Compatibility routes keep the old public URLs working.
        .route("/", get(handlers::landing_page))
        .route("/index.php", get(handlers::landing_page))
        .route("/start.html", get(handlers::landing_page))
        .route("/mobileStart.html", get(handlers::landing_page))
        .route("/main", get(handlers::main_page))
        .route("/main.php", get(handlers::main_page))
        .route("/main.html", get(handlers::main_page))
        .route(
            "/api/sentence",
            get(handlers::sentence_endpoint).post(handlers::sentence_endpoint_post),
        )
        .route(
            "/sentence.php",
            get(handlers::sentence_endpoint).post(handlers::sentence_endpoint_post),
        )
        .route("/api/submit", post(handlers::submit_endpoint))
        .route("/submitSentence.php", post(handlers::submit_endpoint))
        // Static browser assets live under /static so the HTML can stay simple.
        .nest_service("/static", ServeDir::new("static"))
        // The old favicon still works without forcing it into the static mount.
        .route_service("/favicon.ico", get_service(ServeFile::new("favicon.ico")))
        .with_state(state);

    let port = std::env::var("PORT")
        .ok()
        .and_then(|value| value.parse::<u16>().ok())
        .unwrap_or(3000);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));

    println!("vabbuo listening on http://{addr}");

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
