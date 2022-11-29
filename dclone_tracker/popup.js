let dcloneProgressDiv = document.getElementById("dcloneProgress");
let jspToggleInput = document.getElementById("toggleJsp");
let soundToggleInput = document.getElementById("toggleSound");
let alertLevelInput = document.getElementById("alertLevel");

/**
 * Initializes the popup when user clicks on the extension icon.
 * Loads and displays the user settings for alert level threshold and d2jsp.org toggle.
 * Loads and displays the current dclone progress in a table.
 * Loads alert toggle user settings and displays toggles before each diablo2.io dclone tracker row.
 * @returns {Promise<void>}
 */
async function initExtensionPopup() {
  console.log("[popup.js] Initialising Extension Popup...")
  resetExtensionBadge()

  const toggleConfig = await getToggleStates();
  const dcloneProgress = await fetchDiablo2IoDcloneProgress()
  // TODO sort via the API
  dcloneProgress.sort((a, b) => (a.ladder - b.ladder || a.hc - b.hc || a.region.localeCompare(b.region)));

  createTrackerTable(dcloneProgress, toggleConfig)
  addEventListeners();
}

/**
 * Constucts the main table based on dclone progress data and user toggle configuration.
 * @param dcloneProgress The raw diablo2.io dclone progress API data
 * @param toggleConfig The user toggle configuration
 */
function createTrackerTable(dcloneProgress, toggleConfig) {
  const table = document.createElement('table');
  table.className = 'styled-table'
  const tableHeaderRow = table.createTHead().insertRow(0)
  for (entry of ['Alert', 'Progress', 'Ladder', 'Mode', 'Region', 'Updated']) {
    tableHeaderRow.insertCell().innerHTML = entry
  }

  const tableBody = table.createTBody()
  for (const [index, entry] of dcloneProgress.entries()) {
    const tableRow = tableBody.insertRow()
    const entryId = entryIdForEntry(entry)

    tableRow.insertCell().innerHTML = createToggleSection(index, entryId, toggleConfig[entryId]).outerHTML
    tableRow.insertCell().innerHTML = createProgressBar(entry.progress, TOTAL_DCLONE_STATES).outerHTML
    tableRow.insertCell().innerHTML = LADDER_MAPPING[entry.ladder]
    tableRow.insertCell().innerHTML = HC_SC_MAPPING[entry.hc]
    tableRow.insertCell().innerHTML = REGION_MAPPING[entry.region]
    // TODO display a link to diablo2.io if date is too old
    // TODO display time since instead
    const timeAgo = moment.unix(entry.timestamped).startOf('second').fromNow()
    tableRow.insertCell().innerHTML = timeAgo //displayTimeForEntry(timeAgo)
  }

  dcloneProgressDiv.innerHTML = table.outerHTML;
}

/**
 * Creates an interactive checkbox toggle element.
 * @param index The index of the toggle
 * @param entryId The diablo2.io dclone progress entryId
 * @param checked true if should be checked
 * @returns {HTMLElement}
 */
function createToggleSection(index, entryId, checked) {
  const toggle = document.createElement('section');
  toggle.className = 'model-1'

  const checkboxDiv = document.createElement('div');
  checkboxDiv.className = 'checkbox'

  const checkboxInput = document.createElement('input');
  checkboxInput.type = 'checkbox'
  checkboxInput.id = `toggle-${index}`
  checkboxInput.setAttribute('data-entry-id', entryId);
  console.debug("[popup.js] ${entryId} toggle status: " + checked);
  if (checked) {
    checkboxInput.setAttribute('checked', '');
  }

  const label = document.createElement('label');
  label.htmlFor = `toggle-${index}`

  checkboxDiv.appendChild(checkboxInput)
  checkboxDiv.appendChild(label)
  toggle.appendChild(checkboxDiv)
  return toggle
}

/**
 * Creates a static progress bar.
 * TODO create tooltips for PROGRESS_MAPPING when user hovers over div like "Terror gazes upon Sanctuary"
 * @param progress The current progress.
 * @param total The total achievable progress.
 * @returns {HTMLElement}
 */
function createProgressBar(progress, total) {
  const div = document.createElement('div');
  div.className = 'container'

  const progressDiv = document.createElement('div');
  progressDiv.className = 'progress-segment'

  for (var i = 0; i < total; i++) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item')
    if (i < progress) {
      itemDiv.classList.add('my-common')
    }

    progressDiv.appendChild(itemDiv)
  }

  div.appendChild(progressDiv)

  return div;
}

/**
 * Load stored config values for alert level threshold and jsp toggle.
 * @returns {Promise<void>}
 */
async function initExtensionConfig() {
  alertLevelInput.value = await getAlertLevelThreshold();
  soundToggleInput.checked = await getSoundToggle();
  jspToggleInput.checked = await getD2jspToggle();
}

function addEventListeners() {
  dcloneProgress.addEventListener('click', async (e) => {
    console.debug(e);
    if (e.target.tagName === 'INPUT') {
      var newStatus = e.target.checked;
      const entryId = e.target.dataset.entryId
      await setToggleStatus(entryId, newStatus)
    }
  }, false)

  alertLevelInput.addEventListener('click', async (e) => {
    console.debug(e);
    var newAlertLevelThreshold = e.target.value;
    var alertLevelThreshold = await chrome.storage.local.get(ALERT_LEVEL_STORAGE_KEY);
    console.log(`[popup.js] The alert level changed from ${alertLevelThreshold[ALERT_LEVEL_STORAGE_KEY]} to ${newAlertLevelThreshold}`)
    alertLevelThreshold[ALERT_LEVEL_STORAGE_KEY] = newAlertLevelThreshold;
    chrome.storage.local.set(alertLevelThreshold);
  }, false)

  soundToggleInput.addEventListener('click', async (e) => {
    console.debug(e);
    await setSoundToggle(e.target.checked)
  }, false)

  jspToggleInput.addEventListener('click', async (e) => {
    console.debug(e);
    await setD2jspToggle(e.target.checked)
  }, false)
}

/**
 * Removes the badge from the extension icon.
 */
function resetExtensionBadge() {
  chrome.action.setBadgeText({
    text: ""
  });
}

initExtensionConfig();
initExtensionPopup();
