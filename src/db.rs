use crate::models::{CleanSubmission, SentenceResponse};
use sqlx::{Row, SqlitePool};
use std::time::{SystemTime, UNIX_EPOCH};

/// Fallback content so the site still works on a brand new SQLite file.
const DEFAULT_SENTENCES: &[(&str, Option<&str>)] = &[
    ("Vabbuò, oggi si va avanti così.", None),
    ("Lascia stare, va bene così.", None),
    ("A volte basta esserci.", None),
    ("Non è tutto da capire subito.", None),
    ("Una frase breve fa il suo lavoro.", None),
    ("Tutto sommato, vabbuò.", None),
    ("Non serve esagerare.", None),
    ("Si procede con calma.", None),
];

/// Initialize the database schema and seed it if necessary.
pub async fn initialize(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    // SQLite is tiny, but enabling foreign keys keeps future changes honest.
    sqlx::query("PRAGMA foreign_keys = ON;")
        .execute(pool)
        .await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS sentences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            author TEXT
        );
        "#,
    )
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            nickname TEXT,
            sentence TEXT,
            email TEXT,
            sex TEXT,
            contact INTEGER NOT NULL DEFAULT 0,
            other TEXT
        );
        "#,
    )
    .execute(pool)
    .await?;

    seed_sentences(pool).await?;
    Ok(())
}

/// Seed the sentence table only when it is empty.
async fn seed_sentences(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    let count: i64 = sqlx::query_scalar("SELECT COUNT(1) FROM sentences")
        .fetch_one(pool)
        .await?;

    if count > 0 {
        return Ok(());
    }

    // We keep the fallback list tiny and obvious. If a real data import arrives
    // later, this branch stops running automatically.
    for (text, author) in DEFAULT_SENTENCES {
        sqlx::query("INSERT INTO sentences (text, author) VALUES (?, ?)")
            .bind(text)
            .bind(author)
            .execute(pool)
            .await?;
    }

    Ok(())
}

/// Resolve a user seed into a stable offset.
pub fn seed_to_offset(seed: u64, count: i64) -> i64 {
    if count <= 0 {
        return 0;
    }

    (seed % count as u64) as i64
}

/// Generate a fallback seed when the client does not send one.
fn fallback_seed() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_nanos() as u64)
        .unwrap_or(0)
}

/// Fetch one sentence using the provided seed.
pub async fn fetch_sentence(
    pool: &SqlitePool,
    seed: Option<String>,
) -> Result<Option<SentenceResponse>, sqlx::Error> {
    let count: i64 = sqlx::query_scalar("SELECT COUNT(1) FROM sentences")
        .fetch_one(pool)
        .await?;

    if count <= 0 {
        return Ok(None);
    }

    let parsed_seed = seed
        .as_deref()
        .and_then(|value| value.parse::<u64>().ok())
        .unwrap_or_else(fallback_seed);
    let offset = seed_to_offset(parsed_seed, count);

    let row = sqlx::query(
        r#"
        SELECT text, author
        FROM sentences
        ORDER BY id
        LIMIT 1 OFFSET ?
        "#,
    )
    .bind(offset)
    .fetch_optional(pool)
    .await?;

    Ok(row.map(|row| SentenceResponse {
        sentence: row.get::<String, _>("text"),
        author: row.get::<Option<String>, _>("author"),
    }))
}

/// Store one submitted sentence.
pub async fn insert_submission(
    pool: &SqlitePool,
    submission: &CleanSubmission,
) -> Result<(), sqlx::Error> {
    sqlx::query(
        r#"
        INSERT INTO submissions (
            nickname,
            sentence,
            email,
            sex,
            contact,
            other
        ) VALUES (?, ?, ?, ?, ?, ?)
        "#,
    )
    .bind(&submission.nickname)
    .bind(&submission.sentence)
    .bind(&submission.email)
    .bind(&submission.sex)
    .bind(if submission.contact { 1_i64 } else { 0_i64 })
    .bind(&submission.other)
    .execute(pool)
    .await?;

    Ok(())
}
