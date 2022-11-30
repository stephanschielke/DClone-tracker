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

Until this extension is approved by Google and available in the Chrome Web Store you have to manually install it.

### Via the `.crx` file

* Download the [dclone_tracker.crx](https://github.com/stephanschielke/DClone-tracker/blob/main/dclone_tracker.crx) file
* Drag and drop the file into your Chrome browser window
* Click `Add extension` ![Installation Popup](./img/install_extension.png)

### Via the `.zip` file

* Download the [dclone_tracker.zip](https://github.com/stephanschielke/DClone-tracker/blob/main/dclone_tracker.zip)
  file
* Unzip the file
* Go to [chrome://extensions/](chrome://extensions/)
* Enable `Developer mode`
* Click `Load unpacked`
* Select the `dclone_tracker` folder

### From the source code via `git`

* Clone the repository
    * `git clone https://github.com/stephanschielke/DClone-tracker.git`
* Go to [chrome://extensions/](chrome://extensions/)
* Enable `Developer mode`
* Click `Load unpacked`
* Select the `dclone_tracker` folder

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

