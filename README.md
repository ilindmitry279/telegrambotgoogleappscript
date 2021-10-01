# Telegram Bot Using Google App Script
Sample script to run Telegram bot serverless in Google App Script.

### Setup
  1. Go to [script.google.com/start](https://script.google.com/start) to open the script editor.
  1. Delete any code in the script editor and paste in the code.
  1. Create two (2) new Google Spreadsheet and DO NOT change anything in there.
  1. Replace the constants _tgBotToken_, _sheetID_, _loggerID_, _adminID_ (line 1-4) with your own.
  1. Click on the menu item **Libraries** and add [BetterLog](https://github.com/0pete/BetterLog) script ID _1DSyxam1ceq72bMHsE6aOVeOl94X78WCwiYPytKi7chlg4x5GqiNXSw0l_
  1. Choose a version in the dropdown box (usually best to pick the latest version).
  1. Add our core library **Nahfar** script ID _1dPQyiqL_uRGhDvZtgDOEf-RoDdgMtZx6KjfBf-Zzty3HtXp9TuctHET6_
  1. Choose a version in the dropdown box (usually best to pick the latest version).
  1. Select the menu item File > Save. Name your new script and click OK.
  1. Select Publish > Deploy as web app.
  1. Under Project version, select New.
  1. Under Execute the app as, select your account.
  1. Under Who has access to the app, select "Anyone, even anonymous".
  1. Click Deploy.
  1. Copy the URL labeled Current web app URL and ends with /exec.
  1. Replace the constant _webAppURL_ in the script (need to do this on every new deploy).
  1. Run _setWebHook_ function (need to do this on every new deploy).
  1. Run _oneTimeSetup_ function (only do this once).
  1. Run _scheduler_ function (only do this once).
  1. Now your Telegram bot is up and running.

### Available functions in Nahfar library
  - getUpdate(telegramdata)
  - request(method, payload)
  - sendMessage(text, options)
  - sendMessageKeyboardRemove(text, options)
  - sendMessageForceReply(text, options)
  - sendLocation(latitude, longitude, options)
  - sendVenue(latitude, longitude, title, address, options)
  - sendChatAction(action)
  - editMessageText(text, message_id, options)
  - isTextMessage() : boolean
  - isMap() : boolean
  - isContact() : boolean
  - isBotCommand() : boolean
  - isCallbackQuery() : boolean
  - mentionByID() : string
  - getUserFirstName() : string
  - getUserLastName() : string
  - getUserFullName() : string
  - getUsername() : string
  - getUserID() : number
  - getTextMessage() : string
  - startThreadedConversation(conversation_array)
  - userHasThreadedConversation() : object {found : boolean, step : integer, answers : array}
  - nextMessageInThreadedConversation(conversation_array, step)
  - endThreadedConversation(conversation_array, step) : array
  - addSystemUser(tg_id, bool_auth, bool_admin)
  - getSystemUser(tg_id) : object {id : number, username : string, firstName : string, lastName : string, isAuth : boolean, isAdmin : boolean}
  - authSystemUser(tg_id, bool_auth, bool_admin) : boolean
  - makeAdmin(tg_id, bool) : boolean
  - isAuthSystemUser(tg_id) : boolean
  - isAdmin(tg_id) : boolean

### Current bot commands
  - /start
  - /whoami
  - /request
  - /rate
  - /ask
