// Checks to see if a parent element contains a child element
"use strict";

function contains(parent, child) {
  do {
    if (parent === child) {
      return true;
    }
  } while (child && (child = child.parentNode));
  return false;
};
