import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, } from '@angular/common/http';
import { LoaderService } from '../service/loader.service';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../service/http.service';
import { SystemService } from '../service/system.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-crosstab',
  templateUrl: './crosstab.component.html',
  styleUrls: ['./crosstab.component.css']
})
export class CrosstabComponent implements OnInit {

  viewAllData: any;
  masterData: any;
  display = "none";
  addCrossTab: boolean = false;
  settingsModal: boolean = false;
  bannerList = [];
  bannerForm: FormGroup;
  submitted: boolean = false;
  optsList: any;
  selectedArrG: {};
  selectedArrOptions: {};
  selectedOptions: {};
  selectedArrG1: {};
  selectedOptions1: {};
  addLogicArr: any[];
  logicLists: any;
  logicConditions: any;
  logicOperators: any;
  logicVars: any;
  bannerDelete: boolean = false;
  addGrpM: boolean = false;
  selectedArrOptions1 = {};
  optsList1: any;
  bannerTitle: any;
  settingList: any;
  completeCount: any;
  searchText = '';
  tableQuestionList: any;
  savedGroup = [];
  savedQuesList: any;
  quesChecked = {};
  copyBannerModal: boolean = false;
  copyUrl: string;
  shareLinkDetail: any;
  linkModalCross: boolean = false;
  addPass: boolean = false;
  openLinkCross: any
  studyId: string = '';
  passwordForm = new FormGroup({
    passwordConfirm: new FormControl('')
  });
  bannerDisplay: string = 'none';
  editBanner: boolean = false;
  change: number = 0;
  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder, public systemSr: SystemService, private el: ElementRef, private router: Router, private httpService: HttpService, private http: HttpClient, private loaderService: LoaderService, private toastr: ToastrService) { }

  ngOnInit() {
    // this.display = "flex";
    // this.bannerDisplay = "block";
    this.addPass = true;
    this.display = 'flex'
    this.studyId = this.activatedRoute.snapshot.queryParamMap["params"]['switch'];
    console.log(this.studyId)
    this.masterData = this.systemSr.getLocalStorage();
    console.log(this.studyId)
    if (!this.studyId && this.masterData) {
      if (this.masterData['urlStudyId']) {
        this.studyId = this.masterData['urlStudyId']
      }
    }
    if (this.masterData) {
      if (this.masterData.token) {
        console.log(this.masterData)
        this.addPass = false;
        this.bannerDisplay = 'none';
        this.passwordCheck(this.masterData.token);

      }
    }
    console.log(this.studyId)
    if (this.masterData == undefined) {
      this.masterData = {};
    }
  }
  passwordCheck(password: string) {
    this.bannerForm = this.fb.group({
      bannerTitle: ['', Validators.required],
      description: ['', Validators.required],
    });
    // this.masterData = this.systemSr.getLocalStorage();
    // if ((this.masterData.isOwner == 1 || this.masterData.isOutput == 1)) {
    let studyJsonSet = {
      "studyID": this.studyId,
      "switchKey": password
    }
    this.loaderService.show();
    this.httpService.callApi('studyInfo', { body: studyJsonSet }).subscribe((response) => {
      let viewResp = response["header"]["code"];
      if (viewResp == 200) {
        this.addPass = false;
        this.display = 'none';
        this.viewAllData = response["response"];
        this.masterData = { ...this.masterData, ...{ token: password } };
        this.masterData = { ...this.masterData, ...{ urlStudyId: this.studyId } };
        this.masterData = {
          ...this.masterData, ...{
            stdName: response['response'].studyName
          }

        };
        this.bannerDisplay = 'none';
        console.log(this.masterData)
        this.systemSr.clearCrosstabTable();
        // delete this.masterData["bannerInfo"];
        // delete this.masterData["seg_group_names"];
        this.masterData["studyState"] = this.viewAllData["studyState"];
        this.systemSr.setLocalStorage(this.masterData);
        console.log(this.masterData)
        this.addLogicToBanner();
        this.tableApis();
      }
      else {
        this.toastr.warning('Incorrect Password')
      }
    });
    // }
    // else {
    //   this.systemSr.internalNavigate();
    // }
  }
  tableApis() {
    let studyJsonSet = {
      "studyID": this.studyId
    }
    this.httpService.callApi('crossTabList', { body: studyJsonSet }).subscribe((response) => {
      let viewResp = response["header"]["code"];
      if (viewResp == 200) {
        if (response["response"]) {
          this.bannerList = [];
          this.bannerList = response["response"];
          if (this.bannerList.length > 0) {
            if (this.bannerList[0]["default"] == 1) {
              let qList = {
                "studyID": this.studyId,
                "bannerID": this.bannerList[0].bannerID,
              }
              this.httpService.callApi('allTableQuesList', { body: qList }).subscribe((response) => {
                let viewResp = response["header"]["code"];
                if (viewResp == 200) {
                  this.tableQuestionList = response["response"];
                  if (this.tableQuestionList.length > 0) {
                    let quesID = [];
                    this.tableQuestionList.forEach(row => {
                      quesID.push(row.qID);
                    });
                    let studyJsonSet = {
                      "studyID": this.studyId,
                      "bannerID": this.bannerList[0].bannerID,
                      "quest_info": quesID
                    }
                    this.httpService.callApi('addTableToBanner', { body: studyJsonSet }).subscribe((response) => {
                    });
                  }
                }
              });
            }

            let count = 0;
            this.bannerList.forEach(banner => {
              banner["bannerPoint"] = [];
              count += 1;
            });
            if (count == this.bannerList.length) {
              this.callBannerPoints();
            }
            this.loaderService.hide();
          }
        }
      }
    });


    this.httpService.callApi('fieldReport', { body: studyJsonSet }).subscribe((response) => {
      let viewResp = response["header"]["code"];
      if (viewResp == 200) {
        this.completeCount = response["response"];
      }
    });
  }

  get f() { return this.bannerForm.controls; }

  callBannerPoints() {
    let count = 0;
    let studyJsonSet = {
      "studyID": this.studyId
    }
    this.httpService.callApi('crossTabList', { body: studyJsonSet }).subscribe((response) => {
      this.bannerList = [];
      this.bannerList = response["response"];
      this.bannerList.forEach(banner => {
        banner["bannerPoint"] = [];
        count += 1;
      });
      if (count == this.bannerList.length) {
        this.bannerList.forEach(ban => {
          let bannerJsn = {
            "studyID": this.studyId,
            "bannerID": ban.bannerID
          }
          this.httpService.callApi('bannerPointList', { body: bannerJsn }).subscribe((response) => {
            let viewResp = response["header"]["code"];
            if (viewResp == 200) {
              ban["bannerPoint"] = response["response"];
            }
          });
        });
      }
    });
  }

  navigateUrl(url) {
    this.router.navigate([url]);
  }

  openCrossModal() {
    this.display = "block";
    this.bannerDisplay = 'block';
    this.addCrossTab = true;
  }

  closeCrossModal(type) {
    this.display = "none";
    this.bannerDisplay = 'none';
    if (type == "addCrossTab") {
      this.addCrossTab = false;
    }
    else if (type == "settingsModal") {
      this.settingsModal = false;
    }
    else if (type == "bannerDelete") {
      this.bannerDelete = false;
    }
    else if (type == "copyBannerModal") {
      this.copyBannerModal = false;
    }
  }

  openSetModal(list) {
    this.loaderService.show();
    let bannerJsn = {
      "studyID": this.masterData['urlStudyId'],
      "bannerID": list.bannerID
    }
    this.httpService.callApi('allTableQuesList', { body: bannerJsn }).subscribe((response) => {
      let viewResp = response["header"]["code"];
      if (viewResp == 200) {
        this.tableQuestionList = response["response"];
        this.httpService.callApi('bannerTableList', { body: bannerJsn }).subscribe((response) => {
          let viewResp = response["header"]["code"];
          if (viewResp == 200) {
            this.settingList = list;
            this.savedGroup = [];
            let arrObj1 = {};
            let arrObj2 = {};
            this.settingList.bannerPoint.forEach(bannerPoint => {
              if (Object.keys(arrObj1).indexOf(bannerPoint.bannerGroup.toLowerCase()) < 0 && bannerPoint.bannerGroup != "") {
                arrObj1[bannerPoint.bannerGroup.toLowerCase()] = [];
              }
              if (bannerPoint.bannerGroup != "") {
                arrObj1[bannerPoint.bannerGroup.toLowerCase()].push(bannerPoint);
              }
            });
            this.savedGroup.push(arrObj1);
            this.settingList.bannerPoint.forEach(bannerPoint => {
              if (Object.keys(arrObj2).indexOf(bannerPoint.bannerGroup.toLowerCase()) < 0 && bannerPoint.bannerGroup == "") {
                arrObj2[bannerPoint.bannerGroup.toLowerCase()] = [];
              }
              if (bannerPoint.bannerGroup == "") {
                arrObj2[bannerPoint.bannerGroup.toLowerCase()].push(bannerPoint);
              }
            });
            this.savedGroup.push(arrObj2);
            this.savedQuesList = response["response"];
            if (response["response"].length > 0) {
              this.quesChecked = {};
              this.savedQuesList.forEach(cols => {
                this.quesChecked[cols.qID] = cols.qID;
              });
            }
            this.display = "block";
            this.bannerDisplay = 'block';
            this.settingsModal = true;
            this.loaderService.hide();
          }
        });
      }
    });
  }

  goToEdit(list) {
    this.display = "block";
    this.masterData["bannerInfo"] = list;
    this.masterData["completeCount"] = this.completeCount?.completes;
    this.systemSr.setLocalStorage(this.masterData);
    this.loaderService.show();
    this.change = this.change + 1;
    this.editBanner = true;
  }

  addBanner() {
    this.submitted = true;
    let title = String(this.bannerForm.get("bannerTitle").value).trim();
    let description = String(this.bannerForm.get("description").value).trim();
    if (title == "") {
      this.bannerForm.get("bannerTitle").patchValue("");
    }
    if (description == "") {
      this.bannerForm.get("description").patchValue("");
    }

    let count_type = 0;
    let per_type = 0;

    if (this.el.nativeElement.querySelector("#add_count").checked == true) {
      count_type = 1;
    }

    if (this.el.nativeElement.querySelector("#add_per_type").checked == true) {
      per_type = 1;
    }
    let error = 0;
    let errorMsg = "";

    if (count_type == 0 && per_type == 0) {
      error += 1;
      errorMsg = "View type is required";
    }

    if (this.bannerForm.invalid || error > 0) {
      if (error > 0) {
        this.toastr.error(errorMsg, '');
      }
      return;
    } else {
      let coma1 = "'";
      let stringVal = "";
      let errorMsg = "";
      let error = 0;
      let logicalArray = [];

      this.el.nativeElement.querySelectorAll("div.logical").forEach((element, k) => {
        let stringOp = "";
        let logicalStringOp = {};
        element.querySelectorAll(".parent-class-logic").forEach((parent, i) => {
          parent.querySelectorAll(".question").forEach((questionValue, z) => {
            if (questionValue.value != '') {
              if (questionValue.value != "+" && element.querySelectorAll(".operator")[i].value != '' && element.querySelectorAll(".value")[i].value != '') {
                if (questionValue.value != '' && element.querySelectorAll(".operator")[i].value != "" && element.querySelectorAll(".value")[i].value != "") {
                  stringOp += questionValue.value + element.querySelectorAll(".operator")[i].value + coma1 + element.querySelectorAll(".value")[i].value + coma1;
                  stringVal += questionValue.value + element.querySelectorAll(".operator")[i].value + coma1 + element.querySelectorAll(".value")[i].value + coma1;
                } else {
                  error += 1;
                  if (questionValue.value == "") {
                    errorMsg = "Banner logic should not be empty";
                  }
                  else if (element.querySelectorAll(".operator")[i].value == "") {
                    errorMsg = "Banner logic operator should not be empty";
                  }
                  else if (element.querySelectorAll(".value")[i].value == "") {
                    errorMsg = "Banner logic value should not be empty";
                  } else {
                    errorMsg = "Banner logic required";
                  }
                }
              }
              else {
                if (this.selectedArrG[k] > 0) {
                  if (this.selectedOptions[k + 'len'] > 0) {
                    if (element.querySelectorAll(".options")[i].value != "" && element.querySelectorAll(".subOption")[i].value != "") {
                      stringOp += element.querySelectorAll(".options")[i].value + element.querySelectorAll(".subOption")[i].value;
                    } else {
                      error += 1;
                      if (element.querySelectorAll(".options")[i].value == "") {
                        errorMsg = "Banner logic option should not be empty";
                      }
                      else if (element.querySelectorAll(".subOption")[i].value == "") {
                        errorMsg = "Banner logic sub option should not be empty";
                      } else {
                        errorMsg = "Banner logic required";
                      }
                    }
                  }
                  else {
                    if (element.querySelectorAll(".options")[i].value != "" && element.querySelectorAll(".operator")[i].value != "" && element.querySelectorAll(".value")[i].value != "") {
                      stringOp += element.querySelectorAll(".options")[i].value + element.querySelectorAll(".operator")[i].value + coma1 + element.querySelectorAll(".value")[i].value + coma1;
                    } else {
                      error += 1;
                      if (element.querySelectorAll(".options")[i].value == "") {
                        errorMsg = "Banner logic option should not be empty";
                      }
                      else if (element.querySelectorAll(".operator")[i].value == "") {
                        errorMsg = "Banner logic operator should not be empty";
                      }
                      else if (element.querySelectorAll(".value")[i].value == "") {
                        errorMsg = "Banner logic value should not be empty";
                      } else {
                        errorMsg = "Banner logic required";
                      }
                    }
                  }
                }
                else {
                  if (element.querySelectorAll(".operator")[i].value != "" && element.querySelectorAll(".value")[i].value != "") {
                    stringOp += element.querySelectorAll(".operator")[i].value + coma1 + element.querySelectorAll(".value")[i].value + coma1;
                  } else {
                    error += 1;
                    if (element.querySelectorAll(".operator")[i].value == "") {
                      errorMsg = "Banner logic operator should not be empty";
                    }
                    else if (element.querySelectorAll(".value")[i].value == "") {
                      errorMsg = "Banner logic value should not be empty";
                    }
                  }
                }
              }
            }
            else {
              // error +=1;
              // errorMsg = "Banner logic is required";
            }
          });
        });

        element.querySelectorAll(".child-class-logic").forEach((child, j) => {
          child.querySelectorAll(".question").forEach((questionValue, i) => {
            if (questionValue.value != '') {
              if (questionValue.value != "+") {
                if (child.querySelectorAll(".andoroperator")[i].value != "" && child.querySelectorAll(".operator")[i].value != "" && child.querySelectorAll(".value")[i].value != "") {
                  stringOp += child.querySelectorAll(".andoroperator")[i].value + questionValue.value + child.querySelectorAll(".operator")[i].value + coma1 + child.querySelectorAll(".value")[i].value + coma1;
                  stringVal += child.querySelectorAll(".andoroperator")[i].value + questionValue.value + child.querySelectorAll(".operator")[i].value + coma1 + child.querySelectorAll(".value")[i].value + coma1;
                } else {
                  error += 1;
                  if (questionValue.value == "") {
                    errorMsg = "Banner logic should not be empty";
                  }
                  else if (element.querySelectorAll(".andoroperator")[i].value == "") {
                    errorMsg = "Banner logic operator should not be empty";
                  }
                  else if (element.querySelectorAll(".operator")[i].value == "") {
                    errorMsg = "Banner logic operator should not be empty";
                  }
                  else if (element.querySelectorAll(".value")[i].value == "") {
                    errorMsg = "Banner logic value should not be empty";
                  }
                  else {
                    errorMsg = "Banner logic required";
                  }
                }
              }
              else {

                if (this.selectedArrG1[j + '' + k] > 0) {
                  if (this.selectedOptions1[j + '' + k + 'len'] > 0) {
                    if (child.querySelectorAll(".andoroperator")[i].value != "" && child.querySelectorAll(".options")[i].value != "" && child.querySelectorAll(".subOption")[i].value != "") {
                      stringOp += child.querySelectorAll(".andoroperator")[i].value + child.querySelectorAll(".options")[i].value + child.querySelectorAll(".subOption")[i].value;
                    } else {
                      error += 1;
                      if (element.querySelectorAll(".andoroperator")[i].value == "") {
                        errorMsg = "Banner logic operator should not be empty";
                      }
                      else if (element.querySelectorAll(".subOption")[i].value == "") {
                        errorMsg = "Banner logic sub option should not be empty";
                      }
                      else if (element.querySelectorAll(".options")[i].value == "") {
                        errorMsg = "Banner logic option should not be empty";
                      } else {
                        errorMsg = "Banner logic required";
                      }
                    }
                  }
                  else {
                    if (child.querySelectorAll(".andoroperator")[i].value != "" && child.querySelectorAll(".options")[i].value != "" && child.querySelectorAll(".operator")[i].value != "" && child.querySelectorAll(".value")[i].value != "") {
                      stringOp += child.querySelectorAll(".andoroperator")[i].value + child.querySelectorAll(".options")[i].value + child.querySelectorAll(".operator")[i].value + coma1 + child.querySelectorAll(".value")[i].value + coma1;
                    } else {
                      error += 1;
                      if (element.querySelectorAll(".andoroperator")[i].value == "") {
                        errorMsg = "Banner logic operator should not be empty";
                      }
                      else if (element.querySelectorAll(".options")[i].value == "") {
                        errorMsg = "Banner logic options should not be empty";
                      }
                      else if (element.querySelectorAll(".value")[i].value == "") {
                        errorMsg = "Banner logic value should not be empty";
                      }
                      else if (element.querySelectorAll(".operator")[i].value == "") {
                        errorMsg = "Banner logic operator should not be empty";
                      }
                      else {
                        errorMsg = "Banner logic required";
                      }
                    }
                  }
                }
                else {
                  if (child.querySelectorAll(".andoroperator")[i].value != "" && child.querySelectorAll(".operator")[i].value != "" && child.querySelectorAll(".value")[i].value != "") {
                    stringOp += child.querySelectorAll(".andoroperator")[i].value + child.querySelectorAll(".operator")[i].value + coma1 + child.querySelectorAll(".value")[i].value + coma1;
                  } else {
                    if (element.querySelectorAll(".andoroperator")[i].value == "" || element.querySelectorAll(".operator")[i].value == "") {
                      errorMsg = "Banner logic operator should not be empty";
                    }
                    else if (element.querySelectorAll(".value")[i].value == "") {
                      errorMsg = "Banner logic value should not be empty";
                    }
                    else {
                      errorMsg = "Banner logic required";
                    }
                  }
                }

              }
            } else {
              error += 1;
              errorMsg = "Banner logic is required";
            }
          });
        });

        if (error == 0) {
          if (stringOp != "") {
            logicalStringOp["pointLogic"] = stringOp;
            logicalArray.push(logicalStringOp);
          }
        } else {
          this.toastr.error(errorMsg, '');
        }
      });

      if (error == 0) {
        let studyJsonSet = {
          "studyID": this.studyId,
          "title": title,
          "description": description,
          "logic": logicalArray,
          "count": count_type,
          "percent": per_type,
        }
        this.loaderService.show();
        this.httpService.callApi('addBanner', { body: studyJsonSet }).subscribe((response) => {
          let viewResp = response["header"]["code"];
          if (viewResp == 200) {
            if (response["response"]) {
              this.masterData["bannerInfo"] = response["response"];
              this.masterData["completeCount"] = this.completeCount?.completes;
              this.systemSr.setLocalStorage(this.masterData);
              this.navigateUrl('edit-banner');
              this.loaderService.hide();
            }
          }
        });
      }
    }
  }

  addLogicCondition() {
    let addlogic = {
      "options": [],
    };
    this.addLogicArr.push(addlogic);
  }

  // Add Logic to banner
  addLogicToBanner() {
    this.optsList = [];
    this.selectedArrG = {};
    this.selectedArrOptions = {};
    this.selectedOptions = {};
    this.selectedOptions = {};
    this.selectedArrG1 = {};
    this.selectedOptions1 = {};

    this.addLogicArr = [];
    let getQuestionsJson = {
      "studyID": this.studyId,
      "default": "quot"
    }
    this.httpService.callApi('crossVars', { body: getQuestionsJson }).subscribe((response) => {
      let getQuesResp = response["header"]["code"];
      if (getQuesResp == 200) {
        this.logicLists = response["response"];
        this.logicConditions = response["response"]["condition"];
        this.logicOperators = response["response"]["operators"];
        this.logicVars = response["response"]["variables"];
        let addlogic = {
          "condition": '',
          "operator": '',
          "options": [],
          "value": '',
          "variable": '',
          "variable_value": ''
        };
        this.addLogicArr.push(addlogic);
      }
    });
  }

  selectedValue(event, index) {
    let parms = event.target.selectedOptions[0].ariaLabel;
    this.optsList = [];
    this.selectedArrG[index] = 0;
    this.selectedArrOptions[index] = [];
    if (event.target.value == '+') {
      this.loaderService.show();
      let makeJson = {
        "studyID": this.studyId,
        "qID": parms
      }
      this.httpService.callApi('logicVarOptions', { body: makeJson }).subscribe((response) => {
        let viewResp = response["header"]["code"];
        if (viewResp == 200) {
          let responseData = response["response"];
          this.optsList = responseData;
          this.selectedArrG[index] = responseData.length;
          this.selectedArrOptions[index] = responseData;
          this.loaderService.hide();
        }
      });
    } else {
      this.optsList = '';
      this.selectedArrG[index] = '';
      this.selectedArrOptions[index] = '';
    }

  }

  selectedValueOptions(eve, index) {
    let ind = (eve.target.selectedIndex - 1);
    let currentValue = this.optsList[ind];
    this.selectedOptions[index] = currentValue.options;
    this.selectedOptions[index + "len"] = currentValue.options.length;
    this.selectedOptions[index + "option"] = currentValue.options;
  }

  addAndOrLogic(index) {
    if (index.options.length == 0 || index.options.length < 5) {
      let addlogic = {
        "value": '1'
      }
      index.options.push(addlogic);
    } else {
      this.toastr.error("Only 5 condition can be created", '');
    }

  }

  selectedAdditionalValue(event, index, index2) {
    let parms = event.target.selectedOptions[0].ariaLabel;
    this.optsList1 = [];
    this.selectedArrG1[index + "" + index2] = 0;
    this.selectedArrOptions1[index + "" + index2] = [];
    if (event.target.value == '+') {
      this.loaderService.show();
      let makeJson = {
        "studyID": this.studyId,
        "qID": parms
      }
      this.httpService.callApi('crossOpts', { body: makeJson }).subscribe((response) => {
        let viewResp = response["header"]["code"];
        if (viewResp == 200) {
          let responseData = response["response"];
          this.optsList = responseData;
          this.optsList1 = responseData;
          this.selectedArrG1[index + "" + index2] = responseData.length;
          this.selectedArrOptions1[index + "" + index2] = responseData;
          this.loaderService.hide();
        }
      });
    } else {
      this.selectedArrG1[index + "" + index2] = '';
      this.selectedArrOptions1[index + "" + index2] = '';
      this.optsList1 = '';
    }
  }

  selectedAdditionalOptions(eve, index, secIndex) {
    let ind = (eve.target.selectedIndex - 1);
    let currentValue = this.optsList[ind];
    this.selectedOptions1[index + "" + secIndex] = currentValue.options;
    this.selectedOptions1[index + "" + secIndex + "len"] = currentValue.options.length;
    this.selectedOptions1[index + "" + secIndex + "option"] = currentValue.options;
  }

  removeLogicCond(indexpos) {
    this.addLogicArr.splice(indexpos, 1);
  }

  removeExistLogic(index) {
    this.settingList.bannerList_logic.splice(index, 1);
  }

  removeAndOrLogic(value, index) {
    value.options.splice(index, 1);
  }

  resetLogicAnd(j, i) {
    this.el.nativeElement.querySelector("#andor" + j + i).value = ' AND ';
    this.el.nativeElement.querySelector("#varand" + j + i).value = '';
    if (this.selectedArrG1[j + '' + i]) {
      this.el.nativeElement.querySelector("#v" + j + i).value = '';
    }
    if (this.selectedOptions1[j + '' + i + 'len'] == 0 || this.selectedArrG1[j + '' + i] == '') {
      this.el.nativeElement.querySelector("#andOper" + j + i).value = '';
    }
    if (this.selectedOptions1[j + '' + i + 'len'] > 0) {
      this.el.nativeElement.querySelector("#op" + j + i).value = '';
    }
    if (this.selectedOptions1[j + '' + i + 'len'] == 0 || this.selectedArrG1[j + '' + i] == '') {
      this.el.nativeElement.querySelector("#invalue" + j + i).value = '';
    }
  }

  resetLogic(iVal) {
    this.el.nativeElement.querySelector("#cond" + iVal).value = '';
    if (this.selectedArrG[iVal] > 0) {
      this.el.nativeElement.querySelector("#operator" + iVal).value = '';
    }
    if (this.selectedOptions[iVal + 'len'] == 0 || this.selectedArrG[iVal] == 0) {
      this.el.nativeElement.querySelector("#andOper" + iVal).value = '';
    }
    if (this.selectedOptions[iVal + 'len'] > 0 && this.selectedArrG[iVal] > 0) {
      this.el.nativeElement.querySelector("#options" + iVal).value = '';
    }
    if (this.selectedOptions[iVal + 'len'] == 0 || this.selectedArrG[iVal] == '') {
      this.el.nativeElement.querySelector("#invalue" + iVal).value = '';
    }
  }

  // Banner delete
  deletebannerModal(list) {
    this.display = 'block';
    this.bannerDisplay = 'block';
    this.bannerDelete = true;
    this.bannerTitle = list;
  }

  removeBanner() {
    let data = this.el.nativeElement.querySelector("#deleteSq").value.trim();
    let confirm = data.toLowerCase();
    if (confirm != '' && confirm == 'delete') {
      let deleteList = {
        "studyID": this.studyId,
        "bannerID": this.bannerTitle.bannerID
      }
      this.loaderService.show();
      this.httpService.callApi('removeBanner', { body: deleteList }).subscribe((response) => {
        let rsp = response["header"]["code"];
        if (rsp == 200) {
          this.closeCrossModal('bannerDelete');
          this.ngOnInit();
          this.toastr.success("Banner successfully deleted", this.masterData.stdName);
        }
      });
    } else {
      this.toastr.warning("Please write 'delete' in the input box ", '');
    }
  }

  // Save Banner settings
  saveBannerSettings() {
    let quesID = [];
    let allChecked = this.el.nativeElement.querySelectorAll(".getAll:checked");
    // Banner logic
    let coma1 = "'";
    let stringVal = "";
    let errorMsg = "";
    let error = 0;
    let logicalArray = [];

    this.el.nativeElement.querySelectorAll("div.banner_logical").forEach((element, k) => {
      let stringOp = "";
      let logicalStringOp = {};
      element.querySelectorAll(".banner-parent-class-logic").forEach((parent, i) => {
        parent.querySelectorAll(".question").forEach((questionValue, z) => {
          if (questionValue.value != '') {
            if (questionValue.value != "+" && element.querySelectorAll(".operator")[i].value != '' && element.querySelectorAll(".value")[i].value != '') {
              if (questionValue.value != '' && element.querySelectorAll(".operator")[i].value != "" && element.querySelectorAll(".value")[i].value != "") {
                stringOp += questionValue.value + element.querySelectorAll(".operator")[i].value + coma1 + element.querySelectorAll(".value")[i].value + coma1;
                stringVal += questionValue.value + element.querySelectorAll(".operator")[i].value + coma1 + element.querySelectorAll(".value")[i].value + coma1;
              } else {
                error += 1;
                if (questionValue.value == "") {
                  errorMsg = "Banner logic should not be empty";
                }
                else if (element.querySelectorAll(".operator")[i].value == "") {
                  errorMsg = "Banner logic operator should not be empty";
                }
                else if (element.querySelectorAll(".value")[i].value == "") {
                  errorMsg = "Banner logic value should not be empty";
                } else {
                  errorMsg = "Banner logic required";
                }
              }
            }
            else {
              if (this.selectedArrG[k] > 0) {
                if (this.selectedOptions[k + 'len'] > 0) {
                  if (element.querySelectorAll(".options")[i].value != "" && element.querySelectorAll(".subOption")[i].value != "") {
                    stringOp += element.querySelectorAll(".options")[i].value + element.querySelectorAll(".subOption")[i].value;
                  } else {
                    error += 1;
                    if (element.querySelectorAll(".options")[i].value == "") {
                      errorMsg = "Banner logic option should not be empty";
                    }
                    else if (element.querySelectorAll(".subOption")[i].value == "") {
                      errorMsg = "Banner logic sub option should not be empty";
                    } else {
                      errorMsg = "Banner logic required";
                    }
                  }
                }
                else {
                  if (element.querySelectorAll(".options")[i].value != "" && element.querySelectorAll(".operator")[i].value != "" && element.querySelectorAll(".value")[i].value != "") {
                    stringOp += element.querySelectorAll(".options")[i].value + element.querySelectorAll(".operator")[i].value + coma1 + element.querySelectorAll(".value")[i].value + coma1;
                  } else {
                    error += 1;
                    if (element.querySelectorAll(".options")[i].value == "") {
                      errorMsg = "Banner logic option should not be empty";
                    }
                    else if (element.querySelectorAll(".operator")[i].value == "") {
                      errorMsg = "Banner logic operator should not be empty";
                    }
                    else if (element.querySelectorAll(".value")[i].value == "") {
                      errorMsg = "Banner logic value should not be empty";
                    } else {
                      errorMsg = "Banner logic required";
                    }
                  }
                }
              }
              else {
                if (element.querySelectorAll(".operator")[i].value != "" && element.querySelectorAll(".value")[i].value != "") {
                  stringOp += element.querySelectorAll(".operator")[i].value + coma1 + element.querySelectorAll(".value")[i].value + coma1;
                } else {
                  error += 1;
                  if (element.querySelectorAll(".operator")[i].value == "") {
                    errorMsg = "Banner logic operator should not be empty";
                  }
                  else if (element.querySelectorAll(".value")[i].value == "") {
                    errorMsg = "Banner logic value should not be empty";
                  }
                }
              }
            }
          }
          else {
            // error +=1;
            // errorMsg = "Banner logic is required";
          }
        });
      });

      element.querySelectorAll(".banner-child-class-logic").forEach((child, j) => {
        child.querySelectorAll(".question").forEach((questionValue, i) => {
          if (questionValue.value != '') {
            if (questionValue.value != "+") {
              if (child.querySelectorAll(".andoroperator")[i].value != "" && child.querySelectorAll(".operator")[i].value != "" && child.querySelectorAll(".value")[i].value != "") {
                stringOp += child.querySelectorAll(".andoroperator")[i].value + questionValue.value + child.querySelectorAll(".operator")[i].value + coma1 + child.querySelectorAll(".value")[i].value + coma1;
                stringVal += child.querySelectorAll(".andoroperator")[i].value + questionValue.value + child.querySelectorAll(".operator")[i].value + coma1 + child.querySelectorAll(".value")[i].value + coma1;
              } else {
                error += 1;
                if (questionValue.value == "") {
                  errorMsg = "Banner logic should not be empty";
                }
                else if (element.querySelectorAll(".andoroperator")[i].value == "") {
                  errorMsg = "Banner logic operator should not be empty";
                }
                else if (element.querySelectorAll(".operator")[i].value == "") {
                  errorMsg = "Banner logic operator should not be empty";
                }
                else if (element.querySelectorAll(".value")[i].value == "") {
                  errorMsg = "Banner logic value should not be empty";
                }
                else {
                  errorMsg = "Banner logic required";
                }
              }
            }
            else {

              if (this.selectedArrG1[j + '' + k] > 0) {
                if (this.selectedOptions1[j + '' + k + 'len'] > 0) {
                  if (child.querySelectorAll(".andoroperator")[i].value != "" && child.querySelectorAll(".options")[i].value != "" && child.querySelectorAll(".subOption")[i].value != "") {
                    stringOp += child.querySelectorAll(".andoroperator")[i].value + child.querySelectorAll(".options")[i].value + child.querySelectorAll(".subOption")[i].value;
                  } else {
                    error += 1;
                    if (element.querySelectorAll(".andoroperator")[i].value == "") {
                      errorMsg = "Banner logic operator should not be empty";
                    }
                    else if (element.querySelectorAll(".subOption")[i].value == "") {
                      errorMsg = "Banner logic sub option should not be empty";
                    }
                    else if (element.querySelectorAll(".options")[i].value == "") {
                      errorMsg = "Banner logic option should not be empty";
                    } else {
                      errorMsg = "Banner logic required";
                    }
                  }
                }
                else {
                  if (child.querySelectorAll(".andoroperator")[i].value != "" && child.querySelectorAll(".options")[i].value != "" && child.querySelectorAll(".operator")[i].value != "" && child.querySelectorAll(".value")[i].value != "") {
                    stringOp += child.querySelectorAll(".andoroperator")[i].value + child.querySelectorAll(".options")[i].value + child.querySelectorAll(".operator")[i].value + coma1 + child.querySelectorAll(".value")[i].value + coma1;
                  } else {
                    error += 1;
                    if (element.querySelectorAll(".andoroperator")[i].value == "") {
                      errorMsg = "Banner logic operator should not be empty";
                    }
                    else if (element.querySelectorAll(".options")[i].value == "") {
                      errorMsg = "Banner logic options should not be empty";
                    }
                    else if (element.querySelectorAll(".value")[i].value == "") {
                      errorMsg = "Banner logic value should not be empty";
                    }
                    else if (element.querySelectorAll(".operator")[i].value == "") {
                      errorMsg = "Banner logic operator should not be empty";
                    }
                    else {
                      errorMsg = "Banner logic required";
                    }
                  }
                }
              }
              else {
                if (child.querySelectorAll(".andoroperator")[i].value != "" && child.querySelectorAll(".operator")[i].value != "" && child.querySelectorAll(".value")[i].value != "") {
                  stringOp += child.querySelectorAll(".andoroperator")[i].value + child.querySelectorAll(".operator")[i].value + coma1 + child.querySelectorAll(".value")[i].value + coma1;
                } else {
                  if (element.querySelectorAll(".andoroperator")[i].value == "" || element.querySelectorAll(".operator")[i].value == "") {
                    errorMsg = "Banner logic operator should not be empty";
                  }
                  else if (element.querySelectorAll(".value")[i].value == "") {
                    errorMsg = "Banner logic value should not be empty";
                  }
                  else {
                    errorMsg = "Banner logic required";
                  }
                }
              }

            }
          } else {
            error += 1;
            errorMsg = "Banner logic is required";
          }
        });
      });

      if (error == 0) {
        if (stringOp != "") {
          logicalStringOp["pointLogic"] = stringOp;
          logicalArray.push(logicalStringOp);
        }
      } else {
        this.toastr.error(errorMsg, '');
      }
    });

    let bannername = this.el.nativeElement.querySelector("#baner_name").value.trim();
    let banner_desc = this.el.nativeElement.querySelector("#banner_desc").value.trim();
    let stat_test = this.el.nativeElement.querySelector("#stat_test").value.trim();

    let count_type = 0;
    let per_type = 0;

    if (this.el.nativeElement.querySelector("#count_type").checked == true) {
      count_type = 1;
    }

    if (this.el.nativeElement.querySelector("#per_type").checked == true) {
      per_type = 1;
    }

    if (count_type == 0 && per_type == 0) {
      error += 1;
      errorMsg = "View type is required";
    }

    if (bannername == "") {
      error += 1;
      errorMsg = "Banner name is required";
    }

    if (allChecked.length > 0 && error == 0) {
      this.loaderService.show();
      allChecked.forEach(row => {
        quesID.push(row.id);
      });

      let studyJsonSet = {
        "studyID": this.studyId,
        "bannerID": this.settingList.bannerID,
        "quest_info": quesID
      }
      this.httpService.callApi('addTableToBanner', { body: studyJsonSet }).subscribe((response) => {
        let viewResp = response["header"]["code"];
        if (viewResp == 200) {
          // Update banner information
          if (bannername != "" && banner_desc != "") {
            if (this.settingList.bannerList_logic.length > 0) {
              this.settingList.bannerList_logic.forEach(lgic => {
                logicalArray.push(lgic);
              });
            }

            let bannerJosn = {
              "studyID": this.studyId,
              "bannerID": this.settingList.bannerID,
              "title": bannername,
              "description": banner_desc,
              "logic": logicalArray,
              "statGroup": stat_test,
              "count": count_type,
              "percent": per_type,
            }
            this.loaderService.show();
            this.httpService.callApi('bannerUpdate', { body: bannerJosn }).subscribe((response) => {
              let rsp = response["header"]["code"];
              if (rsp == 200) {
                this.closeCrossModal('settingsModal');
                this.ngOnInit();
                this.toastr.success("Banner settings saved", this.masterData.stdName);
              }
            });
          }
          else {
            this.toastr.error("Banner name is required", '');
          }
        }
      });
    }
    else {
      if (error > 0) {
        this.toastr.error(errorMsg, '');
      }
      else {
        this.toastr.warning("Question is required", '');
      }
    }
  }


  selectAllQuestion(event) {
    if (event.target.checked == true) {
      this.tableQuestionList.forEach(row => {
        this.el.nativeElement.querySelector("#" + row.qID).checked = true;
      });
    } else {
      this.tableQuestionList.forEach(row => {
        this.el.nativeElement.querySelector("#" + row.qID).checked = false;
      });
    }
  }

  singleQues() {
    let allCheck = this.el.nativeElement.querySelectorAll(".getAll:checked");
    if (allCheck.length == this.tableQuestionList.length) {
      this.el.nativeElement.querySelector("#select_all_ques").checked = true;
    }
    else {
      this.el.nativeElement.querySelector("#select_all_ques").checked = false;
    }
  }

  downloadExcel(list) {
    this.el.nativeElement.querySelector("#down_" + list.bannerID).classList.add("d_op");
    this.loaderService.show();
    let resetJson = {
      "studyID": this.studyId,
      "bannerID": list.bannerID,
      "tableID": list.tableID_list
    }
    this.httpService.callApi('downloadCrosstab', { body: resetJson }).subscribe((response) => {
      let viewResp = response["header"]["code"];
      this.loaderService.hide();
      if (viewResp == 200) {
        let pid = response["response"]["pid"];
        this.toastr.info("Please wait. Your file is being prepared for download, kindly visit download history", '');
        if (pid) {
          this.el.nativeElement.querySelector("#down_" + list.bannerID).classList.remove("d_op");
          this.downloadProcess(pid, '.xlsx', list);
        }
      }
    });
  }

  downloadProcess(pid, fl_type, list) {
    let pptJson = {
      "studyID": this.studyId,
      "pid": pid
    }
    this.httpService.callApi('downloadProcess', { body: pptJson, responseType: 'blob' as 'json' }).subscribe((response) => {
      if (response != null) {
        if (response.size > 0) {
          let filename = this.masterData['stdName'] + "_" + Date.now() + fl_type;
          let fileType = response.type;
          let rspData = [];
          let toastMessage;
          let fileExtension = filename.split('.').pop()?.toUpperCase() || 'File';
          let fileMessage = `${fileExtension}`;
          rspData.push(response);
          const now = new Date();
          const gmtDate = new Date(now.toUTCString());
          const formattedDate = `${gmtDate.getUTCDate().toString().padStart(2, '0')}_${gmtDate.toLocaleString('en-GB', { month: 'short', timeZone: 'GMT' })}_${gmtDate.getUTCFullYear()}`;
          if (fileMessage == 'XLSX') {
            toastMessage = `Crosstab Report for ${list.title} downloaded Successfully`;
            filename = `${this.masterData['stdName']}_Cross Tab Report across ${list.title} _${formattedDate}`;
          }
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(rspData, { type: fileType }));
          if (filename) {
            downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
            this.toastr.success(toastMessage, '');
          }
        }
      }
    });
  }

  downloadStatus(interval) {
    clearInterval(interval);
    this.toastr.info("Please check download history to download your file.", '');
    this.loaderService.show();
    this.systemSr.downloadHistory = true;
  }

  getDownloadHistory() {
    this.loaderService.show();
    this.systemSr.downloadHistory = true;
  }

  navigateTodas() {
    this.systemSr.navigateToproducts()
  }

  copyBanner(list) {
    this.bannerTitle = list;
    this.display = "block";
    this.bannerDisplay = "block";
    this.copyBannerModal = true;
  }

  confirmCopyBanner() {
    let data = this.el.nativeElement.querySelector("#replicateSq").value.trim();
    let confirm = data.toLowerCase();
    if (confirm != '') {
      let copyList = {
        "studyID": this.studyId,
        "bannerID": this.bannerTitle.bannerID,
        "title": data
      }
      this.loaderService.show();
      this.httpService.callApi('bannerReplicate', { body: copyList }).subscribe((response) => {
        let rsp = response["header"]["code"];
        if (rsp == 200) {
          this.closeCrossModal('copyBannerModal');
          this.ngOnInit();
          this.toastr.success("Banner successfully copied", this.masterData.stdName);
        }
      });
    } else {
      this.toastr.warning("Please write banner name in the input box ", '');
    }
  }

  shareLink() {
    this.copyUrl = '';
    this.loaderService.show();
    this.httpService
      .callApi('shareLinkCross', { body: { studyID: this.studyId } })
      .subscribe((response) => {
        let dataResponse = response['header']['code'];
        if (dataResponse == 200) {
          this.shareLinkDetail = response['response'];
          this.display = 'block';
          this.bannerDisplay = 'block';
          this.linkModalCross = true;
          this.copyUrl =
            'Link: ' +
            this.shareLinkDetail['shareLink'] +
            ', Password:' +
            this.shareLinkDetail['password'];
          this.loaderService.hide();
        }
      });
  }

  clShare() {
    this.linkModalCross = false;
    this.display = 'none';
    this.bannerDisplay = 'none';
  }
  copyStudyId() {
    this.toastr.success('Link copied', '');
  }

  openLink() {
    window.open(this.shareLinkDetail.shareLink, '_blank');
  }
  closeBanner() {
    this.editBanner = false;
    this.display = "none"
    this.tableApis()
  }
  goToEdit2(list, type) {
    this.masterData["bannerInfo"] = list;
    this.masterData["completeCount"] = this.completeCount?.completes;
    this.systemSr.setLocalStorage(this.masterData);
    this.loaderService.show();
    this.navigateUrl(type)
  }

}
