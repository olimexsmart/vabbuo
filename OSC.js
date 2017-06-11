// Returns a reference to the object. Is is structured to return again an object, to be more versatile
function O(i) { return typeof i === "object" ? i : document.getElementById(i); }

// Return the style handle for an object or an id
function S(i) { return O(i).style; }

// Return an array of objects all being part of the same class
function C(i) { return document.getElementByClassName(i); }
