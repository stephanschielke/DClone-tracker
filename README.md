A Diablo Clone Tracker Chrome Extension
=======================================

Screenshots
-----------
Extension window:

![Plugin Popup](./img/screenshot.png)

Notification example:

![Notification](./img/notification.png)

Features
--------

- Overview of all regions and play-modes
- Subscribe to specific regions and play-modes
- Configuration of an alert threshold to only get notified if progress is at x/6
- Chrome notification while your browser is open
- Sound notification for alerts
- Warning of stale progress data with link to the progress reporter
- Listen to d2jsp.org and get notified if people are talking about "dclone"

DClone Progress Data
--------------------

The progress data is coming from
the [diablo2.io dclone tracker API](https://diablo2.io/forums/diablo-clone-uber-diablo-tracker-public-api-t906872.html)
and is updated by users.

This is a community project and requires community effort, so we encourage you to report and update any new dclone
progress [here](https://diablo2.io/dclonetracker.php). Let's keep the data accurate and up-to-date so you will never
miss a diablo clone event ever again!

Installation
------------

### Via the Chrome Store

* [Diablo Clone Tracker](https://chrome.google.com/webstore/detail/diablo-clone-tracker/mfjeadanndcldhgglfppiphmmjbklohf)
* Note the version in the official store might lag behind
  the [latest release](https://github.com/stephanschielke/DClone-tracker/releases)

### Via the `.crx` file

* Download the [dclone_tracker.crx](https://github.com/stephanschielke/DClone-tracker/blob/main/dclone_tracker.crx) file
* Drag and drop the file into your Chrome browser window
* Click `Add extension`

![Installation Popup](./img/install_extension.png)

### From the source code via `git`

* Clone the repository
    * `git clone https://github.com/stephanschielke/DClone-tracker.git`
* Go to [chrome://extensions/](chrome://extensions/)
* Enable `Developer mode`
* Click `Load unpacked`
* Select the `dclone_tracker` folder

Usage
-----
Open the extension by clicking on it.

Select an alert threshold (`1,2,3,4,5,6`) with the slider. The default is `4` (`"Terror spreads across Sanctuary"`).
You can disable alerts and notifications entirely by setting the alert threshold to `1`.
The maximum setting is `6`, which will alert you only if the dclone event has been triggered (and was reported).

Enable or disable the alert for specific regions and game modes.

Enable or disable a sound notification that goes along the Chrome notifications when triggered.
*This is an experimental feature and due to a lack of functionality in Chrome requires a popup :frowning:.*

Once a progress is **equal or higher** than your configured alert threshold for any of your subscribed regions and game
modes a notification will pop up.

If the report data is stale (last report older than 1 day) then a warning is displayed. Please use the provided link to
update the current progress yourself.

You can enable notifications every time someone at d2jsp.org is talking about "Dclone".

Report Issues
-------------
Use the [GitHub Issues](https://github.com/stephanschielke/DClone-tracker/issues) function to report bugs or feature
requests.

Wishlist
--------

- Publish to the official Chrome Web Store
    - Already submitted but is pending a review by Google
- Create Chrome extension options page
- Create tooltips when hovering over the progress bar
- Cache results for the popup. Invalidate/update cache on timer trigger
- Display the alert threshold with a concrete number
- Let user control if they want to be re-notified
- Let user decide how often to poll for updates
    - currently fixed to every 60s
- d2jsp.org
    - Let the user control what messages to look out for
    - Observe more than just the d2r software non-ladder topic

Contribute
----------
If you know HTML, CSS, a little JavaScript and have a Chrome browser you are good to go!
We don't have a process for contributing, so best to reach out via the `Discussion` tab in GitHub.

