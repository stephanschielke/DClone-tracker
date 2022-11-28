try {
  importScripts("diablo2io.js", "jsporg.js");
} catch (e) {
  console.error(e);
}

/**
 * Task to check the DClone progress reported to Diablo2.io
 * Fetches the latest progress from the diablo2.io API
 * and checks if user wants to be alerted for certain region/ladder/hc updates
 * based on the user-configured alert level threshold.
 * @returns {Promise<void>}
 */
async function runDiablo2ioTask() {

  const alertLevelThreshold = await getAlertLevelThreshold()
  const toggleConfig = await getToggleStates()
  const dcloneProgress = await fetchDiablo2IoDcloneProgress()

  for (let entry of dcloneProgress) {
    const entryId = entryIdForEntry(entry)
    const progress = Number(entry.progress)
    if (progress === TOTAL_DCLONE_STATES) {
      console.log(`[background] Progress is at 6. Always notify the user about dclone spawns.`)
      alertUserForEntry(entry)
    } else if (progress === 1 || alertLevelThreshold === 1) {
      console.debug(`[background] Progress is at 1 or user doesn't want any notifications. Nothing to do here.`)
    } else if (entry.progress >= alertLevelThreshold) {
      // Check if we need to alert the user
      console.log(`[background] Checking alert configuration for ${entryId}.`)
      if (toggleConfig[entryId] === true) {
        alertUserForEntry(entry)
      } else {
        // User disabled alert for this entry
        console.log(`[background] ${entryId} progress is above alert threshold of ${alertLevelThreshold}.`)
      }
    }
  }
}


/**
 * Alert the user for a specific dclone progress entry.
 * @param entry A diablo2.io dclone progress entry.
 */
async function alertUserForEntry(entry) {
  // Unfortunately, no new line breaks are allowed. Keeping it short but precise.
  const title = `${PROGRESS_MAPPING[entry.progress]} (${entry.progress}/${TOTAL_DCLONE_STATES})`
  const popupMessage = `Log in with your ${HC_SC_MAPPING[entry.hc]} ${LADDER_MAPPING[entry.ladder]} character to ${REGION_MAPPING[entry.region]} before it's too late!`;
  createPopupNotification(title, popupMessage);
  setExtensionBadge('NEW')
  if (await getSoundToggle() === true) {
    await playSound('sounds/cairnsuccess.wav', 50)
  }
}

/**
 * Fetches the d2jsp.org d2r main page and scans the page for D2JSP_SEARCH_KEYWORD.
 * If D2JSP_SEARCH_KEYWORD is found notify the user.
 * @returns {Promise<void>}
 */
async function runD2jspTask() {
  const jspToggleActivated = await getD2jspToggle()
  if (jspToggleActivated === true) {
    const responseText = await fetchD2jspForumPage()
    if (responseText.toLowerCase().indexOf(D2JSP_SEARCH_KEYWORD.toLowerCase()) >= 0) {
      console.log("d2jsp talking about dclone");
      const title = 'Something is up at d2jsp.org'
      const popupMessage = `People are talking about "${D2JSP_SEARCH_KEYWORD}" at d2jsp.org!`;
      createPopupNotification(title, popupMessage);
      setExtensionBadge('JSP')
    }
  }
}

/**
 * Creates and sends a popup notification to the user.
 * @param title The title of the popup notification.
 * @param message The message of the popup notification.
 */
function createPopupNotification(title, message) {
  var options = {
    type: "basic",
    title: title,
    message: message,
    iconUrl: "images/icon.png"
  };

  chrome.notifications.create(options, notificationDoneCallback);
}

/**
 * Callback for the popup notification
 */
function notificationDoneCallback() {
  console.log("[background] Notification sent.");
}

/**
 * Sets the extension badge.
 * @param {string} text Max 4 character string.
 */
function setExtensionBadge(text) {
  chrome.action.setBadgeText({
    text: text
  });
  chrome.action.setBadgeBackgroundColor({
    color: [255, 255, 0, 255]
  });
}

/**
 * Plays audio files from extension service background workers.
 * Unfortunately, we have to create a visible html page to play sounds.
 * It is not possible to play audio from a background worker!
 *
 * Waiting for Offscreen windows which are currently in beta.
 * With this we wouldn't have to use nasty "invisible" popups.
 *
 * See: https://stackoverflow.com/questions/67437180/play-audio-from-background-script-in-chrome-extention-manifest-v3
 * @param {string} source - path of the audio file
 * @param {number} volumePercent - volume of the playback
 */
async function playSound(source = '/sounds/cairnsuccess.wav', volumePercent = 100) {
  const volume = volumePercent / 100
  const soundFilePath = '/sounds/cairnsuccess.wav'
  const soundFileLengthMs = 2700 // 2652

  let url = chrome.runtime.getURL('audio.html?');
  const parameters = {
    volume: volume,
    src: soundFilePath,
    length: soundFileLengthMs
  };
  url += (new URLSearchParams(parameters)).toString();

  chrome.windows.create({
    type: 'popup',
    focused: false,
    top: 1,
    left: 1,
    height: 1,
    width: 1,
    url,
  })
}

console.log(`[background] Starting diablo2.io task loop (runs every ${DIABLO2IO_FETCH_INTERVAL_SECONDS} seconds).`)
setInterval(runDiablo2ioTask, DIABLO2IO_FETCH_INTERVAL_SECONDS * 1000);

console.log(`[background] Starting d2jsp.org search task loop (runs every ${D2JSP_FETCH_INTERVAL_SECONDS} seconds).`)
setInterval(runD2jspTask, D2JSP_FETCH_INTERVAL_SECONDS * 1000);
