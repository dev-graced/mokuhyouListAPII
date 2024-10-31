class NotificationService {
  constructor() {
    this.dbService = new DatabaseService();
    this.env = LWAPI.getEnv();
    this.setupLWAPI();
  }

  setupLWAPI() {
    let accessToken = PropertiesService.getScriptProperties().getProperty('accessToken');
    let tokenIssueDate = PropertiesService.getScriptProperties().getProperty('tokenIssueDate');

    LWAPI.setAccessTokenToEnv(accessToken, tokenIssueDate, this.env);
    this.env.BOT_ID = CONFIG.LINE_WORKS.BOT_ID;

    PropertiesService.getScriptProperties().setProperty('accessToken', this.env.accessToken);
    PropertiesService.getScriptProperties().setProperty('tokenIssueDate', this.env.tokenIssueDate);
  }

  getApproverIds() {
    return CONFIG.OPERATION.IS_PRODUCTION ? 
      [
        CONFIG.LINE_WORKS.MORIYA_KEIGO_ID,
        CONFIG.LINE_WORKS.MORIYA_KUMI_ID,
        CONFIG.LINE_WORKS.NISHIMURA_ID
      ] : 
      [CONFIG.LINE_WORKS.NISHIMURA_ID];
  }

  async notifyApprovalRequest(mokuhyouId) {
    if (!CONFIG.OPERATION.NOTIFICATION_ENABLED) return;

    const mokuhyouInfo = this.dbService.getMokuhyouInfo(mokuhyouId);
    if (mokuhyouInfo.error) {
      this.notifyDeveloper(mokuhyouInfo.error);
      return;
    }

    const applicantInfo = this.dbService.getMemberInfo(mokuhyouInfo.applicantId);
    if (applicantInfo.error) {
      this.notifyDeveloper(applicantInfo.error);
      return;
    }

    const message = this.createApprovalRequestMessage(applicantInfo.org, mokuhyouInfo.title);
    const uri = `${CONFIG.APP_URL}#view=医院目標リスト_Detail&row=${mokuhyouId}`;
    const buttonMsg = [message, ["uri", "アプリで内容を確認", uri]];

    for (const approverId of this.getApproverIds()) {
      const approverInfo = this.dbService.getMemberInfo(approverId);
      const targetId = CONFIG.OPERATION.USE_TEST_APPROVER ? CONFIG.LINE_WORKS.DEVELOPER_ID : approverId;
      
      await LWAPI.send1ButtonMsg(buttonMsg, targetId, this.env);
      
      const devMessage = `【システム通知】\n\n${approverInfo.lastName}さんに以下の通知を送りました。\n\n${message}`;
      const devButtonMsg = [devMessage, ["uri", "アプリで内容を確認", uri]];
      await LWAPI.send1ButtonMsg(devButtonMsg, CONFIG.LINE_WORKS.DEVELOPER_ID, this.env);
    }
  }

  async notifyDenial(mokuhyouId) {
    if (!CONFIG.OPERATION.NOTIFICATION_ENABLED) return;

    const mokuhyouInfo = this.dbService.getMokuhyouInfo(mokuhyouId);
    if (mokuhyouInfo.error) {
      this.notifyDeveloper(mokuhyouInfo.error);
      return;
    }

    const applicantInfo = this.dbService.getMemberInfo(mokuhyouInfo.applicantId);
    if (applicantInfo.error) {
      this.notifyDeveloper(applicantInfo.error);
      return;
    }

    const message = this.createDenialMessage(mokuhyouInfo.title);
    const targetId = CONFIG.OPERATION.USE_TEST_APPLICANT ? CONFIG.LINE_WORKS.DEVELOPER_ID : mokuhyouInfo.applicantId;

    await LWAPI.sendTextMsg(message, targetId, this.env);
    
    const devMessage = `【システム通知】\n\n${applicantInfo.fullName}さんに以下の通知を送りました。\n\n${message}`;
    await LWAPI.sendTextMsg(devMessage, CONFIG.LINE_WORKS.DEVELOPER_ID, this.env);
  }

  async notifyApproval(mokuhyouId) {
    if (!CONFIG.OPERATION.NOTIFICATION_ENABLED) return;

    const mokuhyouInfo = this.dbService.getMokuhyouInfo(mokuhyouId);
    if (mokuhyouInfo.error) {
      this.notifyDeveloper(mokuhyouInfo.error);
      return;
    }

    const applicantInfo = this.dbService.getMemberInfo(mokuhyouInfo.applicantId);
    if (applicantInfo.error) {
      this.notifyDeveloper(applicantInfo.error);
      return;
    }

    const message = this.createApprovalMessage(mokuhyouInfo.title);
    const targetId = CONFIG.OPERATION.USE_TEST_APPLICANT ? CONFIG.LINE_WORKS.DEVELOPER_ID : mokuhyouInfo.applicantId;

    await LWAPI.sendTextMsg(message, targetId, this.env);
    
    const devMessage = `【システム通知】\n\n${applicantInfo.fullName}さんに以下の通知を送りました。\n\n${message}`;
    await LWAPI.sendTextMsg(devMessage, CONFIG.LINE_WORKS.DEVELOPER_ID, this.env);
  }

  async notifyApprovalRequestCancel(mokuhyouId) {
    if (!CONFIG.OPERATION.NOTIFICATION_ENABLED) return;

    const mokuhyouInfo = this.dbService.getMokuhyouInfo(mokuhyouId);
    if (mokuhyouInfo.error) {
      this.notifyDeveloper(mokuhyouInfo.error);
      return;
    }

    const applicantInfo = this.dbService.getMemberInfo(mokuhyouInfo.applicantId);
    if (applicantInfo.error) {
      this.notifyDeveloper(applicantInfo.error);
      return;
    }

    const message = this.createCancelMessage(applicantInfo.org, mokuhyouInfo.title);

    for (const approverId of this.getApproverIds()) {
      const approverInfo = this.dbService.getMemberInfo(approverId);
      const targetId = CONFIG.OPERATION.USE_TEST_APPROVER ? CONFIG.LINE_WORKS.DEVELOPER_ID : approverId;
      
      await LWAPI.sendTextMsg(message, targetId, this.env);
      
      const devMessage = `【システム通知】\n\n${approverInfo.lastName}さんに以下の通知を送りました。\n\n${message}`;
      await LWAPI.sendTextMsg(devMessage, CONFIG.LINE_WORKS.DEVELOPER_ID, this.env);
    }
  }

  notifyDeveloper(message) {
    if (!CONFIG.OPERATION.NOTIFICATION_ENABLED) return;
    
    const devMessage = `【システム通知】\n\n${message}`;
    LWAPI.sendTextMsg(devMessage, CONFIG.LINE_WORKS.DEVELOPER_ID, this.env);
  }

  createApprovalRequestMessage(org, title) {
    return `医院目標の承認リクエストが来ています。\n\n${org}\n医院目標：${title}\n\nアプリで内容をご確認いただき、OKであれば、「承認」ボタンを、修正が必要であれば「差し戻す」ボタンを押してください。`;
  }

  createDenialMessage(title) {
    return `医院目標計画\n\n${title}\n\nが東風会本部から差し戻されました。\n\n 修正して、再度提出してください。\n 不明な点は、西村事務長にお問い合わせください。`;
  }

  createApprovalMessage(title) {
    return `医院目標計画\n\n${title}\n\nが東風会本部に承認されました！　\nこの計画で実行していってください。`;
  }

  createCancelMessage(org, title) {
    return `以下の医院目標の承認リクエストがキャンセルされました。\n\n${org}\n医院目標：${title}\n\n医院目標は「作成中」の状態に戻ります。\n医院目標の承認を一旦中断してください。`;
  }
}
