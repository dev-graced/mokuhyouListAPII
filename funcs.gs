function notifyRequest(mokuhyouSheet,mokuhyouId,mokuhyouIdCol,requestType) {
  /** アプリでのリクエストをLINE WORKS で本部に通知する関数
   * 
   * [引数]
   * mokuhyouSheet: 医院目標DBの医院目標シートオブジェクト
   * mokuhyouId: 医院目標のID
   * mokuhyouIdCol: 医院目標シート内での、医院目標IDの列番号
   * requestType: アプリでのリクエストの種類 (shonin: 医院目標承認リクエスト,result: 取り組み結果の評価リクエスト)
   */

  /** mokuhyouId を医院目標IDに持つ行の行番号を取得 */
  let row = Homon.findRow_fast(mokuhyouSheet,mokuhyouId,mokuhyouIdCol);

  /**  医院目標の情報を取得する */
  let applicantId, title;
  if(row>0){
    applicantId = mokuhyouSheet.getRange(row,applicantIdCol).getValue();
    title = mokuhyouSheet.getRange(row,titleCol).getValue();
  }

  let applicantName,orgName

  /** applicantId から氏名を取得 */
  let result = getNameByMmberId(applicantId);

  if(!result[3]){ 

    /** 氏名を取得 */
    applicantName = result[0];

  }else if(notificationFlag == 1){ 

    /** エラー通知 */
    const msgDev = "【システム通知】\n\n"+result[3];
    LWAPI.sendTextMsg(msgDev,developperId,env);

  };

  /** applicantId から、所属組織名を取得 */
  result = getOrgByMmberId(applicantId);

  if(!result[1]){ 

    /** 組織名を取得 */
    orgName = result[0];

  }else if(notificationFlag == 1){ 

    /** エラー通知 */
    const msgDev = "【システム通知】\n\n"+result[3];
    LWAPI.sendTextMsg(msgDev,developperId,env);

  };

  /** テスト用の設定 */
  if(receiverFlag_applicant == 1){applicantId = developperId;};
  if(receiverFlag_approver == 1){approverId = developperId;};

  /** 
   * 
   * 医院目標計画の承認リクエストを通知する処理 
   * 
   */

  /** 
   * 通知メッセージの設定 
   */

  let msg = "医院目標の承認リクエストが来ています。\n\n"+orgName+"\n医院目標："+title+"\n\nアプリで内容をご確認いただき、OKであれば、「承認」ボタンを、修正が必要であれば「差し戻す」ボタンを押してください。";

  let uri = "https://www.appsheet.com/start/0ce9863a-7cee-4d11-97c1-dd61856c9e2a#view=%E5%8C%BB%E9%99%A2%E7%9B%AE%E6%A8%99%E3%83%AA%E3%82%B9%E3%83%88_Detail&row="+mokuhyouId;

  let bottunMsg = [msg,["uri","アプリで内容を確認",uri]];

  /** 
   * 本部の承認者に承認リクエストを通知する処理 
   */

  for(let i=0;i<approverIds.length;i++){
    /** 個々の承認者に対する処理 */

    if(notificationFlag == 0) continue;

    /** 承認者のIDを設定 */
    approverId = approverIds[i];

    /** approverId から氏名を取得 */
    result = getNameByMmberId(approverId);
    approverMyoji = result[0];

    if(receiverFlag_approver == 1){ 
      /** テスト用設定時の処理 */

      console.log("承認者：",approverMyoji);
      approverMyoji = "[テスト]"+approverMyoji;

    };

    /** 承認者の LW アカウントに、医院目標計画の承認リクエストがあったことを通知 */
    LWAPI.send1ButtonMsg(bottunMsg,approverId,env);

    /** アプリ開発者の LW アカウントに、医院目標計画の承認リクエスト通知が送られたことを通知 */
    let msgDev = "【システム通知】\n\n"+approverMyoji+"さんに以下の通知を送りました。\n\n"+msg
    let bottunMsgDev = [msgDev,["uri","アプリで内容を確認",uri]];
    LWAPI.send1ButtonMsg(bottunMsgDev,developperId,env);
  };

}

function getNameByMmberId(memberId){
///// memberId (LINE WORKS ID: ****@tofukai) から東風会メンバーの氏名を取得する関数
///// 戻り値： memberName = [氏名,姓,名,エラーメッセージ]

  // 東風会DB：メンバーマスタテーブルで、memberId をメンバーIDに持つ行の行番号を取得
  let row = Homon.findRow_fast(memberMasterSheet,memberId,tofukaiMemberIdCol);

  let shimei,myoji,mei,result;
  if(row>0){
    // アクションアイディアの情報を取得する
    myoji = memberMasterSheet.getRange(row,myojiCol).getValue();
    mei = memberMasterSheet.getRange(row,meiCol).getValue();
    shimei = myoji+mei

    result = [shimei,myoji,mei,""];

  }else{
    let errorMsg = "memberId:"+memberId+"に該当する氏名を取得できませんでした。";
    result = ["","","",errorMsg];
  }

  return result
}

function getOrgByMmberId(memberId){
///// memberId (LINE WORKS ID: ****@tofukai) から所属組織名（東風会 / 医院名）を取得する関数
///// 戻り値： [組織名,エラーメッセージ]

  // 東風会DB：メンバーマスタテーブルで、memberId をメンバーIDに持つ行の行番号を取得
  let row = Homon.findRow_fast(memberMasterSheet,memberId,tofukaiMemberIdCol);

  let org,result;
  if(row>0){
    // アクションアイディアの情報を取得する
    org = memberMasterSheet.getRange(row,orgCol).getValue();
    result = [org,""];

  }else{
    let errorMsg = "memberId:"+memberId+"に該当する氏名を取得できませんでした。";
    result = ["",errorMsg];
  }

  return result
}
