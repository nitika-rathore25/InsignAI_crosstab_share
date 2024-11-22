import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UrlsService } from './urls.service';
import { Router, Event, NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { LoaderService } from './loader.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class SystemService {

  encryptSecretKey = "r3@l@t!m3#in$!ght$k!mb3rlyh3rz0g";
  currentUrl: any;
  // keyUrl: string = 'gVG3C-8F2F2B6A3C1D2uG3G1B1F1md1D-13bgB-9qgdrkB-13B-11iC-9uI-8mieefF4fijtA2B2C2D1C5F1B1F1I4B8=='; //Old 8451 key
  // keyUrl: string = 'nQE2uA2E1G2H1C4A1lB5D5B4E4vyyklwE-11noH-8led1pf1lgtnlnoC6obcsF4I4A11D9C2C5F5B1C3D4=='; //8451 key
  keyUrl: string = 'UBB7jF4C3H5D3J4C7aB7D5A2E3kmupcualyE4obcsE7D7D6C5A1I4A3C3D7C7=='; //In queries server key Prod
  // keyUrl: string = 'Lc2C1qC2G2A3F4I3A16hD8B4E2F4C3D3I2B10C8D5B4C2A-9H3E2J2B4C6C3B1B5A1B2=='; //Dev server key
  toolbar = ['bold', 'italic', 'underline', 'textColor', 'alert', 'undo', 'insertHTML', 'redo'];
  toolbarQues = ['bold', 'italic', 'underline', 'undo', 'insertHTML', 'redo'];
  colorArr = ["#522181", "#ba59c5", "#8451ec", "#3fa687", "#084999", "#db9406", "#db4d8a", "#03a6d3", "#f58d80", "#c5e29c"];
  tblClr = ["concept0", "concept1", "concept2", "concept3", "concept4", "concept5", "concept6", "concept7", "concept8", "concept9", "concept0", "concept1", "concept2", "concept3", "concept4", "concept5", "concept6", "concept7", "concept8", "concept9", "concept0", "concept1", "concept2", "concept3", "concept4", "concept5", "concept6", "concept7", "concept8", "concept9", "concept0", "concept1", "concept2", "concept3", "concept4", "concept5", "concept6", "concept7", "concept8", "concept9", "concept0", "concept1", "concept2", "concept3", "concept4", "concept5", "concept6", "concept7", "concept8", "concept9", "concept0", "concept1", "concept2", "concept3", "concept4", "concept5", "concept6", "concept7", "concept8", "concept9", "concept0", "concept1", "concept2", "concept3", "concept4", "concept5", "concept6", "concept7", "concept8", "concept9"];

  // Blob API pointer
  pointerArr: any = [
    "3848d1d1aebd478d8525566d6a7b2bf3",
    "4500a093de644e51957d9307c675f611",
    "ca057539b90749dc90af0551d1cfeb13",
    "b965e1c09e9345229494571e940ba7f8",
    "efa41d6eb051407d8ac54e11f4a8b377",
    "a2c781393d9b4e7a9d5f46b435a1c100",
    "d378e6b003894e689b5f30827a76b7c3",
  ]

  logic = {
    key: this.keyUrl,
    toolbarInline: true,
    charCounterCount: false,
    placeholderText: 'Enter logic ...',
    toolbarBottom: true,
    toolbarButtons: this.toolbar,
    toolbarButtonsXS: this.toolbar,
    toolbarButtonsSM: this.toolbar,
    toolbarButtonsMD: this.toolbar,
  }

  qtext = {
    key: this.keyUrl,
    toolbarInline: true,
    charCounterCount: false,
    placeholderText: 'Enter question text...',
    toolbarBottom: true,
    toolbarButtons: this.toolbar,
    toolbarButtonsXS: this.toolbar,
    toolbarButtonsSM: this.toolbar,
    toolbarButtonsMD: this.toolbar,
  }

  ri = {
    key: this.keyUrl,
    toolbarInline: true,
    charCounterCount: false,
    placeholderText: 'Enter respondent instruction',
    toolbarBottom: true,
    toolbarButtons: this.toolbar,
    toolbarButtonsXS: this.toolbar,
    toolbarButtonsSM: this.toolbar,
    toolbarButtonsMD: this.toolbar,
  }

  configuration = {
    key: this.keyUrl,
    toolbarInline: true,
    charCounterCount: false,
    placeholderText: 'Enter note...',
    toolbarBottom: true,
    toolbarButtons: this.toolbar,
    toolbarButtonsXS: this.toolbar,
    toolbarButtonsSM: this.toolbar,
    toolbarButtonsMD: this.toolbar,
  }

  optiontext = {
    key: this.keyUrl,
    toolbarInline: true,
    charCounterCount: false,
    placeholderText: 'Enter option text...',
    toolbarBottom: true,
    toolbarButtons: this.toolbar,
    toolbarButtonsXS: this.toolbar,
    toolbarButtonsSM: this.toolbar,
    toolbarButtonsMD: this.toolbar,
  }

  logictext = {
    key: this.keyUrl,
    toolbarInline: true,
    charCounterCount: false,
    placeholderText: 'Enter logic...',
    toolbarBottom: true,
    toolbarButtons: this.toolbar,
    toolbarButtonsXS: this.toolbar,
    toolbarButtonsSM: this.toolbar,
    toolbarButtonsMD: this.toolbar,
  }

  notetext = {
    key: this.keyUrl,
    toolbarInline: true,
    charCounterCount: false,
    placeholderText: 'Enter note...',
    toolbarBottom: true,
    toolbarButtons: this.toolbar,
    toolbarButtonsXS: this.toolbar,
    toolbarButtonsSM: this.toolbar,
    toolbarButtonsMD: this.toolbar,
  }

  questiontext = {
    key: this.keyUrl,
    toolbarInline: true,
    charCounterCount: false,
    placeholderText: 'Enter question text here..',
    toolbarBottom: true,
    toolbarButtons: this.toolbarQues,
    toolbarButtonsXS: this.toolbarQues,
    toolbarButtonsSM: this.toolbarQues,
    toolbarButtonsMD: this.toolbarQues,
  }

  qtext2 = {
    key: this.keyUrl,
    toolbarInline: true,
    charCounterCount: false,
    placeholderText: 'Enter addtional question text here (optional) ..',
    toolbarBottom: true,
    toolbarButtons: this.toolbarQues,
    toolbarButtonsXS: this.toolbarQues,
    toolbarButtonsSM: this.toolbarQues,
    toolbarButtonsMD: this.toolbarQues,
  }

  respondent = {
    key: this.keyUrl,
    toolbarInline: true,
    charCounterCount: false,
    placeholderText: 'Enter respondent instruction here ..',
    toolbarBottom: true,
    toolbarButtons: this.toolbarQues,
    toolbarButtonsXS: this.toolbarQues,
    toolbarButtonsSM: this.toolbarQues,
    toolbarButtonsMD: this.toolbarQues,
  }

  questionnote = {
    key: this.keyUrl,
    toolbarInline: true,
    charCounterCount: false,
    placeholderText: 'Enter note here ..',
    toolbarBottom: true,
    toolbarButtons: this.toolbarQues,
    toolbarButtonsXS: this.toolbarQues,
    toolbarButtonsSM: this.toolbarQues,
    toolbarButtonsMD: this.toolbarQues,
  }

  qLabel = {
    key: this.keyUrl,
    toolbarInline: true,
    charCounterCount: false,
    placeholderText: 'Enter label here ..',
    toolbarBottom: true,
    toolbarButtons: this.toolbarQues,
    toolbarButtonsXS: this.toolbarQues,
    toolbarButtonsSM: this.toolbarQues,
    toolbarButtonsMD: this.toolbarQues,
  }

  options = {
    key: this.keyUrl,
    toolbarInline: true,
    charCounterCount: false,
    toolbarBottom: true,
    toolbarButtons: this.toolbar,
    toolbarButtonsXS: this.toolbar,
    toolbarButtonsSM: this.toolbar,
    toolbarButtonsMD: this.toolbar,
  }
  moveToLogin: boolean = false;
  resetPass: boolean = false;
  periodic: boolean = false;
  downloadHistory: boolean = false;
  addUser: boolean = false;
  createUser: boolean = false;
  orgInfoList: any = {};
  cpgUserList = [];
  orgList = [];
  templateQuestions = [];
  logicModal: boolean = false;
  basicLgModal: boolean = false;
  insightsModal: boolean = false;
  logicInfo: any;
  logicVars: any;
  display = "none";
  subLoder: boolean = false;
  uidInterval: any;
  uidInterval1: any;

  constructor(private activatedRoute: ActivatedRoute, private titleService: Title, public urlsService: UrlsService, private router: Router, private loaderService: LoaderService, private toastr: ToastrService, private http: HttpClient,) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.url;
      }
    });

    // this.uidInterval1 = setInterval(() => {
    //   let lcData = localStorage.getItem(this.encFrData());
    //   if(lcData != null){
    //     let masterData = this.decryptData(JSON.parse(lcData));
    //     if(masterData?.token == null){
    //       this.moveToLogin = true;
    //       this.clearInterval(this.uidInterval1);
    //     }
    //     else {
    //       this.moveToLogin = false;
    //     }

    //     if(masterData.passwordExpire == 1){
    //       this.periodic = true;
    //     }
    //     else {
    //       this.periodic = false;
    //     }
    //   }
    //   else {
    //     this.moveToLogin = true;
    //     this.clearInterval(this.uidInterval1);
    //   }
    // }, 1000);


    this.router.events.pipe(filter(event => event instanceof NavigationEnd),).subscribe(() => {
      const rt = this.getChild(this.activatedRoute);
      rt.data.subscribe(data => {
        this.titleService.setTitle(data.title);
      });
    });


    // this.uidInterval = setInterval(() => {
    //   this.checkUuid();
    // }, 15000);
  }

  getChild(activatedRoute: ActivatedRoute) {
    if (activatedRoute.firstChild) {
      return this.getChild(activatedRoute.firstChild);
    } else {
      return activatedRoute;
    }
  }

  encFrData() {
    let ec = btoa("realinsightsFrontend");
    return ec;
  }

  encryptData(data) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptSecretKey).toString();
    } catch (e) {

    }
  }

  decryptData(data) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.encryptSecretKey);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {

    }
  }

  getMasterToken() {
    let lcData = sessionStorage.getItem(this.encFrData());
    let masterData = this.decryptData(JSON.parse(lcData));
    let headers = new HttpHeaders({ 'x-access-token': masterData['masterToken'] });
    return headers;
  }

  getLocalStorage() {
    let lcData = sessionStorage.getItem(this.encFrData());
    let masterData = this.decryptData(JSON.parse(lcData));
    return masterData;
  }

  logout(): void {
    // let masterData = this.getLocalStorage();
    // if(masterData != null){
    //   masterData["logout"] = "loggedoff";
    //   let mainObj = this.encryptData(masterData);
    //   localStorage.setItem(this.encFrData(), JSON.stringify(mainObj));
    // }
    // let makeUrl = this.urlsService.masterUrl;
    // window.open(makeUrl, "_self");
    // localStorage.clear();
    this.router.navigate(['']);
    // location.reload()
  }

  navigateToproducts() {
    let makeUrl = this.urlsService.masterUrl;
    window.open(makeUrl, "_self");
  }

  getResetPass() {
    this.resetPass = true;
  }

  closeResetPass() {
    this.resetPass = false;
    this.periodic = false;
    let lcData = sessionStorage.getItem(this.encFrData());
    let masterData = this.decryptData(JSON.parse(lcData));
    masterData["passwordExpire"] = 0;
    let finalData = this.encryptData(masterData);
    sessionStorage.setItem(this.encFrData(), JSON.stringify(finalData));
  }

  getBannerData() {
    let lcData = sessionStorage.getItem(this.encFrData());
    if (lcData != null) {
      let masterData = this.decryptData(JSON.parse(lcData));
      let nameLocal = masterData["bannerInfo"]["bannerID"] + this.encFrData();
      let bannerData = sessionStorage.getItem(nameLocal);
      bannerData = this.decryptData(JSON.parse(bannerData));
      return bannerData;
    }
    else {
      this.navigateToproducts();
    }
  }

  clearCrosstabTable() {
    let lcData = sessionStorage.getItem(this.encFrData());
    if (lcData != null) {
      let masterData = this.decryptData(JSON.parse(lcData));
      if (masterData["bannerInfo"] != undefined) {
        let nameLocal = masterData["bannerInfo"]["bannerID"] + this.encFrData();
        sessionStorage.removeItem(nameLocal);
      }
    }
    else {
      // this.navigateToproducts();
    }
  }

  internalNavigate() {
    let masterData = this.getLocalStorage();
    if ((masterData['isOwner'] == 1 || masterData['isInput'] == 1) && masterData["studyId"]) {
      this.router.navigate(['create-project']);
    }
    else if (masterData['isPublish'] == 1 && masterData["studyId"]) {
      this.router.navigate(['input/survey']);
    }
    else if (masterData['isOutput'] == 1 && masterData["studyId"]) {
      this.router.navigate(['output']);
    }
    else {
      // this.router.navigate(['dashboard']);
    }
  }

  setLocalStorage(masterData) {
    let reMain = this.encryptData(masterData);
    sessionStorage.setItem(this.encFrData(), JSON.stringify(reMain));
  }

  postError(response) {
    this.loaderService.hide();
    if (response["header"]["code"] == 403) {
      this.toastr.warning(response["header"]["message"], '');
    }
    else {
      this.toastr.error(response["header"]["message"], '');
    }
  }

  confirmartion(error) {
    if (error.status == 403) {
      this.loaderService.hide();
      this.toastr.warning(error.error.header.message, '');
    }
    else if (error.status == 401) {
      this.logout();
    }
    else if (error.status == 500) {
      this.loaderService.hide();
      this.toastr.error("There was an error while performing your request. Please contact the administrator.", '');
    }
    else {
      this.loaderService.hide();
      console.log(error)
      // this.toastr.error(error.error.header.message, '');
    }
  }

  navigateUrl(url) {
    this.router.navigate([url]);
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

  addUserModal() {
    this.addUser = true;
    this.createUser = true;
    this.orgInfoList = {};
    this.reloadComponent();
  }

  closeAddUser() {
    this.addUser = false;
    this.createUser = false;
  }

  addUserInOrg(list) {
    this.orgInfoList = list;
    this.addUser = true;
    this.createUser = true;
    // this.reloadComponent();
  }

  managerUserAdd(list) {
    this.orgInfoList = list;
    this.addUser = true;
    this.createUser = true;
    this.orgInfoList["request"] = "req";
    // this.reloadComponent();
  }

  allnavigation() {
    let data = this.getLocalStorage();
  }

  setNeedList(masterData) {
    delete masterData['studyId'];
    delete masterData['stdName'];
    delete masterData['isInput'];
    delete masterData['isOutput'];
    delete masterData['isPublish'];
    delete masterData["activeGroup"];
    delete masterData["subgroupID"];
    delete masterData["actSubgroup"];
    delete masterData["hasQuestionnaire"];
    delete masterData["launch"];
    delete masterData["showBox"];
    delete masterData["studyState"];
    delete masterData["output"];
    delete masterData["usrTab"];
    delete masterData["tempID"];
    delete masterData["tempQuesList"];
    delete masterData["created_q"];
    masterData['isOwner'] = 1;
    this.setLocalStorage(masterData);
    return this.getLocalStorage();
  }

  getUsersByOrg(orgList) {
    let urlOne = this.urlsService.userApi + '/user/userlist';
    let headers = this.getMasterToken();
    let data = this.getLocalStorage();
    orgList["apiToken"] = data["token"];
    this.http.post(urlOne, orgList, { headers }).subscribe((response) => {
      let deleteResponse = response["header"]["code"];
      if (deleteResponse == 200) {
        this.cpgUserList = [];
        response["response"].forEach(ele => {
          let rmain = (ele.allowedQuestions - ele.createdQuestions);
          ele["remain"] = rmain;
          this.cpgUserList.push(ele);
        });
        this.loaderService.hide();
      }
    });
  }

  getOrg() {
    let urlOne = this.urlsService.userApi + '/user/orglist';
    let headers = this.getMasterToken();
    let data = this.getLocalStorage();
    this.http.post(urlOne, { "apiToken": data["token"] }, { headers }).subscribe((response) => {
      let deleteResponse = response["header"]["code"];
      if (deleteResponse == 200) {
        this.orgList = [];
        this.orgList = response["response"];
        this.loaderService.hide();
      }
    });
  }

  sendQuestionData(getQues) {
    this.templateQuestions = [];
    getQues.forEach(row => {
      this.templateQuestions.push(row);
    });
  }

  getQuesList() {
    return this.templateQuestions;
  }

  userExists(qid, array) {
    return array.some(function (el) {
      return el.qid === qid;
    });
  }

  setSession(list, key) {
    sessionStorage.setItem(key, JSON.stringify(list));
  }

  getSession(type) {
    let lcData = JSON.parse(sessionStorage.getItem(type))
    return lcData;
  }

  clearSession() {
    sessionStorage.clear();
  }

  getRandomValue(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  show() {
    this.subLoder = true;
  }

  hide() {
    this.subLoder = false;
  }

  getUuid() {
    let uid = uuid.v4();
    return uid
  }

  checkUuid() {
    let lcData = sessionStorage.getItem(this.encFrData());
    if (lcData != null) {
      let masterData = this.decryptData(JSON.parse(lcData));
      if (masterData?.token == null) {
        this.clearInterval(this.uidInterval);
      }
      else {
        let urlOne = this.urlsService.url + '/' + this.getUuid();
        let headers = this.getMasterToken();
        let data = this.getLocalStorage();
        this.http.post(urlOne, { "apiToken": data["token"] }, { headers }).subscribe((response) => {
          if (response["header"]["code"] == 401) {
            this.clearInterval(this.uidInterval);
            this.logout();
          }
        });
      }
    }
  }

  clearInterval(interval) {
    clearInterval(interval);
  }

  getPointer() {
    return this.pointerArr[Math.floor(Math.random() * this.pointerArr.length)];
  }

  stripHtml(html) {
    let tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  randomPassValue(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  baseEncode(list) {
    return atob(list);
  }

  baseDecode(list) {
    return btoa(list);
  }
}
