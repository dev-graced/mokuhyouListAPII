// グローバルインスタンス
const notificationService = new NotificationService();

/**
 * 医院目標の承認リクエストを通知
 */
function notifyApprovalRequest(mokuhyouId) {
  notificationService.notifyApprovalRequest(mokuhyouId);
}

/**
 * 医院目標の差し戻しを通知
 */
function notifyDenial(mokuhyouId) {
  notificationService.notifyDenial(mokuhyouId);
}

/**
 * 医院目標の承認を通知
 */
function notifyApproval(mokuhyouId) {
  notificationService.notifyApproval(mokuhyouId);
}

/**
 * 医院目標の承認リクエストのキャンセルを通知
 */
function notifyApprovalRequestCancel(mokuhyouId) {
  notificationService.notifyApprovalRequestCancel(mokuhyouId);
}

/**
 * 取り組み結果の評価リクエストを通知
 */
function notifyEvaluationRequest(mokuhyouId) {
  notificationService.notifyEvaluationRequest(mokuhyouId);
}

/**
 * 取り組み結果の差し戻しを通知
 */
function notifyEvaluationDenial(mokuhyouId) {
  notificationService.notifyEvaluationDenial(mokuhyouId);
}

/**
 * 取り組み結果の評価完了を通知
 */
function notifyEvaluation(mokuhyouId) {
  notificationService.notifyEvaluation(mokuhyouId);
}

/**
 * 取り組み結果の評価リクエストのキャンセルを通知
 */
function notifyEvaluationRequestCancel(mokuhyouId) {
  notificationService.notifyEvaluationRequestCancel(mokuhyouId);
}
