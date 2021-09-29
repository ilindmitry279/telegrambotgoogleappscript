const tgBotToken = 'Your-Telegram-Bot-Token-Goes-Here';
const sheetID    = 'Your-Sheet-ID-Goes-Here';
const loggerID   = 'Your-Logger-Sheet-ID-Goes-Here';
const adminID    = 'Telegram-ID-Of-Admin';
const webAppURL  = 'Your-Web-App-URL';

// https://github.com/peterherrmann/BetterLog
let Logger = BetterLog.useSpreadsheet(loggerID); 

let SSA = SpreadsheetApp.openById(sheetID);
let Bot = new Rafhan(tgBotToken, SSA);

const sheetNames = {
  'data': ["Datetime", "UserID", "Nama", "Jantina", "No Telefon", "No K/P", "Verified?"],
  'users': ["DatetimeReq", "UserID", "UserHandler", "First Name", "Last Name", "DatetimeAuth"],
  'tmp':["UserID", "Step", "Answers", "DateTime"]
};

function setWebHook() {
  let payload = {
    url: webAppURL
  };

  let response = Bot.request('setWebhook', payload);
  Logger.log(JSON.stringify(response));
}

function oneTimeSetup() {
  for(const key in sheetNames) {
    let activeSheet = SSA.getSheetByName(key);

    if(activeSheet == null) {
      activeSheet = SSA.insertSheet().setName(key);
      activeSheet.appendRow(sheetNames[key]);
    }

    _removeEmptyColumns(key);
    activeSheet.setFrozenRows(1);    
    activeSheet.getRange(1, 1, 1, activeSheet.getLastColumn()).setFontWeight("bold");
    Logger.log(`Creating sheet ${key}...`);
  }
  Logger.log("One time setup is completed!");
}

function doGet(e) {

}

let TelegramJSON;

function doPost(e) {
  if(e.postData.type == "application/json") {
    TelegramJSON = JSON.parse(e.postData.contents);
    Bot.getUpdate(TelegramJSON);

    Logger.log(JSON.stringify(TelegramJSON));

    // command message
    if(Bot.isBotCommand()) {
      let text = TelegramJSON.message.text;

      if(text == '/start') {
        let msg = "Selamat datang [" + Bot.getUserFullName() + "](" + Bot.mentionByID() + ").";

        Bot.sendMessage(msg);
      }
      else if(text == '/whoami') {
        let msg = "`ID        :` `" + Bot.getUserID() + "`\n" +
                  "`Username  :` " + Bot.getUsername() + "\n" +
                  "`First Name:` " + Bot.getUserFirstName() + "\n" +
                  "`Last Name :` " + Bot.getUserLastName() + "\n" +
                  "`Language  :` " + TelegramJSON.message.from.language_code + "\n" +
                  "`Is bot    :` " + TelegramJSON.message.from.is_bot;

        Bot.sendMessage(msg);
      }
      else if(text == '/request') {
        let msg = "Your request has been sent to the Admin.";
        Bot.sendMessage(msg);

        // send request message to the admin
        let options = {
          'chat_id': adminID,
          'reply_markup': {
            'inline_keyboard': [
              [ 
                { 'text': 'Deny', 'callback_data': 'deny_' + Bot.getUserID() }, 
                { 'text': 'Approve', 'callback_data': 'approve_' + Bot.getUserID() }
              ]
            ]
          }
        };

        msg = "This user request you permission\n\n" +
              "`ID        :` [" + Bot.getUserID() + "](" + Bot.mentionByID() + ")\n" +
              "`Username  :` " + Bot.getUsername() + "\n" +
              "`First Name:` " + Bot.getUserFirstName() + "\n" +
              "`Last Name :` " + Bot.getUserLastName() + "\n" +
              "`Language  :` " + TelegramJSON.message.from.language_code + "\n" +
              "`Is bot    :` " + TelegramJSON.message.from.is_bot;
        Bot.sendMessage(msg, options);
      }
      else if(text == '/rate') {
        let options = {
          'reply_markup': {
            'keyboard': [
              [ 
                { 'text': '⭐️' }, 
                { 'text': '⭐️⭐️' }
              ],
              [ 
                { 'text': '⭐️⭐️⭐️' }, 
                { 'text': '⭐️⭐️⭐️⭐️' }
              ]
            ],
            'resize_keyboard': true,
            'one_time_keyboard': true,
            'input_field_placeholder': 'Gimme your stars...'
          }
        };

        let msg = "How do you rate this bot?";
        Bot.sendMessage(msg, options);
      }
    }

    // coordinate/location
    else if(Bot.isMap()) {
      let lat  = TelegramJSON.message.location.latitude,
          long = TelegramJSON.message.location.longitude;

      Bot.sendVenue(lat, long, 'I am here', 'My location right here.');
    }

    // normal message
    else if(Bot.isTextMessage()) {
      let text = TelegramJSON.message.text;

      if(text == '⭐️' || text == '⭐️⭐️' || text == '⭐️⭐️⭐️' || text == '⭐️⭐️⭐️⭐️') {
        Bot.sendMessageKeyboardRemove('Thank you for the rating!');
      }
      else
        Bot.sendChatAction('find_location');

    }

    // callback_query
    else if(Bot.isCallbackQuery()) {
      Bot.request('answerCallbackQuery', { callback_query_id: TelegramJSON.callback_query.id,
                                           show_alert: true,
                                           text: 'I will notify the requester. Thanks!' });

      let cb = TelegramJSON.callback_query;
      let cbdata = cb.data.split('_');
      let msg = '', msg2 = '';

      if(cbdata[0] == 'approve') {
        msg  = "_You have been authorized as Super User._";
        msg2 = "Request from [" + cbdata[1] + "](tg://user?id=" + cbdata[1] + ") was *approved*.";
      }
      else if(cbdata[0] == 'deny') {
        msg  = "_Your request have been rejected!_";
        msg2 = "Request from [" + cbdata[1] + "](tg://user?id=" + cbdata[1] + ") was *rejected*.";
      }

      Bot.sendMessage(msg, { chat_id: cbdata[1] });

      Bot.editMessageText(msg2, TelegramJSON.callback_query.message.message_id);
    }
  }
}



/** Util - Start */
function _removeEmptyColumns(sheetName) {
  let activeSheet = SSA.getSheetByName(sheetName)
  let maxColumns = activeSheet.getMaxColumns(); 
  let lastColumn = activeSheet.getLastColumn();

  if(maxColumns-lastColumn != 0) {
    activeSheet.deleteColumns(lastColumn+1, maxColumns-lastColumn);
  }
}
/** Util - End */
