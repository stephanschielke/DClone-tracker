import {
  HC_SC_MAPPING,
  LADDER_MAPPING,
  PROGRESS_MAPPING,
  REGION_MAPPING,
  TOTAL_DCLONE_STATES,
  entryIdForEntry,
  fetchDiablo2IoDcloneProgress,
  getAlertLevelThreshold,
  getSoundToggle,
  getToggleStates, DIABLO2IO_FETCH_INTERVAL_SECONDS
} from './diablo2io.js';
import {
  D2JSP_FETCH_INTERVAL_SECONDS,
  D2JSP_SEARCH_KEYWORD,
  fetchD2jspForumPage,
  getD2jspToggle
} from './jsporg.js';

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
    if (progress === 1 || alertLevelThreshold === 1) {
      console.debug(`[background] Progress is at 1 or user doesn't want any notifications. Nothing to do here.`)
    } else if (entry.progress >= alertLevelThreshold) {
      // Check if we need to alert the user
      console.log(`[background] Checking alert configuration for ${entryId}.`)
      if (toggleConfig[entryId] === true) {
        await alertUserForEntry(entry)
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
  await setExtensionBadge('NEW')
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
      await setExtensionBadge('JSP')
    }
  }
}

/**
 * Creates and sends a popup notification to the user.
 * @param title The title of the popup notification.
 * @param message The message of the popup notification.
 */
function createPopupNotification(title, message) {
  const options = {
    type: "basic",
    title: title,
    message: message,
    iconUrl: "images/bluecharm_graphic.png"
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
async function setExtensionBadge(text) {
  await chrome.action.setBadgeText({
    text: text
  });
  await chrome.action.setBadgeBackgroundColor({
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
    volume: volume.toString(),
    src: soundFilePath,
    length: soundFileLengthMs.toString()
  };
  url += (new URLSearchParams(parameters)).toString();

  await chrome.windows.create({
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
chrome.alarms.create('runDiablo2ioTask', { periodInMinutes: (DIABLO2IO_FETCH_INTERVAL_SECONDS / 60) });
console.log(`[background] Starting d2jsp.org search task loop (runs every ${D2JSP_FETCH_INTERVAL_SECONDS} seconds).`)
chrome.alarms.create('runD2jspTask', { periodInMinutes: (D2JSP_FETCH_INTERVAL_SECONDS / 60) });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  console.dir(alarm)
  switch (alarm.name) {
    case 'runDiablo2ioTask':
      console.log('Starting runDiablo2ioTask')
      await runDiablo2ioTask()
      break
    case 'runD2jspTask':
      console.log('Starting runD2jspTask')
      await runD2jspTask()
      break
  }
});
