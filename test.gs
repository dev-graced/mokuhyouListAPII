function test_getNameByMmberId(){
  let memberId = "e1c9ba2b-4ffb-47cc-1aa2-050144327fa9";
  let result = getNameByMmberId(memberId);

  if(result[3]){
    console.log(result[3]);
  }
  console.log("氏名:"+result[0]+" 姓："+result[1]+"　名："+result[2]);
}

function testMethod_getMmberInfo(){

  const dbService = new DatabaseService();

  const memberId = "e1c9ba2b-4ffb-47cc-1aa2-050144327fa9";
  const member = dbService.getMemberInfo(memberId);

  if(member.error){
    console.log(member.error);
  }
  console.log("氏名:",member.fullName,"姓:",member.lastName,"名:",member.firstName,"組織名:"+ member.org);
}

function test_notifyApprovalRequest(){
  let mokuhyouId = "9c8f4b90"; //デモ用 物販20%UP
  notifyApprovalRequest(mokuhyouId);
}

function test_notifyApprovalRequestCancel(){
  let mokuhyouId = "9c8f4b90"; //デモ用 物販20%UP
  notifyApprovalRequestCancel(mokuhyouId);
}

function test_notifyDenial(){
  let mokuhyouId = "9c8f4b90"; //デモ用 物販20%UP
  notifyDenial(mokuhyouId);
}

function test_notifyApproval(){
  let mokuhyouId = "9c8f4b90"; //デモ用 物販20%UP
  notifyApproval(mokuhyouId);
}

function test_notifyEvaluationRequest(){
  let mokuhyouId = "9c8f4b90"; //デモ用 物販20%UP
  notifyEvaluationRequest(mokuhyouId);
}

function test_notifyEvaluationRequestCancel(){
  let mokuhyouId = "9c8f4b90"; //デモ用 物販20%UP
  notifyEvaluationRequestCancel(mokuhyouId);
}

function test_notifyEvaluationDenial(){
  let mokuhyouId = "9c8f4b90"; //デモ用 物販20%UP
  notifyEvaluationDenial(mokuhyouId);
}

function test_notifyEvaluation(){
  let mokuhyouId = "9c8f4b90"; //デモ用 物販20%UP
  notifyEvaluation(mokuhyouId);
}

function test_notifyComment(){
  const mokuhyouId = "9c8f4b90"; //デモ用 物販20%UP
  const senderId = "d6adfeb2-a185-4490-14af-057a829ebbdb";
  const comment = "テスト投稿です";

  notifyComment(mokuhyouId,senderId,comment);
}