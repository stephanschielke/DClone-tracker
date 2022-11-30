// TODO put this in extension options
// TODO guarantee to have at least 60s;
export const DIABLO2IO_FETCH_INTERVAL_SECONDS = 600;
export const TOTAL_DCLONE_STATES = 6;

const DIABLO2IO_CONFIG_STORAGE_KEY = "alertToggleStates";
const ALERT_LEVEL_STORAGE_KEY = "alertLevelThreshold";
const SOUND_TOGGLE_STORAGE_KEY = "sound";

const DIABLO2IO_API_ENDPOINT = 'https://diablo2.io/dclone_api.php'
const DEFAULT_ALERT_LEVEL_THRESHOLD = 4

/**
 * Mapping for diablo2.io region API values.
 * @type {{"1": string, "2": string, "3": string}}
 */
export const REGION_MAPPING = {
  1: "Americas",
  2: "Europe",
  3: "Asia"
};

/**
 * Mapping for diablo2.io Ladder/Non-Ladder API values.
 * @type {{"1": string, "2": string}}
 */
export const LADDER_MAPPING = {
  1: "Ladder",
  2: "Non-Ladder",
};

/**
 * Mapping for diablo2.io Hardcore/Softcore API values.
 * @type {{"1": string, "2": string}}
 */
export const HC_SC_MAPPING = {
  1: "Hardcore",
  2: "Softcore",
};

/**
 * Mapping for diablo2.io dclone progress values.
 * @type {{"1": string, "2": string, "3": string, "4": string, "5": string, "6": string}}
 */
export const PROGRESS_MAPPING = {
  1: "Terror gazes upon Sanctuary",
  2: "Terror approaches Sanctuary",
  3: "Terror begins to form within Sanctuary",
  4: "Terror spreads across Sanctuary",
  5: "Terror is about to be unleashed upon Sanctuary",
  6: "Diablo has invaded Sanctuary"
}

/**
 * Fetches raw dclone progress data from the diablo2.io API.
 * @returns {Promise<Array<Array<string>>>} A table of dclone entry rows per region/ladder/hc
 */
export async function fetchDiablo2IoDcloneProgress() {
  console.log(`[diablo2io.js] Fetching data from ${DIABLO2IO_API_ENDPOINT}.`)
  try {
    const apiResponse = await fetch(DIABLO2IO_API_ENDPOINT)
    console.dir(apiResponse)

    if (apiResponse.ok === true) {
      const apiResponseJson = await apiResponse.json();
      console.log(`[diablo2io.js] Diablo2.io API result:`);
      console.table(apiResponseJson)
      return apiResponseJson
    }
  } catch (error) {
    const errorMessage = `Unable to fetch from ${DIABLO2IO_API_ENDPOINT}.`
    console.error(`[diablo2io.js] Error:${errorMessage}.`);
    return {}
  }
}

/**
 * Generates a unique id for a Diablo.io result row
 * based on the region, ladder and hc/sc values.
 * @param entryRow The raw Diablo.io row with region, ladder and hc attributes.
 * @returns {string} A unique id for the Diablo.io entry
 */
export function entryIdForEntry(entryRow) {
  return `${REGION_MAPPING[entryRow.region]}//${LADDER_MAPPING[entryRow.ladder]}//${HC_SC_MAPPING[entryRow.hc]}`;
}

/**
 * Gets all the toggle states from the local storage.
 * @returns {Promise<Object<string, boolean>>} Object of entryIds with status
 */
export async function getToggleStates() {
  const toggleConfigStorage = await chrome.storage.local.get({ [DIABLO2IO_CONFIG_STORAGE_KEY]: {} });
  const toggleConfig = toggleConfigStorage[DIABLO2IO_CONFIG_STORAGE_KEY];
  console.dir(toggleConfig)
  return toggleConfig
}

/**
 * Stores a single new toggle status for a given entry.
 * @param entryId The unique entryId consisting of region/ladder/hc
 * @param value The new status (boolean)
 * @returns {Promise<void>}
 */
export async function setToggleStatus(entryId, value) {
  const toggleConfig = getToggleStates() // TODO add await
  toggleConfig[entryId] = value;
  console.debug(`[diablo2io.js] Storing toggle status ${entryId}=${value}`);

  await chrome.storage.local.set({ [DIABLO2IO_CONFIG_STORAGE_KEY]: toggleConfig });
}

/**
 * Get the currently stored alert threshold user setting.
 * @returns {Promise<number>}
 */
export async function getAlertLevelThreshold() {
  const alertLevelThresholdStorage = await chrome.storage.local.get({ [ALERT_LEVEL_STORAGE_KEY]: DEFAULT_ALERT_LEVEL_THRESHOLD });
  const alertLevelThreshold = alertLevelThresholdStorage[ALERT_LEVEL_STORAGE_KEY];
  console.info(`[diablo2io.js] Currently configured alert level threshold: ${alertLevelThreshold}`);
  return alertLevelThreshold
}

export async function setAlertLevelThreshold(newAlertLevelThreshold) {
  const alertLevelThreshold = await chrome.storage.local.get(ALERT_LEVEL_STORAGE_KEY);
  console.log(`[diablo2io.js] The alert level changed from ${alertLevelThreshold[ALERT_LEVEL_STORAGE_KEY]} to ${newAlertLevelThreshold}`)
  alertLevelThreshold[ALERT_LEVEL_STORAGE_KEY] = newAlertLevelThreshold;
  await chrome.storage.local.set(alertLevelThreshold);
}

/**
 * Gets the current value for the d2jsp.org toggle.
 * @returns {Promise<boolean>}
 */
export async function getSoundToggle() {
  const soundStorage = await chrome.storage.local.get(SOUND_TOGGLE_STORAGE_KEY)
  const toggleValue = soundStorage[SOUND_TOGGLE_STORAGE_KEY];
  console.debug(`[diablo2io.js] Currently configured sound toggle: ${toggleValue}`);
  return toggleValue
}

/**
 * Sets the d2jsp.org toggle.
 * @param {boolean} toggleValue Boolean value for new toggle state.
 * @returns {Promise<void>}
 */
export async function setSoundToggle(toggleValue) {
  console.debug(`[diablo2io.js] Storing sound toggle: ${toggleValue}`);
  await chrome.storage.local.set({ [SOUND_TOGGLE_STORAGE_KEY]: toggleValue });
}


