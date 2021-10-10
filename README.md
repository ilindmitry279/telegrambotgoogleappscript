# Telegram Bot Using Google App Script
Sample script to run Telegram bot serverless in Google App Script.

### Setup
  1. Go to [script.google.com/start](https://script.google.com/start) to open the script editor.
  1. Delete any code in the script editor and paste in the code.
  1. Create two (2) new Google Spreadsheets and DO NOT change anything in there.
  1. Replace the constants _tgBotToken_, _botSheet_, _loggerSheet_, _superAdmin_ (line 1-4) with your own.
  1. Click on the menu item **Libraries** and add [BetterLog](https://github.com/0pete/BetterLog) script ID `1DSyxam1ceq72bMHsE6aOVeOl94X78WCwiYPytKi7chlg4x5GqiNXSw0l`
  1. Choose a version in the dropdown box (usually best to pick the latest version).
  1. Add our core library **Nahfar** script ID `1dPQyiqL_uRGhDvZtgDOEf-RoDdgMtZx6KjfBf-Zzty3HtXp9TuctHET6`
  1. Choose a version in the dropdown box (usually best to pick the latest version).
  1. Save your new script.
  1. Click **Deploy** and select **New Deployment**.
  1. Select Type as **Web app**.
  1. Under execute the app as (**Execute as**), select your account.
  1. Under **Who has access** to the app, select **Anyone**.
  1. Click Deploy.
  1. Copy the URL labeled **Web app URL**.
  1. Replace the constant _webAppURL_ in the script (need to do this on every new deploy).
  1. Run _setWebHook_ function (need to do this on every new deploy).
  1. Run _oneTimeSetup_ function (only do this once).
  1. Run _scheduler_ function (only do this once).
  1. Now your Telegram bot is up and running.

### Available functions in Nahfar library
  - settingUpBotSheet()
  - cleanUpBotTmpData()
  - getUpdate(telegramdata)
  - request(method, payload)
  - sendMessage(text, options)
  - sendMessageTo(chatid, text, options)
  - sendMessageCustomKeyboard(text, keyboard, placeholder, options)
  - sendMessageCustomKeyboardTo(chatid, text, keyboard, placeholder, options)
  - sendMessageKeyboardRemove(text, options)
  - sendMessageKeyboardRemoveTo(chatid, text, options)
  - sendMessageForceReply(text, placeholder, options)
  - sendMessageForceReplyTo(chatid, text, placeholder, options)
  - sendLocation(latitude, longitude, options)
  - sendLocationTo(chatid, latitude, longitude, options)
  - sendVenue(latitude, longitude, title, address, options)
  - sendVenueTo(chatid, latitude, longitude, title, address, options)
  - sendChatAction(action, options)
  - sendChatActionTo(chatid, action, options)
  - editMessageText(text, messageid, chatid, options)
  - editMessageReplyMarkup(messageid, chatid, inlinekeyboard, options)
  - getUserID(obj) : _number_
  - mentionByID(obj) : _string_
  - getUserFirstName(obj) : _string_
  - getUserLastName(obj) : _string_
  - getUserFullName(obj) : _string_
  - getUsername(obj) : _string_
  - getTextMessage() : _string_
  - isTextMessage() : _boolean_
  - isMap() : _boolean_
  - isContact() : _boolean_
  - isBotCommand() : _boolean_
  - isCallbackQuery() : _boolean_
  - isForwarded() : _boolean_
  - hasForwardedFrom() : _object_
  - startThreadedConversation(array, overwite)
  - userHasThreadedConversation() : _object {found : boolean, step : integer, answers : array}_
  - nextMessageInThreadedConversation(array, step, customtext, overwrite, validateoverwrite)
  - endThreadedConversation(array, step, overwrite, validateoverwrite) : _array_
  - cancelThreadedConversation()
  - addSystemUser(tgid, isauth, isadmin)
  - getSystemUser(tgid) : _object {id : number, username : string, firstName : string, lastName : string, isAuth : boolean, isAdmin : boolean}_
  - authSystemUser(tgid, isauth, isadmin) : _boolean_
  - makeAdmin(tgid, isadmin) : _boolean_
  - getAdminsID() : _array_
  - isAuthSystemUser(tgid) : _boolean_
  - isAdmin(tgid) : _boolean_

### Current bot commands
  - /start
  - /whoami
  - /request
  - /rate
  - /ask
  - /menu

### Quota for the Google Apps Script
| Feature | Consumer and G Suite free edition (legacy) | Google Workspace accounts |
|:--------|--------:|--------:|
| Script runtime | 6 min / execution | 6 min / execution |
| Custom function runtime | 30 sec / execution | 30 sec / execution |
| Simultaneous executions | 30 | 30 |
| Triggers | 20 / user / script | 20 / user / script |
| URL Fetch calls | 20,000 / day | 100,000 / day |
| URL Fetch response size | 50 MB / call | 50 MB / call |
| URL Fetch headers | 100 / call | 100 / call |
| URL Fetch headers size | 8 KB / call | 8 KB / call |
| URL Fetch POST size | 50 MB / call | 50 MB / call |
| URL Fetch URL length | 2 KB / call | 2 KB / call |

Source: [Quotas for Google Services](https://developers.google.com/apps-script/guides/services/quotas)
