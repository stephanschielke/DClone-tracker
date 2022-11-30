// TODO put this in extension options
// Timings between API requests from your app should never be less than 60 seconds apart.
// Obviously whilst developing you'll be making tonnes of requests (no problem),
// but if your final production code is making automated requests more often than this,
// you will have your access revoked.

export const D2JSP_FETCH_INTERVAL_SECONDS = 60;
export const D2JSP_SEARCH_KEYWORD = 'DClone';

const D2JSP_TOGGLE_STORAGE_KEY = 'jsp';
// TODO also watch the hc forum page
const D2JSP_FORUM_URL = 'https://forums.d2jsp.org/forum.php?f=271&t=5'

/**
 * Fetches the text of D2JSP_FORUM_URL.
 * @returns {Promise<string>}
 */
export async function fetchD2jspForumPage() {
  console.log(`[jsporg.js] Fetching data from ${D2JSP_FORUM_URL}.`)
  const response = await fetch(D2JSP_FORUM_URL)
  console.dir(response)

  if (response.ok === true) {
    const responseText = await response.text();
    console.debug(`[jsporg.js] d2jsp.org result: ${responseText}`);
    return responseText
  } else {
    const errorMessage = `Unable to fetch from ${D2JSP_FORUM_URL}.`
    console.error(`[jsporg.js] Error:${errorMessage}.`);
    throw Error(errorMessage)
  }
}

/**
 * Gets the current value for the d2jsp.org toggle.
 * @returns {Promise<boolean>}
 */
export async function getD2jspToggle() {
  const jspStorage = await chrome.storage.local.get(D2JSP_TOGGLE_STORAGE_KEY)
  const toggleValue = jspStorage[D2JSP_TOGGLE_STORAGE_KEY];
  console.debug(`[jsporg.js] Currently configured jsp toggle: ${toggleValue}`);
  return toggleValue
}

/**
 * Sets the d2jsp.org toggle.
 * @param toggleValue Boolean value for new toggle state.
 * @returns {Promise<void>}
 */
export async function setD2jspToggle(toggleValue) {
  console.debug(`[jsporg.js] Storing jsp toggle: ${toggleValue}`);
  await chrome.storage.local.set({ [D2JSP_TOGGLE_STORAGE_KEY]: toggleValue });
}
