class DatabaseService {
  constructor() {
    // 東風会DB初期化
    this.tofukaiDB = SpreadsheetApp.openById(CONFIG.DATABASE.TOFUKAI_DB.ID);
    this.memberMasterSheet = this.tofukaiDB.getSheetByName(CONFIG.DATABASE.TOFUKAI_DB.SHEETS.MEMBER_MASTER);

    // 医院目標DB初期化
    this.mokuhyouDB = SpreadsheetApp.openById(CONFIG.DATABASE.MOKUHYOU_DB.ID);
    this.mokuhyouSheet = this.mokuhyouDB.getSheetByName(CONFIG.DATABASE.MOKUHYOU_DB.SHEETS.MOKUHYOU_LIST);
  }

  getMemberInfo(memberId) {
    const row = Homon.findRow_fast(
      this.memberMasterSheet,
      memberId,
      CONFIG.DATABASE.TOFUKAI_DB.COLUMNS.MEMBER_ID
    );

    if (row <= 0) {
      return {
        error: `memberId:${memberId}に該当する情報を取得できませんでした。`
      };
    }

    const lastName = this.memberMasterSheet.getRange(row, CONFIG.DATABASE.TOFUKAI_DB.COLUMNS.LAST_NAME).getValue();
    const firstName = this.memberMasterSheet.getRange(row, CONFIG.DATABASE.TOFUKAI_DB.COLUMNS.FIRST_NAME).getValue();
    const org = this.memberMasterSheet.getRange(row, CONFIG.DATABASE.TOFUKAI_DB.COLUMNS.ORG).getValue();

    return {
      fullName: lastName + firstName,
      lastName,
      firstName,
      org,
      error: null
    };
  }

  getMokuhyouInfo(mokuhyouId) {
    const row = Homon.findRow_fast(
      this.mokuhyouSheet,
      mokuhyouId,
      CONFIG.DATABASE.MOKUHYOU_DB.COLUMNS.MOKUHYOU_ID
    );

    if (row <= 0) {
      return {
        error: `mokuhyouId:${mokuhyouId}に該当する情報を取得できませんでした。`
      };
    }

    return {
      applicantId: this.mokuhyouSheet.getRange(row, CONFIG.DATABASE.MOKUHYOU_DB.COLUMNS.APPLICANT_ID).getValue(),
      title: this.mokuhyouSheet.getRange(row, CONFIG.DATABASE.MOKUHYOU_DB.COLUMNS.TITLE).getValue(),
      error: null
    };
  }
}
