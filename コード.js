/** テスト２
////////////// 本番運用設定 !!!  コード修正時は必ず確認！！！　//////////////////////////////////////////////

const honbanFlag = 0; // 0: テスト運用  1: 本番運用

const lwId_moriyaKeigo = "c15a9e50-b91f-46da-143c-0523d0dd98ed";
const lwId_moriyaKumi = "be779cf7-42fb-4a9d-1e9e-052170b4a8fb";
const lwId_nishimura = "ab78e79e-6e5b-4abd-1754-058430364435";
//////////////////////////////////////////////////////////////////////////

///////////////////  テスト運用設定 ///////////////////////////////////////////////
let notificationFlag = 1; // 0: 通知を送信しない 1: LINE WORKS に通知を送信する
let receiverFlag_applicant = 1; // 0: default  1: developperId 
let receiverFlag_approver = 1; // 0: default  1: developperId （本部承認者用）
let approverIds = [lwId_nishimura];
/////////////////////////////////////////////////////////////////////////////////

///////////////////  変更不可！！　触るな！！！　/////////////////////////////////////////////////
if(honbanFlag == 1){
  notificationFlag = 1; 
  receiverFlag_applicant = 0; 
  receiverFlag_approver = 0; 
  approverIds = [lwId_moriyaKeigo,lwId_moriyaKumi,lwId_nishimura];
};
//////////////////////////////////////////////////////////////////////////////////

/////////////////////// LINE WORKS API の設定（アクセストークンなど）///////////////////////
const developperId = "d6adfeb2-a185-4490-14af-057a829ebbdb"; //高江洲の LINE WORKS ID
let env = LWAPI.getEnv();
setLWAPI(env);

///////////// 東風会DBの設定 ///////////////////////////////////////////////
const tofukaiDBId = "1ghHzJofYgVAd4EiqCrN2rP53wg2GKL5zNEZ0jcl-cK4"; // 東風会DBのID
const ssTofukaiDB = SpreadsheetApp.openById(tofukaiDBId);
const memberMasterSheet = ssTofukaiDB.getSheetByName("メンバーマスタ"); 

const tofukaiMemberIdCol = 1;
const orgCol = 2;
const myojiCol = 3;
const meiCol = 4;

///////////// 医院目標DBの設定 ///////////////////////////////////////////////
const mokuhyouDBId = "1gI5F1OOw78weAsJEEmHigRsYYoGJrE9Yh9KJTRWKFxs"; // 医院目標DBのID
const ss_mokuhyouDB = SpreadsheetApp.openById(mokuhyouDBId);
const mokuhyouSheet = ss_mokuhyouDB.getSheetByName("医院目標リスト"); 

const mokuhyouIdCol = 1;
const statusCol = 4;
const titleCol = 6;
const applicantIdCol = 7;

///////////////////  関数　///////////////////////////////////
function setLWAPI(env){
// LINE WORKS API の情報を env にセットする関数

  // LINE WORKS APIを実行するためのアクセストークンを取得して env に追加
  let accessToken = PropertiesService.getScriptProperties().getProperty('accessToken');
  let tokenIssueDate = PropertiesService.getScriptProperties().getProperty('tokenIssueDate');

  LWAPI.setAccessTokenToEnv(accessToken,tokenIssueDate,env);
  console.log("accessToken",env.accessToken);

  // 訪問BotのBotId を env に追加
  //let botId = "1418596"; //訪問BotID
  let botId = "1420729"; //東風会スタッフBotID
  env.BOT_ID = botId;

  //　アクセストークンの情報をスクリプトプロパティに記録する
  PropertiesService.getScriptProperties().setProperty('accessToken',env.accessToken);
  PropertiesService.getScriptProperties().setProperty('tokenIssueDate',env.tokenIssueDate);
}

function notifyApprovalRequest(mokuhyouId) {
// 承認リクエストをLINE WORKS で本部に通知する関数

  // mokuhyouId を医院目標IDに持つ行の行番号を取得
  let row = Homon.findRow_fast(mokuhyouSheet,mokuhyouId,mokuhyouIdCol);

  // 医院目標の情報を取得する
  let applicantId, title;
  if(row>0){
    applicantId = mokuhyouSheet.getRange(row,applicantIdCol).getValue();
    title = mokuhyouSheet.getRange(row,titleCol).getValue();
  }

  let applicantName,orgName

  // applicantId から氏名を取得
  let result = getNameByMmberId(applicantId);

  if(result[3]){ // エラー通知
    if(notificationFlag==1){
      let msgDev = "【システム通知】\n\n"+result[3];
      LWAPI.sendTextMsg(msgDev,developperId,env);
    }

  }else{ // 氏名を取得
    applicantName = result[0];
  };

  // applicantId から、所属組織名を取得
  result = getOrgByMmberId(applicantId);
  if(result[1]){ // エラー通知
    if(notificationFlag==1){
      let msgDev = "【システム通知】\n\n"+result[3];
      LWAPI.sendTextMsg(msgDev,developperId,env);
    }

  }else{ // 組織名を取得
    orgName = result[0];
  };

  ///////////   テスト用の設定　/////////////////////////////
  if(receiverFlag_applicant == 1){applicantId = developperId;};
  if(receiverFlag_approver == 1){approverId = developperId;};
  //////////////////////////////////////////////////////////////

  //// 医院目標計画の承認リクエストを通知する
  let msg = "医院目標の承認リクエストが来ています。\n\n"+orgName+"\n医院目標："+title+"\n\nアプリで内容をご確認いただき、OKであれば、「承認」ボタンを、修正が必要であれば「差し戻す」ボタンを押してください。";

  let uri = "https://www.appsheet.com/start/0ce9863a-7cee-4d11-97c1-dd61856c9e2a#view=%E5%8C%BB%E9%99%A2%E7%9B%AE%E6%A8%99%E3%83%AA%E3%82%B9%E3%83%88_Detail&row="+mokuhyouId;

  let bottunMsg = [msg,["uri","アプリで内容を確認",uri]];

  if(notificationFlag==1){
    for(let i=0;i<approverIds.length;i++){

      //通知先の設定
      approverId = approverIds[i];

      // approverId から氏名を取得
      result = getNameByMmberId(approverId);
      approverMyoji = result[0];

      if(receiverFlag_approver == 1){ // テスト用。通知は developperId に送られる
        console.log("承認者：",approverMyoji);
        approverId = developperId;
        approverMyoji = "[テスト]"+approverMyoji;
      };

      // LW に通知
      LWAPI.send1ButtonMsg(bottunMsg,approverId,env);

      let msgDev = "【システム通知】\n\n"+approverMyoji+"さんに以下の通知を送りました。\n\n"+msg
      let bottunMsgDev = [msgDev,["uri","アプリで内容を確認",uri]];
      LWAPI.send1ButtonMsg(bottunMsgDev,developperId,env);
    };
  }
}

function notifyDenial(mokuhyouId) {
// 承認リクエストの差し戻しをLINE WORKS で代表連絡者に通知する関数

  // mokuhyouId を医院目標IDに持つ行の行番号を取得
  let row = Homon.findRow_fast(mokuhyouSheet,mokuhyouId,mokuhyouIdCol);

  // 医院目標の情報を取得する
  let applicantId,title;
  if(row>0){
    applicantId = mokuhyouSheet.getRange(row,applicantIdCol).getValue();
    title = mokuhyouSheet.getRange(row,titleCol).getValue();
  }

  // applicantId から氏名を取得
  let result = getNameByMmberId(applicantId);

  let applicantName;
  if(result[3]){ // エラー通知
    if(notificationFlag==1){
      let msgDev = "【システム通知】\n\n"+result[3];
      LWAPI.sendTextMsg(msgDev,developperId,env);
    }

  }else{ // 氏名を取得
    applicantName = result[0];
  };

  ///////////   テスト用の設定　/////////////////////////////
  if(receiverFlag_applicant == 1){applicantId = developperId;};
  //////////////////////////////////////////////////////////////

  // 医院目標計画の差し戻しを LINE WORKS で通知する
  let msg = "医院目標計画\n\n"+title+"\n\nが東風会本部から差し戻されました。\n\n 修正して、再度提出してください。\n 不明な点は、西村事務長にお問い合わせください。";
  if(notificationFlag==1){
    LWAPI.sendTextMsg(msg,applicantId,env);
    let msgDev = "【システム通知】\n\n"+applicantName+"さんに以下の通知を送りました。\n\n"+msg
    LWAPI.sendTextMsg(msgDev,developperId,env);
  }
}

function notifyApproval(mokuhyouId) {
// 医院目標計画の承認をLINE WORKS で代表連絡者に通知する関数

  // mokuhyouId を医院目標IDに持つ行の行番号を取得
  let row = Homon.findRow_fast(mokuhyouSheet,mokuhyouId,mokuhyouIdCol);

  let applicantId,title;
  if(row>0){
    // アクションアイディアの情報を取得する
    applicantId = mokuhyouSheet.getRange(row,applicantIdCol).getValue();
    title = mokuhyouSheet.getRange(row,titleCol).getValue();
  };

  //// applicantId から氏名を取得
  let result = getNameByMmberId(applicantId);

  if(result[3]){ // エラー通知
    if(notificationFlag==1){
      let msgDev = "【システム通知】\n\n"+result[3];
      LWAPI.sendTextMsg(msgDev,developperId,env);
    }

  }else{ // 氏名を取得
    applicantName = result[0];
  };

  ///////////   テスト用の設定！！！　/////////////////////////////
  if(receiverFlag_applicant == 1){applicantId = developperId;};
  //////////////////////////////////////////////////////////////

  // 医院目標計画の承認を LINE WORKS で通知する
  
  let msg = "医院目標計画\n\n"+title+"\n\nが東風会本部に承認されました！　\n"+"この計画で実行していってください。";

  if(notificationFlag==1){
    LWAPI.sendTextMsg(msg,applicantId,env);
    let msgDev = "【システム通知】\n\n"+applicantName+"さんに以下の通知を送りました。\n\n"+msg
    LWAPI.sendTextMsg(msgDev,developperId,env);
  }
}

function notifyApprovalRequestCancel(mokuhyouId){
// 医院目標の承認リクエストのキャンセルを LINE WORKS で承認者に通知する関数

  let row = Homon.findRow_fast(mokuhyouSheet,mokuhyouId,mokuhyouIdCol);

  let applicantId,title,applicantName,orgName;
  if(row>0){
    // アクションアイディアの情報を取得する
    applicantId = mokuhyouSheet.getRange(row,applicantIdCol).getValue();
    title = mokuhyouSheet.getRange(row,titleCol).getValue();
  };

  // applicantId から氏名を取得
  let result = getNameByMmberId(applicantId);

  if(result[3]){ // エラー通知
    if(notificationFlag==1){
      let msgDev = "【システム通知】\n\n"+result[3];
      LWAPI.sendTextMsg(msgDev,developperId,env);
    }

  }else{ // 氏名を取得
    applicantName = result[0];
  };

  // applicantId から、所属組織名を取得
  result = getOrgByMmberId(applicantId);
  if(result[1]){ // エラー通知
    if(notificationFlag==1){
      let msgDev = "【システム通知】\n\n"+result[3];
      LWAPI.sendTextMsg(msgDev,developperId,env);
    }

  }else{ // 組織名を取得
    orgName = result[0];
  };

  ///////////   テスト用の設定　/////////////////////////////
  if(receiverFlag_applicant == 1){applicantId = developperId;};
  if(receiverFlag_approver == 1){approverId = developperId;}; // システム開発者のId
  //////////////////////////////////////////////////////////////

  //// 医院目標の承認リクエストのキャンセルを通知する
  let msg = "以下の医院目標の承認リクエストがキャンセルされました。\n\n"+orgName+"\n医院目標："+title+"\n\n医院目標は「作成中」の状態に戻ります。\n医院目標の承認を一旦中断してください。";

  if(notificationFlag==1){
    for(let i=0;i<approverIds.length;i++){

      //通知先の設定
      approverId = approverIds[i];

      // approverId から氏名を取得
      result = getNameByMmberId(approverId);
      approverMyoji = result[0];

      if(receiverFlag_approver == 1){ // テスト用。通知は developperId に送られる
        console.log("承認者：",approverMyoji);
        approverId = developperId;
        approverMyoji = "[テスト]"+approverMyoji;
      };

      // LW に通知
      LWAPI.sendTextMsg(msg,approverId,env);

      let msgDev = "【システム通知】\n\n"+approverMyoji+"さんに以下の通知を送りました。\n\n"+msg
      LWAPI.sendTextMsg(msgDev,developperId,env);
    };
  }
}
*/