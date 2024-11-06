// 環境設定
const CONFIG = {
  // 運用モード設定
  OPERATION: {
    IS_PRODUCTION: true,  // false: テスト環境, true: 本番環境
    NOTIFICATION_ENABLED: true,  // false: 通知無効, true: 通知有効
    USE_TEST_APPLICANT: true,  // false: 実際の申請者, true: 開発者ID
    USE_TEST_APPROVER: true,  // false: 実際の承認者, true: 開発者ID
  },

  // LINE WORKS関連ID
  LINE_WORKS: {
    DEVELOPER_ID: "d6adfeb2-a185-4490-14af-057a829ebbdb",
    MORIYA_KEIGO_ID: "c15a9e50-b91f-46da-143c-0523d0dd98ed",
    MORIYA_KUMI_ID: "be779cf7-42fb-4a9d-1e9e-052170b4a8fb",
    NISHIMURA_ID: "ab78e79e-6e5b-4abd-1754-058430364435",
    BOT_ID: "1420729"  // 東風会スタッフBotID
  },

  // データベース設定
  DATABASE: {
    TOFUKAI_DB: {
      ID: "1ghHzJofYgVAd4EiqCrN2rP53wg2GKL5zNEZ0jcl-cK4",
      SHEETS: {
        MEMBER_MASTER: "メンバーマスタ"
      },
      COLUMNS: {
        MEMBER_ID: 1,
        ORG: 2,
        LAST_NAME: 3,
        FIRST_NAME: 4
      }
    },
    MOKUHYOU_DB: {
      ID: "1gI5F1OOw78weAsJEEmHigRsYYoGJrE9Yh9KJTRWKFxs",
      SHEETS: {
        MOKUHYOU_LIST: "医院目標リスト"
      },
      COLUMNS: {
        MOKUHYOU_ID: 1,
        STATUS: 4,
        TITLE: 6,
        APPLICANT_ID: 7
      }
    }
  },

  // アプリケーションURL
  APP_URL: "https://www.appsheet.com/start/0ce9863a-7cee-4d11-97c1-dd61856c9e2a"
};

// 本番環境の場合の設定を上書き
if (CONFIG.OPERATION.IS_PRODUCTION) {
  CONFIG.OPERATION.NOTIFICATION_ENABLED = true;
  CONFIG.OPERATION.USE_TEST_APPLICANT = false;
  CONFIG.OPERATION.USE_TEST_APPROVER = false;
}
