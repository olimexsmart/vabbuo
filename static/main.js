// Submission page controller.
//
// This module handles three jobs:
// - initialize Bootstrap tooltips on non-touch devices,
// - show and hide the contact email field,
// - submit the form with fetch instead of jQuery.ajax.

const form = document.getElementById("newsentence");
const emailLabel = document.getElementById("emailLabel");
const emailGroup = document.getElementById("emailGroup");
const marpione = document.getElementById("marpione");
const whyButton = document.getElementById("why");
const thanksModal = new bootstrap.Modal(document.getElementById("thanks"));
const whyModal = new bootstrap.Modal(document.getElementById("whyModal"));
const radioDefault = document.getElementById("radio3");

function syncEmailVisibility() {
    const hidden = !marpione.checked;
    emailLabel.hidden = hidden;
    emailGroup.hidden = hidden;
}

function maybeEnableTooltips() {
    if (window.matchMedia("(pointer: coarse)").matches) {
        return;
    }

    // Tooltips are a nice fit on pointer devices, but they would get in the way
    // on touch-first layouts, so we skip them there.
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((element) => {
        new bootstrap.Tooltip(element);
    });
}

// Bootstrap modals are already in the DOM, so we just wire the controls to
// those instances instead of manually building any overlay logic.
whyButton.addEventListener("click", () => {
    whyModal.show();
});

marpione.addEventListener("change", syncEmailVisibility);
syncEmailVisibility();
maybeEnableTooltips();

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = new URLSearchParams(new FormData(form));

    try {
        await fetch("/submitSentence.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            body: payload,
        });
    } catch (error) {
        // The old UI showed success immediately; we keep the same loose feel,
        // but we still log the network error for the console.
        console.error("submission failed", error);
    }

    form.reset();
    radioDefault.checked = true;
    syncEmailVisibility();
    thanksModal.show();
});
