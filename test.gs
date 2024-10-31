function test_getNameByMmberId(){
  let memberId = "e1c9ba2b-4ffb-47cc-1aa2-050144327fa9";
  let result = getNameByMmberId(memberId);

  if(result[3]){
    console.log(result[3]);
  }
  console.log("氏名:"+result[0]+" 姓："+result[1]+"　名："+result[2]);
}

function test_getOrgByMmberId(){
  let memberId = "e1c9ba2b-4ffb-47cc-1aa2-050144327fa9";
  let result = getOrgByMmberId(memberId);

  if(result[1]){
    console.log(result[1]);
  }
  console.log("組織名:"+result[0]);
}

function test_notifyApprovalRequest(){
  let mokuhyouId = "41f8e952";
  notifyApprovalRequest(mokuhyouId);
}

function test_notifyApprovalRequestCancel(){
  let mokuhyouId = "41f8e952";
  notifyApprovalRequestCancel(mokuhyouId);
}