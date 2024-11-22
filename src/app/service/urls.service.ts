import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlsService {
  urlObject: any;

  // **************************Development Url************************************
  // *****************************************************************************

  // masterUrl = 'https://querynest.com/insignai';
  // url = 'https://querynest.com/insignai';
  // urlCrosstab = 'https://querynest.com/insignai/crosstab';
  // urlOutput = 'https://querynest.com/insignai/output';
  // userApi = 'https://querynest.com/insignai';
  // sampleUrl = 'https://querynest.com/insignai';
  // fileUrl = 'https://querynest.com/insignai';

  // masterUrl = 'https://querynest.com/services-demo3/';
  // url = 'https://querynest.com/services-demo3/';
  // urlCrosstab = 'https://querynest.com/services-demo3/crosstab';
  // urlOutput = 'https://querynest.com/services-demo3/output';
  // userApi = 'https://querynest.com/services-demo3';
  sampleUrl = 'https://querynest.com/insignai-services-v1';
  fileUrl = 'https://querynest.com/insignai-services-v1';


  masterUrl = "https://querynest.com";
  url = "https://querynest.com/insignai-services-v1";
  urlCrosstab = "https://querynest.com/insignai-services-v1/crosstabShare";
  urlOutput = "https://querynest.com/insignai-services-v1/outputShare";
  userApi = "https://querynest.com/insignai-services-v1/crosstabShare";

  // *********************************END*****************************************
  // *****************************************************************************

  // **************************Production Url************************************
  // ****************************************************************************

  // masterUrl = "https://8451inqueries.com";
  // url = "https://8451inqueries.com/services";
  // urlCrosstab = "https://8451inqueries.com/services/crosstab";
  // urlOutput = "https://8451inqueries.com/services/output";
  // userApi = "https://8451inqueries.com/services";
  // sampleUrl = "https://querynest.com/e451";

  // To upload file
  // fileUrl = "https://8451consumerresearchbridge.com/_blob";
  // fileUrl = "https://8451inqueries.com/services";

  // ****************************************************************************
  // ****************************************************************************

  constructor() {
    this.urlObject = {
      login: {
        method: 'POST',
        url: this.userApi + '/user/login',
      },
      logout: {
        method: 'POST',
        url: this.url + '/user/logout',
      },
      allUserList: {
        method: 'POST',
        url: this.userApi + '/user/userlist',
      },
      allUserListAll: {
        method: 'POST',
        url: this.userApi + '/user/userlistall',
      },
      checkUserLookup: {
        method: 'POST',
        url: this.userApi + '/user/lookup',
      },
      userInfo: {
        method: 'POST',
        url: this.userApi + '/user/info',
      },
      notification: {
        method: 'GET',
        url: this.userApi + '/user/notification',
      },
      resetPasswordByAdmin: {
        method: 'POST',
        url: this.userApi + '/user/changePassword',
      },
      userSignUp: {
        method: 'POST',
        url: this.userApi + '/user/create',
      },
      deleteUser: {
        method: 'POST',
        url: this.userApi + '/user/delete',
      },
      updateUser: {
        method: 'POST',
        url: this.userApi + '/user/modifyuser',
      },
      domainList: {
        method: 'POST',
        url: this.userApi + '/user/domainList',
      },
      addDomain: {
        method: 'POST',
        url: this.userApi + '/user/addDomain',
      },
      passwordGenerate: {
        method: 'POST',
        url: this.userApi + '/user/genPassword',
      },
      orgList: {
        method: 'POST',
        url: this.userApi + '/user/orglist',
      },
      orgListAll: {
        method: 'POST',
        url: this.userApi + '/user/orglistAll',
      },
      orgCreate: {
        method: 'POST',
        url: this.userApi + '/user/orgcreate',
      },
      orgRename: {
        method: 'POST',
        url: this.userApi + '/user/orgrename',
      },
      orgDelete: {
        method: 'POST',
        url: this.userApi + '/user/orgdelete',
      },
      updateSubscription: {
        method: 'POST',
        url: this.userApi + '/user/update/subscription',
      },
      activeOrdeactive: {
        method: 'POST',
        url: this.userApi + '/user/change/status',
      },
      sendRequestToAdd: {
        method: 'POST',
        url: this.userApi + '/user/request/addmember',
      },
      getAddUserRequests: {
        method: 'POST',
        url: this.userApi + '/user/request/all',
      },
      approveAddRequest: {
        method: 'POST',
        url: this.userApi + '/user/request/submit',
      },
      updateManagerOrg: {
        method: 'POST',
        url: this.userApi + '/user/orgupdate',
      },
      subscriptionActiveUser: {
        method: 'POST',
        url: this.userApi + '/user/subscription/activeuser',
      },
      validateEmail: {
        method: 'POST',
        url: this.url + '/user/forgotPassword',
      },
      validatePassKey: {
        method: 'POST',
        url: this.url + '/user/forgotPassword/validate',
      },
      learningHelp: {
        method: 'POST',
        url: this.url + '/learning/help',
      },

      // Sample Builder collection
      department: {
        method: 'POST',
        url: this.url + '/sample/getSpecs',
      },

      // @users_bp.route('/update/subscription',methods=['POST'])
      // @users_bp.route('/subscription/list',methods=['POST'])
      // @users_bp.route('/subscription/<orgid>',methods=['POST'])
      // @users_bp.route('/subscription/activeuser',methods=['POST'])
      // @users_bp.route('/orgcreate',methods=['POST'])

      // **************************Input Url ****************************************
      // ****************************************************************************

      studyListing: {
        method: 'POST',
        url: this.url + '/study/listing',
      },
      userStudyListing: {
        method: 'POST',
        url: this.url + '/study/listings',
      },
      deleteStudy: {
        method: 'POST',
        url: this.url + '/study/delete',
      },
      archiveStudy: {
        method: 'POST',
        url: this.url + '/study/archive',
      },
      studyActivate: {
        method: 'POST',
        url: this.url + '/study/activate',
      },
      getCategories: {
        method: 'POST',
        url: this.url + '/getCategories',
      },
      getSubCategories: {
        method: 'POST',
        url: this.url + '/getSubCategory',
      },
      getActivity: {
        method: 'POST',
        url: this.url + '/',
      },
      createStudy: {
        method: 'POST',
        url: this.url + '/study/create',
      },
      studyInfo: {
        method: 'POST',
        url: this.url + '/crosstabShare/info',
      },
      nameChecker: {
        method: 'POST',
        url: this.url + '/study/nameChecker',
      },
      templateView: {
        method: 'POST',
        url: this.url + '/questionnaire/temp/view',
      },
      savedQuestions: {
        method: 'POST',
        url: this.url + '/questionnaire/list',
      },
      quesTrack: {
        method: 'POST',
        url: this.url + '/questionnaire/qtrack',
      },
      templateList: {
        method: 'POST',
        url: this.url + '/questionnaire/temp/list',
      },
      selectTemplate: {
        method: 'POST',
        url: this.url + '/questionnaire/temp/select',
      },
      template: {
        method: 'POST',
        url: this.url + '/questionnaire/template/list',
      },
      getTemplate: {
        method: 'POST',
        url: this.url + '/questionnaire/get/template',
      },

      sequenceUpdate: {
        method: 'POST',
        url: this.url + '/questionnaire/update/seq',
      },
      quesAddToBankList: {
        method: 'POST',
        url: this.url + '/questionnaire/addQBank',
      },
      deleteQuesBankList: {
        method: 'POST',
        url: this.url + '/questionnaire/delete/QBank',
      },
      brandBankList: {
        method: 'POST',
        url: this.url + '/questionnaire/type/QBank',
      },
      qTypeList: {
        method: 'POST',
        url: this.url + '/questionnaire/change/qtype',
      },
      changeQType: {
        method: 'POST',
        url: this.url + '/questionnaire/save/qtype',
      },
      saveRandmize: {
        method: 'POST',
        url: this.url + '/questionnaire/save/randomize',
      },
      saveMinMax: {
        method: 'POST',
        url: this.url + '/questionnaire/save/minmax',
      },
      savePipeIn: {
        method: 'POST',
        url: this.url + '/questionnaire/save/pipe_in',
      },
      tempList: {
        method: 'POST',
        url: this.url + '/study/temp/list',
        replace: 'no',
      },
      getTier: {
        method: 'POST',
        url: this.url + '/getTier',
      },
      getcpType: {
        method: 'POST',
        url: this.url + '/getcpType',
      },
      getSpecification: {
        method: 'POST',
        url: this.url + '/getSpecs',
      },
      saveSpecification: {
        method: 'POST',
        url: this.url + '/study/setSpecs',
      },
      saveQuestion: {
        method: 'POST',
        url: this.url + '/questionnaire/edit',
      },
      viewQuestion: {
        method: 'POST',
        url: this.url + '/questionnaire/view',
      },
      viewQuestionCustom: {
        method: 'POST',
        url: this.url + '/questionnaire/view/custom',
      },
      deleteQuestion: {
        method: 'POST',
        url: this.url + '/questionnaire/delete',
      },
      questionType: {
        method: 'POST',
        url: this.url + '/questionnaire/qtype',
      },
      showRiData: {
        method: 'POST',
        url: this.url + '/questionnaire/add/ri',
      },
      optionType: {
        method: 'POST',
        url: this.url + '/questionnaire/optype',
      },
      addNewQuestion: {
        method: 'POST',
        url: this.url + '/questionnaire/add',
      },
      expertQList: {
        method: 'POST',
        url: this.url + '/questionnaire/type/expertQuestion',
      },
      saveQuota: {
        method: 'POST',
        url: this.url + '/study/save_subgroup',
      },
      getQuota: {
        method: 'POST',
        url: this.url + '/study/get_subgroup',
      },
      pushStudyData: {
        method: 'POST',
        url: this.url + '/study/pushtoke',
      },
      finalStudyPush: {
        method: 'POST',
        url: this.url + '/study/givetoke',
      },
      shareUserDetails: {
        method: 'POST',
        url: this.url + '/study/shareDetails/user',
      },
      shareDetails: {
        method: 'POST',
        url: this.url + '/study/shareDetails',
      },
      studyShare: {
        method: 'POST',
        url: this.url + '/study/share',
      },
      addProgramnote: {
        method: 'POST',
        url: this.url + '/questionnaire/add/note',
      },
      getProgrammerNote: {
        method: 'POST',
        url: this.url + '/questionnaire/view/note',
      },
      fieldReport: {
        method: 'POST',
        url: this.url + '/crosstabShare/freport',
      },
      setLiveLink: {
        method: 'POST',
        url: this.url + '/study/set/liveLink',
      },
      setlaunchToKe: {
        method: 'POST',
        url: this.url + '/study/set/launch',
      },
      collectConfirmLaunch: {
        method: 'POST',
        url: this.url + '/study/set/collect',
      },
      closedStudy: {
        method: 'POST',
        url: this.url + '/study/set/close',
      },
      generateLinks: {
        method: 'POST',
        url: this.url + '/study/generate/links',
      },
      exportLiveLinks: {
        method: 'POST',
        url: this.url + '/study/export/links',
      },
      setVariablesToPipe: {
        method: 'POST',
        url: this.url + '/study/modify/advars',
      },
      setLinks: {
        method: 'POST',
        url: this.url + '/study/set/links',
      },
      getLinks: {
        method: 'POST',
        url: this.url + '/study/get/links',
      },
      logicsVars: {
        method: 'POST',
        url: this.url + '/questionnaire/logic/vars',
      },
      viewLinkStatus: {
        method: 'POST',
        url: this.url + '/study/view/linkstatus',
      },
      viewPipeInVars: {
        method: 'POST',
        url: this.url + '/study/view/advars',
      },
      exportFileLinks: {
        method: 'POST',
        url: this.url + '/study/export/filelinks',
      },
      generateGlobalLink: {
        method: 'POST',
        url: this.url + '/study/generate/globallink',
      },
      testLinkGenerate: {
        method: 'POST',
        url: this.url + '/study/generate/testlinks',
      },
      logicVarOptions: {
        method: 'POST',
        url: this.url + '/questionnaire/logic/opts',
      },
      clearTestData: {
        method: 'POST',
        url: this.url + '/study/reset/data',
      },
      getSurveyQuota: {
        method: 'POST',
        url: this.url + '/study/get/quota',
      },
      setSurveyQuota: {
        method: 'POST',
        url: this.url + '/study/set/quota',
      },
      pushDataToKe: {
        method: 'POST',
        url: this.url + '/study/pushtoke',
      },
      giveToKe: {
        method: 'POST',
        url: this.url + '/study/givetoke',
      },
      questionArrange: {
        method: 'POST',
        url: this.url + '/questionnaire/arrange',
      },
      downloadQuestionnaire: {
        method: 'POST',
        url: this.url + '/questionnaire/download/pdf',
      },
      questionList: {
        method: 'POST',
        url: this.url + '/questionnaire/view/list',
      },
      viewCustomQuestionList: {
        method: 'POST',
        url: this.url + '/questionnaire/view/custom/list',
      },
      setSequence: {
        method: 'POST',
        url: this.url + '/questionnaire/arrange',
      },
      byQuesList: {
        method: 'POST',
        url: this.url + '/questionnaire/type/qList',
      },
      byFormatList: {
        method: 'POST',
        url: this.url + '/questionnaire/format/qList',
      },
      checkQid: {
        method: 'POST',
        url: this.url + '/questionnaire/check/qid',
      },
      tempBox: {
        method: 'POST',
        url: this.url + '/box/tep',
      },
      boxList: {
        method: 'POST',
        url: this.url + '/box/list',
      },
      boxDelete: {
        method: 'POST',
        url: this.url + '/box/delete',
      },
      conceptList: {
        method: 'POST',
        url: this.url + '/concept/list',
      },
      conceptDelete: {
        method: 'POST',
        url: this.url + '/concept/delete',
      },
      tempImage: {
        method: 'POST',
        url: this.url + '/concept/tep',
      },
      addConcept: {
        method: 'POST',
        url: this.url + '/concept/push',
      },
      updateConcept: {
        method: 'POST',
        url: this.url + '/concept/push',
      },
      updatePanel: {
        method: 'POST',
        url: this.url + '/study/setPanel',
      },
      newUpdates: {
        method: 'POST',
        url: this.url + '/user/show/updates',
      },
      studyReplicate: {
        method: 'POST',
        url: this.url + '/study/replicate',
      },
      questionReplicate: {
        method: 'POST',
        url: this.url + '/questionnaire/replicate',
      },
      getUsedQuestions: {
        method: 'POST',
        url: this.url + '/questionnaire/used',
      },
      setOpLogic: {
        method: 'POST',
        url: this.url + '/questionnaire/edit/logic',
      },
      resetOpLogic: {
        method: 'POST',
        url: this.url + '/questionnaire/reset/logic',
      },
      resetSampleFile: {
        method: 'POST',
        url: this.url + '/reset/sampledata',
      },
      excelDownload: {
        method: 'POST',
        url: this.url + '/study/export/data/excel',
      },
      spssDownload: {
        method: 'POST',
        url: this.url + '/study/export/data/spss',
      },
      getQrCode: {
        method: 'POST',
        url: this.url + '/study/grab/qr/livelink',
      },

      orgTempList: {
        method: 'POST',
        url: this.url + '/questionnaire/org/template/list',
      },

      saveTemplate: {
        method: 'POST',
        url: this.url + '/questionnaire/saveTemplate',
      },

      applyTemplate: {
        method: 'POST',
        url: this.url + '/questionnaire/org/template/apply',
      },
      addQuestion: {
        method: 'POST',
        url: this.url + '/questionnaire/org/template/addQuestion',
      },
      // *****************************Output API Start ***********************************************
      // *********************************************************************************************
      // *********************************************************************************************
      outputCore: {
        method: 'POST',
        url: this.urlOutput + '/overall/core',
      },
      outputOverallAdded: {
        method: 'POST',
        url: this.urlOutput + '/overall/added',
      },
      outputFavourite: {
        method: 'POST',
        url: this.urlOutput + '/overall/favorite',
      },
      outputLikes: {
        method: 'POST',
        url: this.urlOutput + '/overall/likes',
      },
      outputDisLikes: {
        method: 'POST',
        url: this.urlOutput + '/overall/dislikes',
      },
      tabsMain: {
        method: 'POST',
        url: this.urlOutput + '/main',
      },
      subgroupConcepts: {
        method: 'POST',
        url: this.urlOutput + '/subgroup/concept',
      },
      subBehavioral: {
        method: 'POST',
        url: this.urlOutput + '/subgroup/behavioral',
      },
      subBehFav: {
        method: 'POST',
        url: this.urlOutput + '/subgroup/favorite',
      },
      deepDiveAll: {
        method: 'POST',
        url: this.urlOutput + '/deepdive/all',
      },
      subGroupDeep: {
        method: 'POST',
        url: this.urlOutput + '/deepdive/subgroup',
      },
      saveLikeData: {
        method: 'POST',
        url: this.urlOutput + '/overall/likes/save',
      },
      saveDisLikeData: {
        method: 'POST',
        url: this.urlOutput + '/overall/dislikes/save',
      },
      appliedFilters: {
        method: 'POST',
        url: this.urlOutput + '/appliedfilter',
      },
      customQuesList: {
        method: 'POST',
        url: this.urlOutput + '/customQ/list',
      },
      customQuesData: {
        method: 'POST',
        url: this.urlOutput + '/customQ/data',
      },
      downloadSingleCharts: {
        method: 'POST',
        url: this.urlOutput + '/reportReady',
      },
      downloadChartsInppt: {
        method: 'POST',
        url: this.urlOutput + '/reportReadyAll',
      },
      downloadProcess: {
        method: 'POST',
        url: this.url + '/crosstabShare/process',
      },
      downloadProcessList: {
        method: 'POST',
        url: this.url + '/crosstabShare/processList',
      },
      clearProcessList: {
        method: 'POST',
        url: this.url + '/crosstabShare/process/clear',
      },
      mainData: {
        method: 'POST',
        url: this.urlOutput + '/list/main',
      },
      demoGraphic: {
        method: 'POST',
        url: this.urlOutput + '/list/demographics',
      },
      getFiltersList: {
        method: 'POST',
        url: this.urlOutput + '/filters',
      },
      saveFilters: {
        method: 'POST',
        url: this.urlOutput + '/filters/save',
      },
      getSavedFilters: {
        method: 'POST',
        url: this.urlOutput + '/filters/pull',
      },
      getCSFiltersList: {
        method: 'POST',
        url: this.urlOutput + '/filters/list',
      },
      saveCSFilters: {
        method: 'POST',
        url: this.urlOutput + '/filters/include',
      },
      showSampleVariable: {
        method: 'POST',
        url: this.urlOutput + '/filters/sample',
      },
      reportQuesList: {
        method: 'POST',
        url: this.urlOutput + '/view/list',
      },
      viewListQid: {
        method: 'POST',
        url: this.urlOutput + '/view/list/qid',
      },
      sideBy: {
        method: 'POST',
        url: this.urlOutput + '/side_by_side',
      },
      demographicQList: {
        method: 'POST',
        url: this.urlOutput + '/side_by_side/list/vars',
      },
      saveSubOutput: {
        method: 'POST',
        url: this.urlOutput + '/side_by_side/save/vars',
      },
      saveRating: {
        method: 'POST',
        url: this.urlOutput + '/save/rating',
      },
      tableExport: {
        method: 'POST',
        url: this.urlOutput + '/tableReady',
      },
      tableExportAll: {
        method: 'POST',
        url: this.urlOutput + '/tableReadyAll',
      },
      setBase: {
        method: 'POST',
        url: this.urlOutput + '/set/base_criteria',
      },
      shareLink: {
        method: 'POST',
        url: this.urlOutput + '/share',
      },

      // *****************************Output API Closed **********************************************
      // *********************************************************************************************
      // *********************************************************************************************

      // *****************************Crosstab API ***************************************************
      // *********************************************************************************************
      // *********************************************************************************************

      crossTabList: {
        method: 'POST',
        url: this.url + '/crosstabShare/banner/list',
      },
      bannerPointList: {
        method: 'POST',
        url: this.url + '/crosstabShare/bannerPoint/list',
      },
      addBannerPoint: {
        method: 'POST',
        url: this.url + '/crosstabShare/bannerPoint/add',
      },
      addBanner: {
        method: 'POST',
        url: this.url + '/crosstabShare/banner/add',
      },
      removeBanner: {
        method: 'POST',
        url: this.url + '/crosstabShare/banner/delete',
      },
      bannerUpdate: {
        method: 'POST',
        url: this.url + '/crosstabShare/banner/edit',
      },
      bannerPointEdit: {
        method: 'POST',
        url: this.url + '/crosstabShare/bannerPoint/edit',
      },
      crossVars: {
        method: 'POST',
        url: this.url + '/crosstabShare/logic/vars',
      },
      crossOpts: {
        method: 'POST',
        url: this.url + '/crosstabShare/logic/opts',
      },
      allTableQuesList: {
        method: 'POST',
        url: this.url + '/crosstabShare/tableList/qlist',
      },
      bannerTableList: {
        method: 'POST',
        url: this.url + '/crosstabShare/tableList/list',
      },
      addTableToBanner: {
        method: 'POST',
        url: this.urlCrosstab + '/tableList/add',
      },
      getSavedGroup: {
        method: 'POST',
        url: this.url + '/crosstabShare/bannerPoint/group',
      },
      downloadCrosstab: {
        method: 'POST',
        url: this.url + '/crosstabShare/table/download',
      },
      bannerReplicate: {
        method: 'POST',
        url: this.url + '/crosstabShare/banner/replicate',
      },
      customTableAdd: {
        method: 'POST',
        url: this.urlCrosstab + '/tableList/custom/add',
      },
      shareLinkCross: {
        method: 'POST',
        url: this.url + '/crosstabShare/share',
      },

      // *****************************Crosstab API End ***********************************************
      // *********************************************************************************************
      // *********************************************************************************************

      // *****************************Save File Api's  ***********************************************
      // *********************************************************************************************
      // *********************************************************************************************
      uploadReport: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/study/pushreport',
      },
      boxUpload: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/box/push',
      },
      uploadFile: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/learning/push',
      },
      fileLinksUpload: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/generate/filelinks',
      },
      insuploadFile: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/insights/push',
      },
      insfolderList: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/insights/detail',
      },
      inscreateFolder: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/insights/create',
      },
      deleteInsFolder: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/insights/delete',
      },
      renameInsFl: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/insights/rename',
      },
      folderList: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/learning/detail',
      },
      createFolder: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/learning/create',
      },
      deleteFolder: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/learning/delete',
      },
      renameFl: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/learning/rename',
      },
      addToLearning: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/learning/addlink',
      },
      removeLink: {
        method: 'POST',
        type: 'blob',
        baseUrl: this.fileUrl,
        url: this.fileUrl + '/learning/deletelink',
      },

      // *****************************Save File Api's  ***********************************************
      // *********************************************************************************************
      // *********************************************************************************************
      saveSampleBuilder: {
        method: 'POST',
        url: this.sampleUrl + '/builder/set/payload',
      },
      getStatus: {
        method: 'POST',
        url: this.sampleUrl + '/builder/get/status',
      },

      // ********************************* Theme Apis ************************************************
      // *********************************************************************************************

      themeList: {
        method: 'POST',
        url: this.url + '/user/get/theme',
      },

      setTheme: {
        method: 'POST',
        url: this.url + '/user/set/theme',
      },

      setUserTheme: {
        method: 'POST',
        url: this.url + '/user/theme',
      },
    };
  }
}
