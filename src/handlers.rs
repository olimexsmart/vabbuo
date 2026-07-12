use crate::{
    db,
    models::{SentenceQuery, SubmissionForm},
    state::AppState,
};
use axum::{
    extract::{Form, Query, State},
    http::StatusCode,
    response::{Html, IntoResponse, Json},
};

/// The landing page is compiled into the binary so the service works without a
/// template engine or extra runtime file lookup.
pub async fn landing_page() -> Html<&'static str> {
    Html(include_str!("../static/landing.html"))
}

/// The submission page is also embedded for the same reason.
pub async fn main_page() -> Html<&'static str> {
    Html(include_str!("../static/main.html"))
}

/// Return a sentence as JSON for the animated landing page.
pub async fn sentence_endpoint(
    State(state): State<AppState>,
    Query(query): Query<SentenceQuery>,
) -> impl IntoResponse {
    sentence_response(&state, query.seed).await
}

/// Support the legacy POST-based sentence lookup too.
pub async fn sentence_endpoint_post(
    State(state): State<AppState>,
    Form(form): Form<SentenceQuery>,
) -> impl IntoResponse {
    sentence_response(&state, form.seed).await
}

/// Store a submission and return a plain success status.
///
/// The frontend shows the thank-you modal immediately, so the server only needs
/// to reject truly broken requests.
pub async fn submit_endpoint(
    State(state): State<AppState>,
    Form(form): Form<SubmissionForm>,
) -> impl IntoResponse {
    let submission = form.into_clean_submission();

    match db::insert_submission(&state.pool, &submission).await {
        Ok(()) => StatusCode::OK.into_response(),
        Err(error) => {
            eprintln!("failed to store submission: {error}");
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}

async fn sentence_response(state: &AppState, seed: Option<String>) -> axum::response::Response {
    match db::fetch_sentence(&state.pool, seed).await {
        Ok(Some(sentence)) => (StatusCode::OK, Json(sentence)).into_response(),
        Ok(None) => StatusCode::NO_CONTENT.into_response(),
        Err(error) => {
            eprintln!("failed to load sentence: {error}");
            StatusCode::INTERNAL_SERVER_ERROR.into_response()
        }
    }
}
