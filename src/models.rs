use serde::{Deserialize, Serialize};

/// Seed query used by the sentence endpoint.
///
/// The old app sent a random integer from the browser and used that to pick
/// a sentence deterministically. We keep that shape, but the backend now
/// accepts the seed as a string and parses it defensively.
#[derive(Debug, Deserialize)]
pub struct SentenceQuery {
    pub seed: Option<String>,
}

/// JSON payload returned to the animated landing page.
#[derive(Debug, Serialize)]
pub struct SentenceResponse {
    pub sentence: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub author: Option<String>,
}

/// Incoming submission form.
///
/// The field names intentionally mirror the old HTML so the page can be
/// replaced without changing the user-visible copy or the browser form IDs.
#[derive(Debug, Deserialize)]
pub struct SubmissionForm {
    pub nickname: Option<String>,
    pub sentence: Option<String>,
    pub email: Option<String>,
    pub sex: Option<String>,
    pub marpione: Option<String>,
    pub other: Option<String>,
}

/// Cleaned submission values ready for storage.
#[derive(Debug)]
pub struct CleanSubmission {
    pub nickname: Option<String>,
    pub sentence: Option<String>,
    pub email: Option<String>,
    pub sex: Option<String>,
    pub contact: bool,
    pub other: Option<String>,
}

impl SubmissionForm {
    /// Normalize the browser form into database-friendly values.
    ///
    /// This trims whitespace, collapses empty strings to `None`, and ignores
    /// the email field unless the contact checkbox was actually checked.
    pub fn into_clean_submission(self) -> CleanSubmission {
        let contact = self.marpione.is_some();

        CleanSubmission {
            nickname: normalize_optional(self.nickname),
            sentence: normalize_optional(self.sentence),
            email: if contact {
                normalize_optional(self.email)
            } else {
                None
            },
            sex: normalize_optional(self.sex),
            contact,
            other: normalize_optional(self.other),
        }
    }
}

/// Collapse blank values to `None`.
pub fn normalize_optional(value: Option<String>) -> Option<String> {
    value.and_then(|raw| {
        let trimmed = raw.trim();
        if trimmed.is_empty() {
            None
        } else {
            Some(trimmed.to_owned())
        }
    })
}

#[cfg(test)]
mod tests {
    use super::normalize_optional;

    #[test]
    fn blank_strings_become_none() {
        assert_eq!(normalize_optional(Some("   ".to_string())), None);
    }

    #[test]
    fn non_blank_strings_are_trimmed() {
        assert_eq!(
            normalize_optional(Some("  vabbuo  ".to_string())),
            Some("vabbuo".to_string())
        );
    }
}
