const tgBotToken = 'Your-Telegram-Bot-Token-Goes-Here';
const botSheet   = 'Your-Bot-Sheet-ID-Goes-Here';
const loggerSheet= 'Your-Logger-Sheet-ID-Goes-Here';
const superAdmin = ['Telegram-ID-Of-Super-Admin'];
const webAppURL  = 'Your-Web-App-URL';

// https://github.com/peterherrmann/BetterLog
let Logger = BetterLog.useSpreadsheet(loggerSheet);

let SSA = SpreadsheetApp.openById(botSheet);
let Bot = Nahfar.createBot(tgBotToken, SSA);

const sheetNames = {
  'users': ["DatetimeReq", "UserID", "UserHandler", "First Name", "Last Name", "DatetimeAuth", "DatetimeAdmin"],
  'tmp':["UserID", "Step", "Answers", "DateTime"]
};

const threaded = [
  { q: 'Berikan nama penuh anda.' },
  { q: 'Apakah jantina anda?',
    o: {'reply_markup': {'keyboard': [[{ 'text': 'Lelaki' }],[{ 'text': 'Perempuan' }]],'resize_keyboard': true,'one_time_keyboard': true,'input_field_placeholder': 'Lelaki atau perempuan?'}},
    v: '^Lelaki$|^Perempuan$',
    w: '_Tekan papan kekunci di bawah._' },
  { q: 'Apakah nombor telefon bimbit anda?',
    o: {'reply_markup': {'keyboard': [[{ 'text': 'Hantar nombor telefon bimbit', 'request_contact': true }]],'resize_keyboard': true,'one_time_keyboard': true,'input_field_placeholder': 'Nombor telefon bimbit.'}} },
  { q: 'Masukkan nombor kad pengenalan.',
    v: '^\\d{12}$',
    w: '_Format nombor kad pengenalan tidak sah. Sila isi sekali lagi._'}
];

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
      Logger.log(`Creating sheet ${key}...`);
    }

    _removeEmptyColumns(key);
    activeSheet.setFrozenRows(1);    
    activeSheet.getRange(1, 1, 1, activeSheet.getLastColumn()).setFontWeight("bold");
  }
  Logger.log("One time setup is completed!");
}

function scheduler() {
  ScriptApp.newTrigger('_scheduleClearTmp').timeBased().everyDays(1).atHour(4).nearMinute(0).inTimezone("Asia/Kuala_Lumpur").create();
}

function doGet(e) {

}

let TelegramJSON;

function doPost(e) {
  if(e.postData.type == "application/json") {
    TelegramJSON = JSON.parse(e.postData.contents);
    Bot.getUpdate(TelegramJSON);

    Logger.log(JSON.stringify(TelegramJSON));

    let tc = Bot.userHasThreadedConversation();

    // threaded conversation
    if(tc.found) {
      if(tc.step == threaded.length) {
        let ans = Bot.endThreadedConversation(threaded,tc.step);

        if(ans) {
          // do processing here
          Logger.log(ans);

          let msg = "Data telah direkodkan. Terima kasih.";
          Bot.sendMessageKeyboardRemove(msg);
        }
      }
      else
        Bot.nextMessageInThreadedConversation(threaded, tc.step);
    }

    // command message
    else if(Bot.isBotCommand()) {
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
        let a = Bot.getSystemUser();

        if(a && a.isAuth) {
          let msg = "You already are an authorized user.";
          Bot.sendMessage(msg);
          return;
        }
        else if(a) {
          let msg = "You have made a request before. Please wait for the admin to respon.";
          Bot.sendMessage(msg);
          return;
        }

        Bot.addSystemUser();

        let msg = "Your request has been sent to the admin.";
        Bot.sendMessage(msg);

        // send request message to the admin
        let sendTo = Bot.getAdminsID() || superAdmin;

        const len = sendTo.length;
        for(let i = 0; i < len; i++) {
          let options = {
            'chat_id': sendTo[i],
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
      else if(text == '/ask') {
        Bot.startThreadedConversation(threaded);
      }
    }

    // coordinate/location
    else if(Bot.isMap()) {
      let lat  = TelegramJSON.message.location.latitude,
          long = TelegramJSON.message.location.longitude;

      Bot.sendVenue(lat, long, lat+','+long, 'My location right now.');
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

      if(Bot.isAuthSystemUser(cbdata[1])) {
        msg2 = "Request from [" + cbdata[1] + "](tg://user?id=" + cbdata[1] + ") was *completed* before by other admin.";
        Bot.editMessageText(msg2, TelegramJSON.callback_query.message.message_id);
        return;
      }

      if(cbdata[0] == 'approve') {
        Bot.authSystemUser(cbdata[1], true);

        msg  = "_You have been authorized as a user of this bot._";
        msg2 = "Request from [" + cbdata[1] + "](tg://user?id=" + cbdata[1] + ") was *approved* by you.";
      }
      else if(cbdata[0] == 'deny') {
        Bot.authSystemUser(cbdata[1], false);

        msg  = "_Your request have been rejected!_";
        msg2 = "Request from [" + cbdata[1] + "](tg://user?id=" + cbdata[1] + ") was *rejected* by you.";
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

function _scheduleClearTmp() {
  let activeSheet = SSA.getSheetByName('tmp');

  let range = activeSheet.getDataRange();
  let numRows = range.getNumRows();
  let values = range.getValues();

  let rem = 'X';

  let rowsDeleted = 0;
  for (let i = 0; i <= numRows - 1; i++) {
    var row = values[i];
    if (row[0] == rem || row[0] == '') {
      activeSheet.deleteRow((parseInt(i)+1) - rowsDeleted);
      rowsDeleted++;
    }
  }

  Logger.log(`Successfully removed ${rowsDeleted} row(s)`);
}
/** Util - End */
