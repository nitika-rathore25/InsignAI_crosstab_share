import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../service/loader.service';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../service/http.service';
import { SystemService } from '../../service/system.service';
import { HttpClient } from '@angular/common/http';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-edit-table-list',
  templateUrl: './edit-table-list.component.html',
  styleUrls: ['./edit-table-list.component.css']
})
export class EditTableListComponent implements OnInit {

  masterData: any;
  display = "none";
  tableList = [];
  optiontext = this.systemSr.optiontext;
  qtext = this.systemSr.qtext
  settingList: any;
  settingsModal: boolean = false;
  editModal: boolean = false;
  addModal: boolean = false;
  tableQuestionList = [];
  editQuestion: any;
  mainDropArr = [];
  tableData: any;
  progress = 0;
  savedGroup = [];
  apiCounter = 0;
  bannerList: any;
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
  selectedArrOptions1 = {};
  segArrSaved = [];
  quesChecked = {};
  savedQuesList: any;
  tableLocalData: any;

  show_control = {};
  selected_arr = {};
  selected_arr1 = {};
  selected_options = {};
  selected_options_arr = {};
  optsList_op: any;
  logic_var_op: any;
  logic_conditions: any;
  logic_operators: any;
  showOpList: any;
  show_control1 = {};
  addCustomArr = [];
  sanitizedDescription: any;
  qType: any;
  saved_banner_list = [];
  banner_group_list = [];

  constructor(private http: HttpClient, private fb: FormBuilder, public systemSr: SystemService,
    private el: ElementRef, private router: Router, private httpService: HttpService,
    private loaderService: LoaderService, private toastr: ToastrService, private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.masterData = this.systemSr.getLocalStorage();
    console.log(this.masterData)
    if (this.masterData["bannerInfo"]["bannerID"]) {
      this.settingList = this.masterData["bannerInfo"];

      if (this.settingList.bannerPoint.length > 0) {
        this.banner_group_list = [];
        this.saved_banner_list = [];
        const arrObj1 = new Map();
        const arrObj2 = new Map();
        this.settingList.bannerPoint.forEach(bannerPoint => {
          if (Object.keys(arrObj1).indexOf(bannerPoint.bannerGroup.toLowerCase()) < 0 && bannerPoint.bannerGroup != "") {
            arrObj1.set(bannerPoint.bannerGroup.toLowerCase(), []);
          }
          if (bannerPoint.bannerGroup != "") {
            let fl_list = this.settingList.bannerPoint.filter((fl) => fl.bannerGroup.toLowerCase() === bannerPoint.bannerGroup.toLowerCase());
            arrObj1.set(bannerPoint.bannerGroup.toLowerCase(), fl_list);
          }
          else {
            this.saved_banner_list.push(bannerPoint);
          }
        });
        this.loaderService.show();
        let bannerJsn = {
          "studyID": this.masterData['urlStudyId'],
          "bannerID": this.masterData["bannerInfo"]["bannerID"]
        }
        this.httpService.callApi('bannerTableList', { body: bannerJsn }).subscribe((response) => {
          let viewResp = response["header"]["code"];
          if (viewResp == 200) {
            this.tableLocalData = this.systemSr.getBannerData();
            if (this.tableLocalData != undefined) {
              if (this.tableLocalData["tableLoaded"] != undefined) {
                this.tableList = this.tableLocalData["tableLoaded"];
              }
              else {
                this.tableList = response["response"];
              }
            }
            else {
              this.tableList = response["response"];
            }
            this.tableList.forEach(obj => {
              obj.description = obj.description.replaceAll("&lt;", "<").replaceAll("&gt;", ">");
            });


            this.httpService.callApi('allTableQuesList', { body: bannerJsn }).subscribe((response) => {
              let viewResp = response["header"]["code"];
              if (viewResp == 200) {
                this.tableQuestionList = response["response"];
                let studyJsonSet = {
                  "studyID": this.masterData['urlStudyId']
                }
                this.httpService.callApi('crossTabList', { body: studyJsonSet }).subscribe((response) => {
                  let viewResp = response["header"]["code"];
                  if (viewResp == 200) {
                    if (response["response"]) {
                      this.bannerList = response["response"];
                      response["response"].forEach(ban => {
                        if (ban.bannerID == this.settingList.bannerID) {
                          this.settingList["statGroup"] = ban.statGroup;
                          this.settingList["tb_enabled"] = ban.tb_enabled;
                          this.settingList["count"] = ban.count;
                          this.settingList["percent"] = ban.percent;
                          this.settingList["description"] = ban.description;
                          this.settingList["title"] = ban.title;
                        }
                      });

                      this.loaderService.hide();
                      console.log(this.tableList)
                      console.log(this.tableLocalData)
                      console.log(this.tableData)
                      console.log(this.settingList)

                      if (this.tableLocalData == undefined) {
                        this.getTableLogicData();
                      }
                      else {
                        this.el.nativeElement.querySelector("#showToast").classList.remove("show");
                      }
                    }
                  }
                });
              }
            });
          }
        });
      }

      else {
        this.navigateUrl("edit-banner");
      }
    }
    else {
      this.systemSr.internalNavigate();
    }
  }


  async getTableLogicData() {
    let headers = this.systemSr.getMasterToken();
    if (this.masterData["bannerInfo"] != undefined) {
      if (this.masterData["bannerInfo"]["bannerPoint"].length > 0 && this.tableList.length > 0) {
        this.el.nativeElement.querySelector("#showToast").classList.add("show");
      }
    }
    this.apiCounter = 0;
    this.progress = 0;
    console.log(this.tableList)
    this.tableList.forEach(async (list) => {
      let urlOne = this.systemSr.urlsService.url + '/crosstabShare/tableList/output/' + this.masterData["bannerInfo"]["bannerID"] + "/" + list.tableID;
      const promise = this.http.post(urlOne, { "switchKey": this.masterData['token'], "studyID": this.masterData['urlStudyId'] }).toPromise()
      promise.then(async (resp) => {
        let dRsp = await resp["header"]["code"];
        console.log(await resp)
        if (dRsp == 200) {
          if (list.tableID == resp["response"]["tableID"]) {
            list["row_data"] = resp["response"];
            list["row_data"]._row_order.forEach(ro => {
              list["row_data"]._rows[ro] = list["row_data"]._rows[ro].replaceAll("&lt;", "<").replaceAll("&gt;", ">");
            });
            list["banner_points"] = this.masterData["bannerInfo"]["bannerPoint"];
            this.apiCounter += 1;
            this.progress = Math.round((this.apiCounter / this.tableList.length) * 100);
            if (this.progress == 100) {
              setTimeout(() => {
                if (this.masterData["bannerInfo"] != undefined) {
                  if (this.apiCounter == this.tableList.length) {
                    this.el.nativeElement.querySelector("#showToast").classList.remove("show");
                    this.tableLocalData = {};
                    this.tableLocalData["tableLoaded"] = this.tableList;
                    this.tableLocalData = this.systemSr.encryptData(this.tableLocalData);
                    let nameLocal = this.masterData["bannerInfo"]["bannerID"] + this.systemSr.encFrData();
                    localStorage.setItem(nameLocal, JSON.stringify(this.tableLocalData));
                  }
                }
              }, 5000);
            }
          }
        }
        else {
          this.systemSr.postError(resp);
        }
      }, (error) => {
        this.systemSr.confirmartion(error);
      });
    });
  }

  navigateUrl(url) {
    this.router.navigate([url]);
  }

  closeSetModal(type) {
    this.display = "none";
    if (type == "settingsModal") {
      this.settingsModal = false;
    }
    if (type == "editModal") {
      this.editModal = false;
    }
    if (type == "addModal") {
      this.addModal = false;
    }
  }

  openSetModal() {
    this.loaderService.show();
    let bannerJsn = {
      "studyID": this.masterData['urlStudyId'],
      "bannerID": this.masterData["bannerInfo"]["bannerID"]
    }
    this.httpService.callApi('bannerTableList', { body: bannerJsn }).subscribe((response) => {
      let viewResp = response["header"]["code"];
      if (viewResp == 200) {
        this.savedQuesList = response["response"];
        if (response["response"].length > 0) {
          this.quesChecked = {};
          this.savedQuesList.forEach(cols => {
            this.quesChecked[cols.qID] = cols.qID;
          });
        }
        this.httpService.callApi('allTableQuesList', { body: bannerJsn }).subscribe((response) => {
          let viewResp = response["header"]["code"];
          if (viewResp == 200) {
            this.tableQuestionList = response["response"];
            this.selectedArrG = {};
            this.selectedArrOptions = {};
            this.selectedOptions = {};
            this.selectedArrG1 = {};
            this.selectedOptions1 = {};
            this.addLogicArr = [];
            let getQuestionsJson = {
              "studyID": this.masterData['urlStudyId'],
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

                let studyJsonSet = {
                  "studyID": this.masterData['urlStudyId']
                }
                this.httpService.callApi('crossTabList', { body: studyJsonSet }).subscribe((response) => {
                  let viewResp = response["header"]["code"];
                  if (viewResp == 200) {
                    if (response["response"]) {
                      this.bannerList = response["response"];
                      this.editModal = false;
                      this.display = "block";
                      this.settingsModal = true;

                      response["response"].forEach(ban => {
                        if (ban.bannerID == this.settingList.bannerID) {
                          this.settingList["statGroup"] = ban.statGroup;
                          this.settingList["tb_enabled"] = ban.tb_enabled;
                          this.settingList["count"] = ban.count;
                          this.settingList["percent"] = ban.percent;
                          this.settingList["description"] = ban.description;
                          this.settingList["title"] = ban.title;
                        }
                      });

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
                      this.loaderService.hide();
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  // Save Banner settings
  saveBannerSettings() {
    let quesID = [];
    let allChecked = this.el.nativeElement.querySelectorAll(".settingQues:checked");
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
      }
      else {
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
        "studyID": this.masterData['urlStudyId'],
        "bannerID": this.settingList.bannerID,
        "quest_info": quesID
      }
      this.httpService.callApi('addTableToBanner', { body: studyJsonSet }).subscribe((response) => {
        let viewResp = response["header"]["code"];
        if (viewResp == 200) {
          // Update banner information
          if (bannername != "") {
            if (this.settingList.bannerList_logic.length > 0) {
              this.settingList.bannerList_logic.forEach(lgic => {
                logicalArray.push(lgic);
              });
            }

            let bannerJosn = {
              "studyID": this.masterData['urlStudyId'],
              "bannerID": this.settingList.bannerID,
              "title": bannername,
              "description": banner_desc,
              "logic": logicalArray,
              "statGroup": stat_test,
              "count": count_type,
              "percent": per_type,
            }
            this.httpService.callApi('bannerUpdate', { body: bannerJosn }).subscribe((response) => {
              let rsp = response["header"]["code"];
              if (rsp == 200) {
                this.closeSetModal('settingsModal');
                this.editModal = false;
                this.settingsModal = false;
                this.updatedListAfterSetting(quesID);
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

  updatedListAfterSetting(quesID) {
    if (this.masterData["bannerInfo"] != undefined) {
      if (this.masterData["bannerInfo"]["bannerPoint"].length > 0 && this.tableList.length > 0) {
        this.el.nativeElement.querySelector("#showToast").classList.add("show");
      }
    }
    this.apiCounter = 0;
    this.progress = 0;
    let headers = this.systemSr.getMasterToken();
    let bannerJsn = {
      "studyID": this.masterData['urlStudyId'],
      "bannerID": this.masterData["bannerInfo"]["bannerID"]
    }
    this.httpService.callApi('bannerTableList', { body: bannerJsn }).subscribe((response) => {
      let viewResp = response["header"]["code"];
      if (viewResp == 200) {
        if (response["response"].length > 0) {
          this.apiCounter = 0;
          this.progress = 0;
          let localTable = [];
          response["response"].forEach((list) => {
            let urlOne = this.systemSr.urlsService.url + '/crosstabShare/tableList/output/' + this.masterData["bannerInfo"]["bannerID"] + "/" + list.tableID;
            const promise = this.http.post(urlOne, { "switchKey": this.masterData['token'], "studyID": this.masterData['urlStudyId'] }).toPromise();
            promise.then((resp) => {
              let dRsp = resp["header"]["code"];
              if (dRsp == 200) {
                this.loaderService.hide();
                localTable.push(list);
                let finalArr = [];
                localTable.forEach(row => {
                  if (list.tableID == row.tableID) {
                    row["row_data"] = resp["response"];
                    row["banner_points"] = this.masterData["bannerInfo"]["bannerPoint"];
                  }
                  let fArr = quesID.includes(row.qID);
                  if (fArr == true) {
                    finalArr.push(row);
                  }
                });

                if (finalArr.length > 0) {
                  this.tableLocalData = {};
                  this.tableList = [];
                  this.tableList = finalArr;
                  this.tableLocalData["tableLoaded"] = finalArr;
                  this.tableLocalData = this.systemSr.encryptData(this.tableLocalData);
                  let nameLocal = this.masterData["bannerInfo"]["bannerID"] + this.systemSr.encFrData();
                  localStorage.setItem(nameLocal, JSON.stringify(this.tableLocalData));
                  this.apiCounter += 1;
                  this.progress = Math.round((this.apiCounter / response["response"].length) * 100);
                  if (this.progress == 100) {
                    setTimeout(() => {
                      if (this.masterData["bannerInfo"] != undefined && response["response"].length == this.apiCounter) {
                        this.el.nativeElement.querySelector("#showToast").classList.remove("show");
                      }
                    }, 2000);
                  }
                }
              }
              else {
                this.systemSr.postError(response);
              }
            }, (error) => {
              this.systemSr.confirmartion(error);
            });
          });
        }

        let studyJsonSet = {
          "studyID": this.masterData['urlStudyId']
        }
        this.httpService.callApi('crossTabList', { body: studyJsonSet }).subscribe((response) => {
          let viewResp = response["header"]["code"];
          if (viewResp == 200) {
            if (response["response"]) {
              this.bannerList = response["response"];
              response["response"].forEach(ban => {
                if (ban.bannerID == this.settingList.bannerID) {
                  this.settingList["statGroup"] = ban.statGroup;
                  this.settingList["tb_enabled"] = ban.tb_enabled;
                  this.settingList["count"] = ban.count;
                  this.settingList["percent"] = ban.percent;
                  this.settingList["description"] = ban.description;
                  this.settingList["title"] = ban.title;
                  this.settingList["bannerList_logic"] = ban.bannerList_logic;
                }
              });

              this.toastr.success("Banner settings saved", this.masterData.stdName);
            }
          }
        });
      }
    });
  }

  drop(event: CdkDragDrop<string[]>, data) {
    moveItemInArray(data, event.previousIndex, event.currentIndex);
  }

  // Edit table question
  editQuestionModal(ques) {
    let headers = this.systemSr.getMasterToken();
    this.loaderService.show();
    this.tableData = ques;
    let urlOne = this.systemSr.urlsService.urlCrosstab + '/tableList/opList/' + ques.tableID + "/" + ques.qID;
    const promise = this.http.post(urlOne,
      {
        "apiToken": this.masterData['token'],
        "studyID": this.masterData['urlStudyId'],
        "bannerID": this.masterData["bannerInfo"]["bannerID"]
      }, { headers }).toPromise();
    promise.then((resp) => {
      let dRsp = resp["header"]["code"];
      if (dRsp == 200) {
        this.editQuestion = {};
        this.editQuestion = resp["response"];
        this.mainDropArr = resp["response"]["rowOptionList"];
        this.qType = resp["response"]["qType"];
        this.selectedArrG = {};
        this.selectedArrOptions = {};
        this.selectedOptions = {};
        this.selectedArrG1 = {};
        this.selectedOptions1 = {};
        this.addLogicArr = [];
        let getQuestionsJson = {
          "studyID": this.masterData['urlStudyId'],
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
            this.editModal = true;
            this.display = "block";
            this.loaderService.hide();
          }
        });
      }
      else {
        this.systemSr.postError(resp);
      }
    }, (error) => {
      this.systemSr.confirmartion(error);
    });
  }

  getType(event, op) {
    if (event.target.value != "" && event.target.value == "Net") {
      this.el.nativeElement.querySelector(".show_net_" + op?.newID).classList.remove("d-none");
    }
    else {
      this.el.nativeElement.querySelector(".show_net_" + op?.newID).classList.add("d-none");
    }
  }

  removeExistLogic(index,) {
    this.editQuestion["logic"].splice(index, 1);
  }

  removeExistLogicBanner(index) {
    this.settingList.bannerList_logic.splice(index, 1);
  }

  saveTableQuestion() {
    let error = 0;
    let roOptions = [];
    let errorMessage = '';
    let coma1 = "'";
    let logicalArray = [];
    let meanArr = [];
    let medianArr = [];
    let stdvArr = [];
    let duplOptext = [];

    let qLabel = this.el.nativeElement.querySelector("#q_" + this.editQuestion.qID).value.trim();
    if (qLabel == "") {
      error += 1;
      errorMessage = "Question label is required.";
    }
    let qText = this.el.nativeElement.querySelector("#q_Text" + this.editQuestion.qID).value.trim();
    if (qText == "") {
      error += 1;
      errorMessage = "Question text is required.";
    }
    if (this.mainDropArr.length > 0 && this.mainDropArr.length < 100) {
      this.mainDropArr.forEach((row, i) => {
        let show = 0;
        let mean = 0;
        let median = 0;
        let stdev = 0;
        let rowType = "";
        let netData = "";
        let opText = this.el.nativeElement.querySelector("#op_" + i).value.trim();
        if (row.net_val == 1 || row?.old_q == 0) {
          rowType = this.el.nativeElement.querySelector("#rowType_" + i).value;
        }

        if (this.el.nativeElement.querySelector("#op_show_" + i).checked == true) {
          show = 1;
        }

        if (rowType == "Net") {
          let net = this.el.nativeElement.querySelectorAll(".net_type" + i + ":checked");
          if (net.length > 0) {
            net.forEach(row => {
              netData += row.value + ",";
            });
          }
          else {
            error += 1;
            errorMessage = "Net option is required";
          }
        }

        if (row.old_q == 0) {
          rowType = this.el.nativeElement.querySelector("#rowType_" + i).value;
          if (rowType == "") {
            error += 1;
            errorMessage = "Row type is required";
          }
          else {
            if (rowType != "Net" && rowType == "Mean") {
              mean = 1;
              meanArr.push(rowType);
            }
            if (rowType != "Net" && rowType == "Median") {
              medianArr.push(rowType);
              median = 1;
            }
            if (rowType != "Net" && rowType == "Standard Deviation") {
              stdvArr.push(rowType);
              stdev = 1;
            }
          }
        }

        if (opText == "") {
          error += 1;
          errorMessage = "Option text is required";
        }
        else {
          duplOptext.push(opText.toLowerCase());
          let makeOp = {
            "active": row.active,
            "id": row.id,
            "optionCode": (i + 1),
            "optionLogic": row.optionLogic,
            "optionText": opText,
            "optionType": "multiple-select",
            "seq": (i + 1),
            "show": show,
            "include_in_base": 0,
            "mean": mean,
            "median": median,
            "stdev": stdev,
            "net": netData
          }
          roOptions.push(makeOp);
        }
      });
    }
    else {
      if (this.mainDropArr.length > 99) {
        error += 1;
        errorMessage = "Max 100 rows can be created";
      }
    }

    this.el.nativeElement.querySelectorAll("div.logical").forEach((element, k) => {
      let stringOp = "";
      let logicalStringOp = {};
      element.querySelectorAll(".parent-class-logic").forEach((parent, i) => {
        parent.querySelectorAll(".question").forEach((questionValue, z) => {
          if (questionValue.value != '') {
            if (questionValue.value != "+" && element.querySelectorAll(".operator")[i].value != '' && element.querySelectorAll(".value")[i].value != '') {
              if (questionValue.value != '' && element.querySelectorAll(".operator")[i].value != "" && element.querySelectorAll(".value")[i].value != "") {
                stringOp += questionValue.value + element.querySelectorAll(".operator")[i].value + coma1 + element.querySelectorAll(".value")[i].value + coma1;
              } else {
                error += 1;
                if (questionValue.value == "") {
                  errorMessage = "Table logic should not be empty";
                }
                else if (element.querySelectorAll(".operator")[i].value == "") {
                  errorMessage = "Table logic operator should not be empty";
                }
                else if (element.querySelectorAll(".value")[i].value == "") {
                  errorMessage = "Table logic value should not be empty";
                } else {
                  errorMessage = "Table logic required";
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
                      errorMessage = "Table logic option should not be empty";
                    }
                    else if (element.querySelectorAll(".subOption")[i].value == "") {
                      errorMessage = "Table logic sub option should not be empty";
                    } else {
                      errorMessage = "Table logic required";
                    }
                  }
                }
                else {
                  if (element.querySelectorAll(".options")[i].value != "" && element.querySelectorAll(".operator")[i].value != "" && element.querySelectorAll(".value")[i].value != "") {
                    stringOp += element.querySelectorAll(".options")[i].value + element.querySelectorAll(".operator")[i].value + coma1 + element.querySelectorAll(".value")[i].value + coma1;
                  } else {
                    error += 1;
                    if (element.querySelectorAll(".options")[i].value == "") {
                      errorMessage = "Table logic option should not be empty";
                    }
                    else if (element.querySelectorAll(".operator")[i].value == "") {
                      errorMessage = "Table logic operator should not be empty";
                    }
                    else if (element.querySelectorAll(".value")[i].value == "") {
                      errorMessage = "Table logic value should not be empty";
                    } else {
                      errorMessage = "Table logic required";
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
                    errorMessage = "Table logic operator should not be empty";
                  }
                  else if (element.querySelectorAll(".value")[i].value == "") {
                    errorMessage = "Table logic value should not be empty";
                  }
                }
              }
            }
          }
          else {
          }
        });
      });

      element.querySelectorAll(".child-class-logic").forEach((child, j) => {
        child.querySelectorAll(".question").forEach((questionValue, i) => {
          if (questionValue.value != '') {
            if (questionValue.value != "+") {
              if (child.querySelectorAll(".andoroperator")[i].value != "" && child.querySelectorAll(".operator")[i].value != "" && child.querySelectorAll(".value")[i].value != "") {
                stringOp += child.querySelectorAll(".andoroperator")[i].value + questionValue.value + child.querySelectorAll(".operator")[i].value + coma1 + child.querySelectorAll(".value")[i].value + coma1;
              } else {
                error += 1;
                if (questionValue.value == "") {
                  errorMessage = "Table logic should not be empty";
                }
                else if (element.querySelectorAll(".andoroperator")[i].value == "") {
                  errorMessage = "Table logic operator should not be empty";
                }
                else if (element.querySelectorAll(".operator")[i].value == "") {
                  errorMessage = "Table logic operator should not be empty";
                }
                else if (element.querySelectorAll(".value")[i].value == "") {
                  errorMessage = "Table logic value should not be empty";
                }
                else {
                  errorMessage = "Table logic required";
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
                      errorMessage = "Table logic operator should not be empty";
                    }
                    else if (element.querySelectorAll(".subOption")[i].value == "") {
                      errorMessage = "Table logic sub option should not be empty";
                    }
                    else if (element.querySelectorAll(".options")[i].value == "") {
                      errorMessage = "Table logic option should not be empty";
                    } else {
                      errorMessage = "Table logic required";
                    }
                  }
                }
                else {
                  if (child.querySelectorAll(".andoroperator")[i].value != "" && child.querySelectorAll(".options")[i].value != "" && child.querySelectorAll(".operator")[i].value != "" && child.querySelectorAll(".value")[i].value != "") {
                    stringOp += child.querySelectorAll(".andoroperator")[i].value + child.querySelectorAll(".options")[i].value + child.querySelectorAll(".operator")[i].value + coma1 + child.querySelectorAll(".value")[i].value + coma1;
                  } else {
                    error += 1;
                    if (element.querySelectorAll(".andoroperator")[i].value == "") {
                      errorMessage = "Table logic operator should not be empty";
                    }
                    else if (element.querySelectorAll(".options")[i].value == "") {
                      errorMessage = "Table logic options should not be empty";
                    }
                    else if (element.querySelectorAll(".value")[i].value == "") {
                      errorMessage = "Table logic value should not be empty";
                    }
                    else if (element.querySelectorAll(".operator")[i].value == "") {
                      errorMessage = "Table logic operator should not be empty";
                    }
                    else {
                      errorMessage = "Table logic required";
                    }
                  }
                }
              }
              else {
                if (child.querySelectorAll(".andoroperator")[i].value != "" && child.querySelectorAll(".operator")[i].value != "" && child.querySelectorAll(".value")[i].value != "") {
                  stringOp += child.querySelectorAll(".andoroperator")[i].value + child.querySelectorAll(".operator")[i].value + coma1 + child.querySelectorAll(".value")[i].value + coma1;
                } else {
                  if (element.querySelectorAll(".andoroperator")[i].value == "" || element.querySelectorAll(".operator")[i].value == "") {
                    errorMessage = "Table logic operator should not be empty";
                  }
                  else if (element.querySelectorAll(".value")[i].value == "") {
                    errorMessage = "Table logic value should not be empty";
                  }
                  else {
                    errorMessage = "Table logic required";
                  }
                }
              }

            }
          } else {
            error += 1;
            errorMessage = "Table logic is required";
          }
        });
      });

      if (error == 0) {
        if (stringOp != "") {
          logicalStringOp["pointLogic"] = stringOp;
          logicalArray.push(logicalStringOp);
        }
      }
    });

    if (this.editQuestion.logic.length > 0) {
      this.editQuestion.logic.forEach(lg => {
        logicalArray.push(lg)
      });
    }

    if (meanArr.length > 1) {
      error += 1;
      errorMessage = "Mean row already added";
    }
    else if (medianArr.length > 1) {
      error += 1;
      errorMessage = "Median row already added";
    }
    else if (stdvArr.length > 1) {
      error += 1;
      errorMessage = "Standard Deviation row already added";
    }

    let seen = duplOptext.filter((s => v => s.has(v) || !s.add(v))(new Set));

    if (seen.length > 0) {
      error += 1;
      errorMessage = "Option text should be unique";
    }

    if (error == 0) {
      this.loaderService.show();
      let finalSavedata = {
        "apiToken": this.masterData['token'],
        "studyID": this.masterData['urlStudyId'],
        "bannerID": this.masterData["bannerInfo"]["bannerID"],
        "active": this.editQuestion.active,
        "description": qText,
        "tableID": this.editQuestion.tableID,
        "title": qLabel,
        "rowOptionList": roOptions,
        "logic": logicalArray
      }
      let headers = this.systemSr.getMasterToken();
      let url = this.systemSr.urlsService.urlCrosstab + '/tableList/edit/' + this.editQuestion.qID;
      this.http.post(url, finalSavedata, { headers }).subscribe(response => {
        let saveResp = response["header"]["code"];
        if (saveResp == 200) {
          this.updateEditData();
          this.toastr.success(this.editQuestion.qID + " question saved successfully", '');
        }
        else {
          this.systemSr.postError(response);
        }
      }, (error) => {
        this.systemSr.confirmartion(error);
      });
    }
    else {
      this.toastr.error(errorMessage, '');
    }
  }

  updateEditData() {
    let headers = this.systemSr.getMasterToken();
    let urlOne = this.systemSr.urlsService.url + '/crosstabShare/tableList/output/' + this.masterData["bannerInfo"]["bannerID"] + "/" + this.tableData.tableID;
    const promise = this.http.post(urlOne, { "switchKey": this.masterData['token'], "studyID": this.masterData['urlStudyId'] }).toPromise();
    promise.then((resp) => {
      let dRsp = resp["header"]["code"];
      if (dRsp == 200) {
        this.tableData["row_data"] = [];
        this.tableData["row_data"] = resp["response"];
        let bannerJsn = {
          "studyID": this.masterData['urlStudyId'],
          "bannerID": this.masterData["bannerInfo"]["bannerID"]
        }
        this.httpService.callApi('bannerTableList', { body: bannerJsn }).subscribe((response) => {
          let viewResp = response["header"]["code"];
          if (viewResp == 200) {
            let questionUpdate = response["response"];
            questionUpdate.forEach(row => {
              if (row.tableID == this.tableData.tableID) {
                this.tableData["title"] = row.title;
                this.tableData["description"] = row.description;
              }
            });
            let getData = this.systemSr.getBannerData();
            if (getData) {
              getData["tableLoaded"].forEach(cols => {
                if (cols.tableID == this.tableData.tableID) {
                  cols["tbl_logic"] = this.tableData["tbl_logic"];
                  cols["banner_points"] = this.tableData["banner_points"];
                  cols["description"] = this.tableData["description"];
                  cols["row_data"] = this.tableData["row_data"];
                  cols["title"] = this.tableData["title"];
                }
              });
              let sendData = this.systemSr.encryptData(getData);
              let nameLocal = this.masterData["bannerInfo"]["bannerID"] + this.systemSr.encFrData();
              localStorage.setItem(nameLocal, JSON.stringify(sendData));
            }
          }
        });

        this.closeSetModal('settingsModal');
        this.loaderService.hide();
      }
      else {
        this.systemSr.postError(resp);
      }
    }, (error) => {
      this.systemSr.confirmartion(error);
    });
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

  addRowOption() {
    let randNum1 = Math.floor(Math.random() * 8) + 3;
    let makeData = {
      "active": 1,
      "id": "",
      "optionCode": (this.mainDropArr.length + 1),
      "optionLogic": "",
      "optionText": "",
      "optionType": "multiple-select",
      "seq": (this.mainDropArr.length + 1),
      "include_in_base": 0,
      "mean": 0,
      "median": 0,
      "net": {},
      "op_show": 1,
      "net_val": 1,
      "stdev": 0,
      "old_q": 0,
      "showRw": 1,
      "newRow": 1,
      "newID": this.randomPassValue(randNum1)
    }
    this.mainDropArr.push(makeData);
  }

  removeRowoption(index) {
    this.mainDropArr.splice(index, 1);
  }

  saveQuestion() {
    let quesID = [];
    let allChecked = this.el.nativeElement.querySelectorAll(".getAll:checked");
    if (allChecked.length > 0) {
      this.loaderService.show();
      allChecked.forEach(row => {
        quesID.push(row.id);
      });

      let studyJsonSet = {
        "studyID": this.masterData['urlStudyId'],
        "bannerID": this.masterData["bannerInfo"]["bannerID"],
        "quest_info": quesID
      }
      this.httpService.callApi('addTableToBanner', { body: studyJsonSet }).subscribe((response) => {
        let viewResp = response["header"]["code"];
        if (viewResp == 200) {
          this.ngOnInit();
          this.toastr.success("Question list added to table successfully", '');
        }
      });
    } else {
      this.toastr.warning("Question is required", '');
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

  singleQues(event) {
    let allCheck = this.el.nativeElement.querySelectorAll(".getAll:checked");
    if (allCheck.length == this.tableQuestionList.length) {
      this.el.nativeElement.querySelector("#select_all_ques").checked = true;
    }
    else {
      this.el.nativeElement.querySelector("#select_all_ques").checked = false;
    }
  }

  selectAllSet(event) {
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

  singleSetQues() {
    let allCheck = this.el.nativeElement.querySelectorAll(".settingQues:checked");
    if (allCheck.length == this.tableQuestionList.length) {
      this.el.nativeElement.querySelector("#select_set_ques").checked = true;
    }
    else {
      this.el.nativeElement.querySelector("#select_set_ques").checked = false;
    }
  }

  changeBanner() {
    let getId = this.el.nativeElement.querySelector("#get_banner_id").value;
    this.loaderService.show();
    let bannerJsn = {
      "studyID": this.masterData['urlStudyId'],
      "bannerID": getId
    }
    this.httpService.callApi('bannerPointList', { body: bannerJsn }).subscribe((response) => {
      let viewResp = response["header"]["code"];
      if (viewResp == 200) {
        this.masterData["bannerInfo"] = {};
        this.bannerList.forEach(banner => {
          if (getId == banner.bannerID) {
            this.masterData["bannerInfo"] = banner;
            this.masterData["bannerInfo"]["bannerPoint"] = response["response"];
            this.systemSr.setLocalStorage(this.masterData);
            console.log(this.masterData)
            if (this.masterData["bannerInfo"]["bannerPoint"].length == 0) {
              this.navigateUrl("edit-banner");
            }
            else {
              this.apiCounter = 0;
              this.progress = 0;
              this.systemSr.clearCrosstabTable();
              this.ngOnInit();
            }
          }
        });
      }
    });
  }

  // Add Logic to banner
  addLogicCondition() {
    let addlogic = {
      "options": [],
    };
    this.addLogicArr.push(addlogic);
  }

  selectedValue(event, index) {
    let parms = event.target.selectedOptions[0].ariaLabel;
    this.optsList = [];
    this.selectedArrG[index] = 0;
    this.selectedArrOptions[index] = [];
    if (event.target.value == '+') {
      this.loaderService.show();
      let makeJson = {
        "studyID": this.masterData['urlStudyId'],
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
    this.selectedArrG1[index + "" + index2] = 0;
    this.selectedArrOptions1[index + "" + index2] = [];
    if (event.target.value == '+') {
      this.loaderService.show();
      let makeJson = {
        "studyID": this.masterData['urlStudyId'],
        "qID": parms
      }
      this.httpService.callApi('crossOpts', { body: makeJson }).subscribe((response) => {
        let viewResp = response["header"]["code"];
        if (viewResp == 200) {
          let responseData = response["response"];
          this.optsList = responseData;
          this.selectedArrG1[index + "" + index2] = responseData.length;
          this.selectedArrOptions1[index + "" + index2] = responseData;
          this.loaderService.hide();
        }
      });
    } else {
      this.selectedArrG1[index + "" + index2] = '';
      this.selectedArrOptions1[index + "" + index2] = '';
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

  downloadExcel(number) {
    this.loaderService.show();
    this.el.nativeElement.querySelector("#cross_down").classList.add("d_op");
    let tableArr = [];
    this.tableList.forEach(tbl => {
      tableArr.push(tbl.tableID);
    });
    let resetJson = {
      "studyID": this.masterData['urlStudyId'],
      "bannerID": this.masterData['bannerInfo']['bannerID'],
      "tableID": tableArr
    }
    this.httpService.callApi('downloadCrosstab', { body: resetJson }).subscribe((response) => {
      let viewResp = response["header"]["code"];
      this.loaderService.hide();
      if (viewResp == 200) {
        let pid = response["response"]["pid"];
        this.toastr.info("Please wait. Your file is being prepared for download, kindly visit download history", '');
        if (pid) {
          this.el.nativeElement.querySelector("#cross_down").classList.remove("d_op");
          this.downloadProcess(pid, '.xlsx', '', number);
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

  downloadCrosstab(list, number) {
    this.loaderService.show();
    this.el.nativeElement.querySelector(".add_" + list.qID).classList.add("d_op");
    let tableID = []
    tableID.push(list.tableID);
    let resetJson = {
      "studyID": this.masterData['urlStudyId'],
      "bannerID": this.masterData['bannerInfo']['bannerID'],
      "tableID": tableID
    }
    this.httpService.callApi('downloadCrosstab', { body: resetJson }).subscribe((response) => {
      let viewResp = response["header"]["code"];
      this.loaderService.hide();
      if (viewResp == 200) {
        let pid = response["response"]["pid"];
        this.toastr.info("Please wait. Your file is being prepared for download, kindly visit download history", '');
        if (pid) {
          this.el.nativeElement.querySelector(".add_" + list.qID).classList.remove("d_op");
          this.downloadProcess(pid, '.xlsx', list, number);
        }
      }
    });
  }

  downloadProcess(pid, fl_type, list, number) {
    let pptJson = {
      "studyID": this.masterData['urlStudyId'],
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
          if (fileMessage == 'XLSX' && number === 'single') {
            toastMessage = `Crosstab Report for ${this.masterData['bannerInfo']['title']} : ${list?.qLabel} downloaded Successfully`;
            filename = `${this.masterData['stdName']}_${list.qID}_Cross Tab Report across ${this.masterData['bannerInfo']['title']} _${formattedDate}`;
          }
          else if (fileMessage == 'XLSX' && number === 'overall') {
            toastMessage = `Crosstab Report for ${this.masterData['bannerInfo']['title']} downloaded Successfully`;
            filename = `${this.masterData['stdName']}_Cross Tab Report across ${this.masterData['bannerInfo']['title']} _${formattedDate}`;
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

  reloadTable(list) {
    delete list["row_data"];
    let headers = this.systemSr.getMasterToken();
    let urlOne = this.systemSr.urlsService.url + '/crosstabShare/tableList/output/' + this.masterData["bannerInfo"]["bannerID"] + "/" + list.tableID;
    const promise = this.http.post(urlOne, { "switchKey": this.masterData['token'], "studyID": this.masterData['urlStudyId'] }).toPromise();
    promise.then((resp) => {
      let dRsp = resp["header"]["code"];
      if (dRsp == 200) {
        list["row_data"] = resp["response"];
        list["banner_points"] = this.masterData["bannerInfo"]["bannerPoint"];

        list["row_data"]._row_order.forEach(ro => {
          list["row_data"]._rows[ro] = list["row_data"]._rows[ro].replaceAll("&lt;", "<").replaceAll("&gt;", ">");
        });
      }
      else {
        this.systemSr.postError(resp);
      }
    }, (error) => {
      this.systemSr.confirmartion(error);
    });
  }

  navigateTodas() {
    this.systemSr.navigateToproducts()
  }



  // Add Custom table with row logic
  openAddModal() {
    this.addCustomArr = [];
    this.selectedArrG = {};
    this.selectedArrOptions = {};
    this.selectedOptions = {};
    this.selectedOptions = {};
    this.selectedArrG1 = {};
    this.selectedOptions1 = {};
    this.addLogicArr = [];
    let getQuestionsJson = {
      "studyID": this.masterData['urlStudyId'],
      "default": "quot"
    }
    this.loaderService.show();
    this.httpService.callApi('crossVars', { body: getQuestionsJson }).subscribe((response) => {
      let getQuesResp = response["header"]["code"];
      if (getQuesResp == 200) {
        this.logicLists = response["response"];
        this.logicConditions = response["response"]["condition"];
        this.logicOperators = response["response"]["operators"];
        this.logicVars = response["response"]["variables"];

        this.show_control = {};
        this.show_control1 = {};
        this.selected_arr = {};
        this.selected_arr1 = {};
        this.selected_options = {};
        this.selected_options_arr = {};

        this.logicLists = response["response"];
        this.logic_conditions = response["response"]["condition"];
        this.logic_operators = response["response"]["operators"];
        this.logic_var_op = response["response"]["variables"];

        let addlogic = {
          "condition": '',
          "operator": '',
          "options": [],
          "value": '',
          "variable": '',
          "variable_value": ''
        };
        this.addLogicArr.push(addlogic);
        this.display = "block";
        this.addModal = true;
        let randNum1 = Math.floor(Math.random() * 8) + 3;
        let makeRow = {
          "active": 1,
          "id": "R-" + (this.mainDropArr.length + 1),
          "optionCode": (this.mainDropArr.length + 1),
          "optionLogic": "",
          "optionText": "",
          "optionType": "multiple-select",
          "seq": (this.mainDropArr.length + 1),
          "include_in_base": 0,
          "mean": 0,
          "median": 0,
          "net": {},
          "op_show": 1,
          "net_val": 1,
          "stdev": 0,
          "old_q": 0,
          "showRw": 1,
          "newRow": 1,
          "newID": this.randomPassValue(randNum1),
          "op_logic": [{
            "condition": '',
            "operator": '',
            "options": [],
            "value": '',
            "variable": '',
            "variable_value": ''
          }]
        }
        this.addCustomArr.push(makeRow);
        this.loaderService.hide();
      }
    });
  }

  addRowOptionNewTable() {
    if (this.addCustomArr.length < 50) {
      let randNum1 = Math.floor(Math.random() * 8) + 3;
      let makeData = {
        "active": 1,
        "id": "R-" + (this.mainDropArr.length + 1),
        "optionCode": (this.mainDropArr.length + 1),
        "optionLogic": "",
        "optionText": "",
        "optionType": "multiple-select",
        "seq": (this.mainDropArr.length + 1),
        "include_in_base": 0,
        "mean": 0,
        "median": 0,
        "net": {},
        "op_show": 1,
        "net_val": 1,
        "stdev": 0,
        "old_q": 0,
        "showRw": 1,
        "newRow": 1,
        "newID": this.randomPassValue(randNum1),
        "op_logic": [{
          "condition": '',
          "operator": '',
          "options": [],
          "value": '',
          "variable": '',
          "variable_value": ''
        }]
      }
      this.addCustomArr.push(makeData);
    }
    else {
      this.toastr.success("Max 50 rows can be added.", '');
    }
  }

  getLogicOrNot(event, op, a) {
    if (event.target.value != "" && event.target.value == "Net") {
      this.el.nativeElement.querySelector(".show_net_" + op?.newID).classList.remove("d-none");
    }
    else {
      this.el.nativeElement.querySelector(".show_net_" + op?.newID).classList.add("d-none");
    }

    if (event.target.value != "") {
      this.el.nativeElement.querySelector(".lgic_" + a).classList.add("d-none");
    }
    else {
      this.el.nativeElement.querySelector(".lgic_" + a).classList.remove("d-none");
    }
  }

  selectedOption(event, index, a) {
    let parms = event.target.selectedOptions[0].ariaLabel;
    this.optsList = [];
    this.selected_arr[index + a] = 0;
    this.selected_options[index + a] = [];
    if (event.target.value == '+') {
      this.loaderService.show();
      let makeJson = {
        "studyID": this.masterData['urlStudyId'],
        "qID": parms
      }
      this.httpService.callApi('logicVarOptions', { body: makeJson }).subscribe((response) => {
        let viewResp = response["header"]["code"];
        if (viewResp == 200) {
          let responseData = response["response"];
          this.optsList = responseData;
          this.selected_arr[index + a] = responseData.length;
          this.selected_options[index + a] = responseData;
          this.loaderService.hide();
        }
      });
    } else {
      this.optsList = '';
      this.selected_arr[index + a] = '';
      this.selected_options[index + a] = '';
    }

  }

  selectedSubOptions(eve, index, a) {
    let ind = (eve.target.selectedIndex - 1);
    let currentValue = this.optsList[ind];
    this.show_control[index + a] = currentValue.options;
    this.show_control[index + a + "len"] = currentValue.options.length;
    this.show_control[index + a + "option"] = currentValue.options;
  }

  slOp(event, index, index2, a) {
    let parms = event.target.selectedOptions[0].ariaLabel;
    this.selected_arr1[index + "" + index2 + a] = 0;
    this.selected_options_arr[index + "" + index2 + a] = [];
    if (event.target.value == '+') {
      this.loaderService.show();
      let makeJson = {
        "studyID": this.masterData['urlStudyId'],
        "qID": parms
      }
      this.httpService.callApi('crossOpts', { body: makeJson }).subscribe((response) => {
        let viewResp = response["header"]["code"];
        if (viewResp == 200) {
          let responseData = response["response"];
          this.optsList = responseData;
          this.selected_arr1[index + "" + index2 + a] = responseData.length;
          this.selected_options_arr[index + "" + index2 + a] = responseData;
          this.loaderService.hide();
        }
      });
    } else {
      this.selected_arr1[index + "" + index2 + a] = '';
      this.selected_options_arr[index + "" + index2 + a] = '';
    }
  }

  addOpSel(eve, index, secIndex, a) {
    let ind = (eve.target.selectedIndex - 1);
    let currentValue = this.optsList[ind];
    this.show_control1[index + a + "" + secIndex] = currentValue.options;
    this.show_control1[index + a + "" + secIndex + "len"] = currentValue.options.length;
    this.show_control1[index + a + "" + secIndex + "option"] = currentValue.options;
  }

  addOp(index) {
    if (index.options.length == 0 || index.options.length < 5) {
      let addlogic = {
        "value": '1'
      }
      index.options.push(addlogic);
    } else {
      this.toastr.error("Only 5 condition can be created", '');
    }
  }

  addAnLogic(op) {
    if (op.op_logic.length == 0 || op.op_logic.length < 5) {
      let addlogic = {
        "options": [],
      };
      op.op_logic.push(addlogic);
    } else {
      this.toastr.error("Only 5 condition can be created", '');
    }
  }

  rmOpLogic(index, rw) {
    rw.op_logic.splice(index, 1);
  }

  rmAndLgic(rw, index) {
    rw.options.splice(index, 1);
  }

  saveCustomTable() {
    let error = 0;
    let roOptions = [];
    let errorMessage = '';
    let coma1 = "'";
    let logicalArray = [];
    let duplOptext = [];

    if (this.addCustomArr.length > 0 && this.addCustomArr.length < 50) {
      this.addCustomArr.forEach((row, a) => {
        let optionLogicArr = [];
        let opText = this.el.nativeElement.querySelector("#op_Text" + a).value.trim();

        // option logic
        this.el.nativeElement.querySelectorAll("div.logical_option" + a).forEach((element, k) => {
          let stringOp = "";
          let logicalStringOp = {};
          element.querySelectorAll(".parent_class_logic" + a).forEach((parent, i) => {
            parent.querySelectorAll(".lgc_var" + a).forEach((questionValue, z) => {
              if (questionValue.value != '') {
                if (questionValue.value != "+" && element.querySelectorAll(".lg_operator" + a)[i].value != '' && element.querySelectorAll(".lg_value" + a)[i].value != '') {
                  if (questionValue.value != '' && element.querySelectorAll(".lg_operator" + a)[i].value != "" && element.querySelectorAll(".lg_value" + a)[i].value != "") {
                    stringOp += questionValue.value + element.querySelectorAll(".lg_operator" + a)[i].value + coma1 + element.querySelectorAll(".lg_value" + a)[i].value + coma1;
                  } else {
                    error += 1;
                    if (questionValue.value == "") {
                      errorMessage = "Table logic should not be empty";
                    }
                    else if (element.querySelectorAll(".lg_operator" + a)[i].value == "") {
                      errorMessage = "Table logic operator should not be empty";
                    }
                    else if (element.querySelectorAll(".lg_value" + a)[i].value == "") {
                      errorMessage = "Table logic value should not be empty";
                    } else {
                      errorMessage = "Table logic required";
                    }
                  }
                }
                else {
                  if (this.selected_arr[k + a] > 0) {
                    if (this.show_control[k + a + 'len'] > 0) {
                      if (element.querySelectorAll(".lg_options" + a)[i].value != "" && element.querySelectorAll(".lg_subOption" + a)[i].value != "") {
                        stringOp += element.querySelectorAll(".lg_options" + a)[i].value + element.querySelectorAll(".lg_subOption" + a)[i].value;
                      } else {
                        error += 1;
                        if (element.querySelectorAll(".lg_options" + a)[i].value == "") {
                          errorMessage = "Table logic option should not be empty";
                        }
                        else if (element.querySelectorAll(".lg_subOption" + a)[i].value == "") {
                          errorMessage = "Table logic sub option should not be empty";
                        } else {
                          errorMessage = "Table logic required";
                        }
                      }
                    }
                    else {
                      if (element.querySelectorAll(".lg_options" + a)[i].value != "" && element.querySelectorAll(".lg_operator" + a)[i].value != "" && element.querySelectorAll(".lg_value" + a)[i].value != "") {
                        stringOp += element.querySelectorAll(".lg_options" + a)[i].value + element.querySelectorAll(".lg_operator" + a)[i].value + coma1 + element.querySelectorAll(".lg_value" + a)[i].value + coma1;
                      } else {
                        error += 1;
                        if (element.querySelectorAll(".lg_options" + a)[i].value == "") {
                          errorMessage = "Table logic option should not be empty";
                        }
                        else if (element.querySelectorAll(".lg_operator" + a)[i].value == "") {
                          errorMessage = "Table logic operator should not be empty";
                        }
                        else if (element.querySelectorAll(".lg_value" + a)[i].value == "") {
                          errorMessage = "Table logic value should not be empty";
                        } else {
                          errorMessage = "Table logic required";
                        }
                      }
                    }
                  }
                  else {
                    if (element.querySelectorAll(".lg_operator" + a)[i].value != "" && element.querySelectorAll(".lg_value" + a)[i].value != "") {
                      stringOp += element.querySelectorAll(".lg_operator" + a)[i].value + coma1 + element.querySelectorAll(".lg_value" + a)[i].value + coma1;
                    } else {
                      error += 1;
                      if (element.querySelectorAll(".lg_operator" + a)[i].value == "") {
                        errorMessage = "Table logic operator should not be empty";
                      }
                      else if (element.querySelectorAll(".lg_value" + a)[i].value == "") {
                        errorMessage = "Table logic value should not be empty";
                      }
                    }
                  }
                }
              }
              else {
              }
            });
          });

          element.querySelectorAll(".child_class_logic_" + a).forEach((child, j) => {
            child.querySelectorAll(".lg_question_" + a).forEach((questionValue, i) => {
              if (questionValue.value != '') {
                if (questionValue.value != "+") {
                  if (child.querySelectorAll(".and_operator" + a)[i].value != "" && child.querySelectorAll(".lg_op_operator" + a)[i].value != "" && child.querySelectorAll(".lg_op_value" + a)[i].value != "") {
                    stringOp += child.querySelectorAll(".and_operator" + a)[i].value + questionValue.value + child.querySelectorAll(".lg_op_operator" + a)[i].value + coma1 + child.querySelectorAll(".lg_op_value" + a)[i].value + coma1;
                  } else {
                    error += 1;
                    if (questionValue.value == "") {
                      errorMessage = "Table logic should not be empty";
                    }
                    else if (element.querySelectorAll(".and_operator" + a)[i].value == "") {
                      errorMessage = "Table logic operator should not be empty";
                    }
                    else if (element.querySelectorAll(".lg_op_operator" + a)[i].value == "") {
                      errorMessage = "Table logic operator should not be empty";
                    }
                    else if (element.querySelectorAll(".lg_op_value" + a)[i].value == "") {
                      errorMessage = "Table logic value should not be empty";
                    }
                    else {
                      errorMessage = "Table logic required";
                    }
                  }
                }
                else {

                  if (this.selected_arr1[j + '' + k + a] > 0) {
                    if (this.show_control1[j + a + '' + k + 'len'] > 0) {
                      if (child.querySelectorAll(".and_operator" + a)[i].value != "" && child.querySelectorAll(".lg_op_options" + a)[i].value != "" && child.querySelectorAll(".lg_op_subOption" + a)[i].value != "") {
                        stringOp += child.querySelectorAll(".and_operator" + a)[i].value + child.querySelectorAll(".lg_op_options" + a)[i].value + child.querySelectorAll(".lg_op_subOption" + a)[i].value;
                      } else {
                        error += 1;
                        if (element.querySelectorAll(".and_operator" + a)[i].value == "") {
                          errorMessage = "Table logic operator should not be empty";
                        }
                        else if (element.querySelectorAll(".lg_op_subOption" + a)[i].value == "") {
                          errorMessage = "Table logic sub option should not be empty";
                        }
                        else if (element.querySelectorAll(".lg_op_options" + a)[i].value == "") {
                          errorMessage = "Table logic option should not be empty";
                        } else {
                          errorMessage = "Table logic required";
                        }
                      }
                    }
                    else {
                      if (child.querySelectorAll(".and_operator" + a)[i].value != "" && child.querySelectorAll(".lg_op_options" + a)[i].value != "" && child.querySelectorAll(".lg_op_operator" + a)[i].value != "" && child.querySelectorAll(".lg_op_value" + a)[i].value != "") {
                        stringOp += child.querySelectorAll(".and_operator" + a)[i].value + child.querySelectorAll(".lg_op_options" + a)[i].value + child.querySelectorAll(".lg_op_operator" + a)[i].value + coma1 + child.querySelectorAll(".lg_op_value" + a)[i].value + coma1;
                      } else {
                        error += 1;
                        if (element.querySelectorAll(".and_operator" + a)[i].value == "") {
                          errorMessage = "Table logic operator should not be empty";
                        }
                        else if (element.querySelectorAll(".lg_op_options" + a)[i].value == "") {
                          errorMessage = "Table logic options should not be empty";
                        }
                        else if (element.querySelectorAll(".lg_op_value" + a)[i].value == "") {
                          errorMessage = "Table logic value should not be empty";
                        }
                        else if (element.querySelectorAll(".lg_op_operator" + a)[i].value == "") {
                          errorMessage = "Table logic operator should not be empty";
                        }
                        else {
                          errorMessage = "Table logic required";
                        }
                      }
                    }
                  }
                  else {
                    if (child.querySelectorAll(".and_operator" + a)[i].value != "" && child.querySelectorAll(".lg_op_operator" + a)[i].value != "" && child.querySelectorAll(".lg_op_value" + a)[i].value != "") {
                      stringOp += child.querySelectorAll(".and_operator" + a)[i].value + child.querySelectorAll(".lg_op_operator" + a)[i].value + coma1 + child.querySelectorAll(".lg_op_value" + a)[i].value + coma1;
                    } else {
                      if (element.querySelectorAll(".and_operator" + a)[i].value == "" || element.querySelectorAll(".lg_op_operator" + a)[i].value == "") {
                        errorMessage = "Table logic operator should not be empty";
                      }
                      else if (element.querySelectorAll(".lg_op_value" + a)[i].value == "") {
                        errorMessage = "Table logic value should not be empty";
                      }
                      else {
                        errorMessage = "Table logic required";
                      }
                    }
                  }

                }
              } else {
                error += 1;
                errorMessage = "Table logic is required";
              }
            });
          });

          if (error == 0) {
            if (stringOp != "") {
              logicalStringOp["rowLogic"] = stringOp;
              optionLogicArr.push(logicalStringOp);
            }
          }
        });

        if (opText == "") {
          error += 1;
          if (optionLogicArr.length == 0) {
            errorMessage = "Option text is required";
          }
        }
        else {
          duplOptext.push(opText.toLowerCase());
          let makeOp = {
            "active": row.active,
            "id": row.id,
            "optionCode": (a + 1),
            "optionLogic": optionLogicArr,
            "optionText": opText,
            "optionType": "multiple-select",
            "seq": (a + 1),
          }
          roOptions.push(makeOp);
        }
      });
    }
    else {
      if (this.addCustomArr.length > 50) {
        error += 1;
        errorMessage = "Max 50 rows can be created";
      }
    }

    // Table logic
    this.el.nativeElement.querySelectorAll("div.logical").forEach((element, k) => {
      let stringOp = "";
      let logicalStringOp = {};
      element.querySelectorAll(".parent-class-logic").forEach((parent, i) => {
        parent.querySelectorAll(".question").forEach((questionValue, z) => {
          if (questionValue.value != '') {
            if (questionValue.value != "+" && element.querySelectorAll(".operator")[i].value != '' && element.querySelectorAll(".value")[i].value != '') {
              if (questionValue.value != '' && element.querySelectorAll(".operator")[i].value != "" && element.querySelectorAll(".value")[i].value != "") {
                stringOp += questionValue.value + element.querySelectorAll(".operator")[i].value + coma1 + element.querySelectorAll(".value")[i].value + coma1;
              } else {
                error += 1;
                if (questionValue.value == "") {
                  errorMessage = "Table logic should not be empty";
                }
                else if (element.querySelectorAll(".operator")[i].value == "") {
                  errorMessage = "Table logic operator should not be empty";
                }
                else if (element.querySelectorAll(".value")[i].value == "") {
                  errorMessage = "Table logic value should not be empty";
                } else {
                  errorMessage = "Table logic required";
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
                      errorMessage = "Table logic option should not be empty";
                    }
                    else if (element.querySelectorAll(".subOption")[i].value == "") {
                      errorMessage = "Table logic sub option should not be empty";
                    } else {
                      errorMessage = "Table logic required";
                    }
                  }
                }
                else {
                  if (element.querySelectorAll(".options")[i].value != "" && element.querySelectorAll(".operator")[i].value != "" && element.querySelectorAll(".value")[i].value != "") {
                    stringOp += element.querySelectorAll(".options")[i].value + element.querySelectorAll(".operator")[i].value + coma1 + element.querySelectorAll(".value")[i].value + coma1;
                  } else {
                    error += 1;
                    if (element.querySelectorAll(".options")[i].value == "") {
                      errorMessage = "Table logic option should not be empty";
                    }
                    else if (element.querySelectorAll(".operator")[i].value == "") {
                      errorMessage = "Table logic operator should not be empty";
                    }
                    else if (element.querySelectorAll(".value")[i].value == "") {
                      errorMessage = "Table logic value should not be empty";
                    } else {
                      errorMessage = "Table logic required";
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
                    errorMessage = "Table logic operator should not be empty";
                  }
                  else if (element.querySelectorAll(".value")[i].value == "") {
                    errorMessage = "Table logic value should not be empty";
                  }
                }
              }
            }
          }
          else {
          }
        });
      });

      element.querySelectorAll(".child-class-logic").forEach((child, j) => {
        child.querySelectorAll(".question").forEach((questionValue, i) => {
          if (questionValue.value != '') {
            if (questionValue.value != "+") {
              if (child.querySelectorAll(".andoroperator")[i].value != "" && child.querySelectorAll(".operator")[i].value != "" && child.querySelectorAll(".value")[i].value != "") {
                stringOp += child.querySelectorAll(".andoroperator")[i].value + questionValue.value + child.querySelectorAll(".operator")[i].value + coma1 + child.querySelectorAll(".value")[i].value + coma1;
              } else {
                error += 1;
                if (questionValue.value == "") {
                  errorMessage = "Table logic should not be empty";
                }
                else if (element.querySelectorAll(".andoroperator")[i].value == "") {
                  errorMessage = "Table logic operator should not be empty";
                }
                else if (element.querySelectorAll(".operator")[i].value == "") {
                  errorMessage = "Table logic operator should not be empty";
                }
                else if (element.querySelectorAll(".value")[i].value == "") {
                  errorMessage = "Table logic value should not be empty";
                }
                else {
                  errorMessage = "Table logic required";
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
                      errorMessage = "Table logic operator should not be empty";
                    }
                    else if (element.querySelectorAll(".subOption")[i].value == "") {
                      errorMessage = "Table logic sub option should not be empty";
                    }
                    else if (element.querySelectorAll(".options")[i].value == "") {
                      errorMessage = "Table logic option should not be empty";
                    } else {
                      errorMessage = "Table logic required";
                    }
                  }
                }
                else {
                  if (child.querySelectorAll(".andoroperator")[i].value != "" && child.querySelectorAll(".options")[i].value != "" && child.querySelectorAll(".operator")[i].value != "" && child.querySelectorAll(".value")[i].value != "") {
                    stringOp += child.querySelectorAll(".andoroperator")[i].value + child.querySelectorAll(".options")[i].value + child.querySelectorAll(".operator")[i].value + coma1 + child.querySelectorAll(".value")[i].value + coma1;
                  } else {
                    error += 1;
                    if (element.querySelectorAll(".andoroperator")[i].value == "") {
                      errorMessage = "Table logic operator should not be empty";
                    }
                    else if (element.querySelectorAll(".options")[i].value == "") {
                      errorMessage = "Table logic options should not be empty";
                    }
                    else if (element.querySelectorAll(".value")[i].value == "") {
                      errorMessage = "Table logic value should not be empty";
                    }
                    else if (element.querySelectorAll(".operator")[i].value == "") {
                      errorMessage = "Table logic operator should not be empty";
                    }
                    else {
                      errorMessage = "Table logic required";
                    }
                  }
                }
              }
              else {
                if (child.querySelectorAll(".andoroperator")[i].value != "" && child.querySelectorAll(".operator")[i].value != "" && child.querySelectorAll(".value")[i].value != "") {
                  stringOp += child.querySelectorAll(".andoroperator")[i].value + child.querySelectorAll(".operator")[i].value + coma1 + child.querySelectorAll(".value")[i].value + coma1;
                } else {
                  if (element.querySelectorAll(".andoroperator")[i].value == "" || element.querySelectorAll(".operator")[i].value == "") {
                    errorMessage = "Table logic operator should not be empty";
                  }
                  else if (element.querySelectorAll(".value")[i].value == "") {
                    errorMessage = "Table logic value should not be empty";
                  }
                  else {
                    errorMessage = "Table logic required";
                  }
                }
              }

            }
          } else {
            error += 1;
            errorMessage = "Table logic is required";
          }
        });
      });

      if (error == 0) {
        if (stringOp != "") {
          logicalStringOp["pointLogic"] = stringOp;
          logicalArray.push(logicalStringOp);
        }
      }
    });

    let seen = duplOptext.filter((s => v => s.has(v) || !s.add(v))(new Set));

    if (seen.length > 0) {
      error += 1;
      errorMessage = "Option text should be unique";
    }

    let tableLabel = this.el.nativeElement.querySelector("#q_label").value.trim();
    let q_table_text = this.el.nativeElement.querySelector("#q_table_Text").value.trim();
    if (tableLabel == "") {
      error += 1;
      errorMessage = "Question label is required.";
    }
    if (q_table_text == "") {
      error += 1;
      errorMessage = "Question text is required.";
    }

    if (error == 0) {
      this.loaderService.show();
      let saveJson = {
        "studyID": this.masterData['urlStudyId'],
        "bannerID": this.masterData['bannerInfo']['bannerID'],
        "description": q_table_text,
        "title": tableLabel,
        "qType": "single-select",
        "rowOptionList": roOptions,
        "logic": logicalArray
      }
      this.httpService.callApi('customTableAdd', { body: saveJson }).subscribe((response) => {
        let viewResp = response["header"]["code"];
        if (viewResp == 200) {
          this.systemSr.clearCrosstabTable();
          this.apiCounter = 0;
          this.progress = 0;
          this.ngOnInit();
          this.closeSetModal('addModal');
          this.toastr.success(tableLabel + " table added successfully", '');
          this.loaderService.hide();
        }
      });
    }
    else {
      this.toastr.error(errorMessage, '');
    }
  }

  resetOpLogic(i, a) {
    this.el.nativeElement.querySelector("#cond" + i + a).value = '';
    if (this.selected_arr[i + a] > 0) {
      this.el.nativeElement.querySelector("#operator" + i + a).value = '';
    }
    if (this.show_control[i + a + 'len'] == 0 || this.selected_arr[i + a] == 0) {
      this.el.nativeElement.querySelector("#andOper" + i + a).value = '';
    }
    if (this.show_control[i + a + 'len'] > 0 && this.selected_arr[i + a] > 0) {
      this.el.nativeElement.querySelector("#options" + i + a).value = '';
    }
    if (this.show_control[i + a + 'len'] == 0 || this.selected_arr[i + a] == '') {
      this.el.nativeElement.querySelector("#invalue" + i + a).value = '';
    }
  }

  resetopAnd(j, i, a) {
    this.el.nativeElement.querySelector("#andor" + j + i + a).value = ' AND ';
    this.el.nativeElement.querySelector("#varand" + j + i + a).value = '';
    if (this.selected_arr1[j + '' + i + a]) {
      this.el.nativeElement.querySelector("#v" + j + i + a).value = '';
    }
    if (this.show_control1[j + a + '' + i + 'len'] == 0 || this.selected_arr1[j + '' + i + a] == '') {
      this.el.nativeElement.querySelector("#andOper" + j + i + a).value = '';
    }
    if (this.show_control1[j + a + '' + i + 'len'] > 0) {
      this.el.nativeElement.querySelector("#op" + j + i + a).value = '';
    }
    if (this.show_control1[j + a + '' + i + 'len'] == 0 || this.selected_arr1[j + '' + i + a] == '') {
      this.el.nativeElement.querySelector("#invalue" + j + i + a).value = '';
    }
  }

  sanitizeText(text) {
    let textSanitized: SafeHtml = this.sanitizer.bypassSecurityTrustHtml(text);
    return textSanitized;
  }
}
