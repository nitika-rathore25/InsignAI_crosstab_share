import { Component, OnInit, ElementRef, OnChanges, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoaderService } from '../../service/loader.service';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../service/http.service';
import { SystemService } from '../../service/system.service';

@Component({
  selector: 'app-edit-banner',
  templateUrl: './edit-banner.component.html',
  styleUrls: ['./edit-banner.component.css']
})
export class EditBannerComponent implements OnChanges {
  @Input()
  change: any;
  viewAllData: any;
  masterData: any;
  display = "none";
  segmentForm: FormGroup;
  segment_arr: FormArray;
  submitted: boolean = false;
  optsList: any;
  selectedArrG: {};
  selectedArrOptions: {};
  selectedOptions: {};
  selectedArrG1: {};
  selectedOptions1: {};
  addLogicArr = {};
  tierIndex: any;
  logicLists: any;
  logicConditions: any;
  logicOperators: any;
  logicVars: any;
  addGrpM: boolean = false;
  confirmModal: boolean = false;
  selectedArrOptions1 = {};
  optsList1: any;
  grpname_arr = [];
  bannerPointList = [];
  allBannerPoint = {};
  showControls = {};
  rmIndex: any;
  rmName: any;
  savedGroup = {};
  visible: number = 0;
  @Output()
  out = new EventEmitter();


  constructor(private fb: FormBuilder, public systemSr: SystemService, private el: ElementRef, private router: Router, private httpService: HttpService, private loaderService: LoaderService, private toastr: ToastrService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['change']) {
      this.init();
    }

  }

  init() {
    this.masterData = this.systemSr.getLocalStorage();
    this.segmentForm = this.fb.group({
      segmentItems: this.fb.array([])
    });
    if (this.masterData["bannerInfo"]["bannerID"]) {
      this.loaderService.show();
      let bannerJsn = {
        "studyID": this.masterData['urlStudyId'],
        "bannerID": this.masterData["bannerInfo"]["bannerID"]
      }
      this.httpService.callApi('bannerPointList', { body: bannerJsn }).subscribe((response) => {
        let viewResp = response["header"]["code"];
        if (viewResp == 200) {
          this.bannerPointList = response["response"];
          if (this.masterData["seg_group_names"]) {
            let grpData = [];
            this.grpname_arr = [];
            this.masterData["seg_group_names"].forEach(grp => {
              grpData.push(grp);
            });
            this.grpname_arr = [...new Set(grpData)];
          }
        }
      });

      let studyJsonSet = {
        "switchKey": this.masterData['token'],
        "studyID": this.masterData['urlStudyId']
      }
      this.httpService.callApi('studyInfo', { body: studyJsonSet }).subscribe((response) => {
        let viewResp = response["header"]["code"];
        if (viewResp == 200) {
          this.viewAllData = response["response"];
          this.editLogicCondition();
        }
      });
    }
    else {
      this.systemSr.internalNavigate();
    }
  }

  get f() { return this.segmentForm.controls; }

  get t() { return this.f.segmentItems as FormArray; }

  private randomPassValue(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  createSegmentForm(): FormGroup {
    this.segment_arr = this.segmentForm.get('segmentItems') as FormArray;
    let randNum1 = Math.floor(Math.random() * 8) + 3;
    let banName = 'Banner point ' + (this.segment_arr["value"].length + 1);

    return this.fb.group({
      segmentname: banName,
      segmentGroup: '',
      logicItems: this.fb.array([
        this.fb.group({
          logicId: this.randomPassValue(randNum1),
          logicName: "",
          options: this.fb.array([])
        })
      ])
    });
  }

  editLogicCondition() {
    this.optsList = [];
    this.selectedArrG = {};
    this.selectedArrOptions = {};
    this.selectedOptions = {};
    this.selectedOptions = {};
    this.selectedArrG1 = {};
    this.selectedOptions1 = {};
    this.addLogicArr = {};
    let getQuestionsJson = {
      "studyID": this.masterData['urlStudyId'],
    }
    this.httpService.callApi('crossVars', { body: getQuestionsJson }).subscribe((response) => {
      let getQuesResp = response["header"]["code"];
      if (getQuesResp == 200) {
        this.logicLists = response["response"];
        this.logicConditions = response["response"]["condition"];
        this.logicOperators = response["response"]["operators"];
        this.logicVars = response["response"]["variables"];

        if (this.bannerPointList.length > 0) {
          let grpData = [];
          this.savedGroup = {};
          this.bannerPointList.forEach(bannerPoint => {
            this.allBannerPoint[bannerPoint.title] = bannerPoint.title;
            this.segment_arr = this.segmentForm.get('segmentItems') as FormArray;
            if (Object.keys(this.savedGroup).indexOf(bannerPoint.bannerGroup.toLowerCase()) < 0 && bannerPoint.bannerGroup != '') {
              this.savedGroup[bannerPoint.bannerGroup.toLowerCase()] = [];
            }

            if (bannerPoint.bannerGroup) {
              this.savedGroup[bannerPoint.bannerGroup.toLowerCase()].push(bannerPoint.title);
              grpData.push(bannerPoint.bannerGroup.toLowerCase());
            }

            let randNum1 = Math.floor(Math.random() * 8) + 3;
            this.segment_arr.push(
              this.fb.group({
                segmentname: bannerPoint.title,
                segmentGroup: bannerPoint.bannerGroup.toLowerCase(),
                logicItems: this.fb.array([
                  this.fb.group({
                    logicId: this.randomPassValue(randNum1),
                    logicName: "",
                    options: this.fb.array([])
                  })
                ])
              })
            );
          });
          this.grpname_arr = [...new Set(grpData)];
          delete this.masterData["seg_group_names"];
          this.masterData["seg_group_names"] = this.grpname_arr;
          this.systemSr.setLocalStorage(this.masterData);
        }
        else {
          this.segmentForm = this.fb.group({
            segmentItems: this.fb.array([this.createSegmentForm()])
          });
        }
        this.loaderService.hide();
      }
    });
  }

  getGroupDetails() {
    this.savedGroup = {};
    this.segmentForm.value.segmentItems.forEach(bannerPoint => {
      if (Object.keys(this.savedGroup).indexOf(bannerPoint.segmentGroup.toLowerCase()) < 0 && bannerPoint.segmentGroup.toLowerCase() != '') {
        this.savedGroup[bannerPoint.segmentGroup.toLowerCase()] = [];
      }
      if (bannerPoint.segmentGroup.toLowerCase()) {
        this.savedGroup[bannerPoint.segmentGroup.toLowerCase()].push(bannerPoint.segmentname);
      }
    });
  }

  addItem() {
    this.segment_arr = this.segmentForm.get('segmentItems') as FormArray;
    this.segment_arr["value"].forEach((element, i) => {
      if ((this.segment_arr["value"].length + 1) != i) {
        this.el.nativeElement.querySelector("#seg_" + i).classList.remove("active");
        this.el.nativeElement.querySelector(".seg_act" + i).classList.remove("active");
      }
    });
    setTimeout(() => {
      this.segment_arr.push(this.createSegmentForm());
      this.segment_arr = this.segmentForm.get('segmentItems') as FormArray;
    }, 100);
  }

  addGrpModal(type) {
    this.display = "block";
    if (type == "addGrpM") {
      this.addGrpM = true;
    }
  }

  closeGrpModal() {
    this.display = "none";
    this.addGrpM = false;
  }

  addConfirm(type, i, item) {
    this.display = "block";
    this.rmIndex = i;
    this.rmName = item.value.segmentname;
    if (type == "confirm") {
      this.confirmModal = true;
    }
  }

  closeConfirmModal() {
    this.display = "none";
    this.confirmModal = false;
  }

  getUniqueVal() {
    let groupName = this.el.nativeElement.querySelector("#grp_name").value.trim();
    let duplicates = [];
    let grp_dupl_arr = [];
    if (this.masterData["seg_group_names"]) {
      this.masterData["seg_group_names"].forEach(name => {
        let grp = name.toLowerCase();
        grp_dupl_arr.push(grp);
      });
    }
    grp_dupl_arr.push(groupName.toLowerCase());
    let uniq = grp_dupl_arr.map((name) => {
      return {
        count: 1,
        name: name
      }
    }).reduce((a, b) => {
      a[b.name] = (a[b.name] || 0) + b.count
      return a
    }, {});
    duplicates = Object.keys(uniq).filter((a) => uniq[a] > 1);
    return duplicates;
  }

  addGroupToSegment() {
    let groupName = this.el.nativeElement.querySelector("#grp_name").value.trim();
    if (groupName != "") {
      if (this.getUniqueVal().length > 0) {
        this.toastr.error(groupName + " already exist", '');
      }
      else {
        this.grpname_arr = [];
        if (this.masterData["seg_group_names"]) {
          this.masterData["seg_group_names"].forEach(grp => {
            let name = grp.toLowerCase();
            this.grpname_arr.push(name)
          });
        }
        this.grpname_arr.push(groupName.toLowerCase());
        delete this.masterData["seg_group_names"];
        this.masterData["seg_group_names"] = this.grpname_arr;
        this.systemSr.setLocalStorage(this.masterData);
        this.closeGrpModal();
        this.toastr.success(groupName + " group added successfully", '');
      }
    }
    else {
      this.toastr.error("Group name is required.", '');
    }
  }

  removeSegment(index, item) {
    // let confirm = this.el.nativeElement.querySelector("#rm_b_point").value.trim();
    // let lw = confirm.toLowerCase();
    // if(lw == "delete"){
    if (this.bannerPointList[index]) {
      this.bannerPointList.splice(index, 1);
    }
    this.segment_arr = this.segmentForm.get('segmentItems') as FormArray;
    this.segment_arr.removeAt(index);
    delete this.allBannerPoint[item.value.segmentname];

    this.savedGroup = {};
    this.segmentForm.value.segmentItems.forEach(bannerPoint => {
      if (Object.keys(this.savedGroup).indexOf(bannerPoint.segmentGroup.toLowerCase()) < 0 && bannerPoint.segmentGroup.toLowerCase() != '') {
        this.savedGroup[bannerPoint.segmentGroup.toLowerCase()] = [];
      }
      if (bannerPoint.segmentGroup.toLowerCase()) {
        this.savedGroup[bannerPoint.segmentGroup.toLowerCase()].push(bannerPoint.segmentname);
      }
    });

    // let id = (this.segment_arr["value"].length -1);
    // this.el.nativeElement.querySelector(".seg_tab_act"+index).classList.remove("active");
    // this.el.nativeElement.querySelector(".seg_tab_act"+id).classList.add("active");
    // this.el.nativeElement.querySelector(".seg_act"+index).classList.remove("active");
    // this.el.nativeElement.querySelector(".seg_act"+id).classList.add("active");
    this.closeConfirmModal();
    // } else {
    //   this.toastr.error("Please type delete in the box.", '');
    // }
  }

  navigateUrl(url) {
    this.router.navigate([url]);
  }

  // Add logic form
  addLogicCondition(i) {
    if (this.segmentForm.value.segmentItems[i].logicItems.length < 50) {
      let randNum1 = Math.floor(Math.random() * 8) + 3;
      this.segmentForm.value.segmentItems[i].logicItems.push({
        logicId: this.randomPassValue(randNum1),
        logicName: "",
        options: []
      })
    }
    else {
      this.toastr.warning("Only 50 logics can be created", '');
    }
  }

  // Add options inside logic form
  addAndOrLogic(m, i) {
    if (this.segmentForm.value.segmentItems[i].logicItems[m].options.length < 50) {
      let randNum1 = Math.floor(Math.random() * 8) + 3;
      this.segmentForm.value.segmentItems[i].logicItems[m].options.push({
        optionText: "",
        optionId: this.randomPassValue(randNum1),
      })
    }
    else {
      this.toastr.warning("Only 50 condition can be created", '');
    }
  }

  // delete logic
  removeLogicCond(indexpos, i) {
    this.segmentForm.value.segmentItems[i].logicItems.splice(indexpos, 1);
  }

  // Delete options in form
  removeAndOrLogic(m, indexpos, i) {
    this.segmentForm.value.segmentItems[i].logicItems[m].options.splice(indexpos, 1);
  }

  selectedValue(event, rw) {
    let parms = event.target.selectedOptions[0].ariaLabel;
    this.optsList = [];
    this.showControls = {};
    this.showControls[rw.logicId] = rw.logicId;
    this.selectedArrG['form' + rw.logicId] = 0;
    this.selectedArrOptions['form' + rw.logicId] = [];
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
          this.selectedArrG['form' + rw.logicId] = responseData.length;
          this.selectedArrOptions['form' + rw.logicId] = responseData;
          this.loaderService.hide();
        }
      });
    } else {
      this.optsList = '';
      this.selectedArrG['form' + rw.logicId] = '';
      this.selectedArrOptions['form' + rw.logicId] = '';
    }
  }

  selectedValueOptions(eve, rw) {
    let ind = (eve.target.selectedIndex - 1);
    let currentValue = this.optsList[ind];
    this.selectedOptions[rw.logicId] = currentValue.options;
    this.selectedOptions["len" + rw.logicId] = currentValue.options.length;
    this.selectedOptions["option" + rw.logicId] = currentValue.options;
  }

  selectedAdditionalValue(event, and) {
    let parms = event.target.selectedOptions[0].ariaLabel;
    this.optsList1 = [];
    this.selectedArrG1["option" + and.optionId] = 0;
    this.selectedArrOptions1["option" + and.optionId] = [];
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
          this.optsList1 = responseData;
          this.selectedArrG1["option" + and.optionId] = responseData.length;
          this.selectedArrOptions1["option" + and.optionId] = responseData;
          this.loaderService.hide();
        }
      });
    } else {
      this.selectedArrG1["option" + and.optionId] = '';
      this.selectedArrOptions1["option" + and.optionId] = '';
      this.optsList1 = '';
    }
  }

  selectedAdditionalOptions(eve, and) {
    let ind = (eve.target.selectedIndex - 1);
    let currentValue = this.optsList[ind];
    this.selectedOptions1["formInd" + and.optionId] = currentValue.options;
    this.selectedOptions1["len" + and.optionId] = currentValue.options.length;
    this.selectedOptions1["option" + and.optionId] = currentValue.options;
  }

  resetLogicAnd(j, and) {
    this.el.nativeElement.querySelector("#andor" + j + and.optionId).value = ' AND ';
    this.el.nativeElement.querySelector("#varand" + j + and.optionId).value = '';
    if (this.selectedArrG1['option' + and.optionId]) {
      this.el.nativeElement.querySelector("#v" + j + and.optionId).value = '';
    }
    if (this.selectedOptions1['len' + and.optionId] == 0 || this.selectedArrG1['option' + and.optionId] == '') {
      this.el.nativeElement.querySelector("#andOper" + j + and.optionId).value = '';
    }
    if (this.selectedOptions1['len' + and.optionId] > 0) {
      this.el.nativeElement.querySelector("#op" + j + and.optionId).value = '';
    }
    if (this.selectedOptions1['len' + and.optionId] == 0 || this.selectedArrG1['option' + and.optionId] == '') {
      this.el.nativeElement.querySelector("#invalue" + j + and.optionId).value = '';
    }
  }

  resetLogic(m, rw) {
    this.el.nativeElement.querySelector("#cond" + m + rw.logicId).value = '';
    if (this.selectedArrG['form' + rw.logicId] > 0) {
      this.el.nativeElement.querySelector("#operator" + m + rw.logicId).value = '';
    }
    if (this.selectedOptions['len' + rw.logicId] == 0 || this.selectedArrG['form' + rw.logicId] == 0) {
      this.el.nativeElement.querySelector("#andOper" + m + rw.logicId).value = '';
    }
    if (this.selectedOptions['len' + rw.logicId] > 0 && this.selectedArrG['form' + rw.logicId] > 0) {
      this.el.nativeElement.querySelector("#options" + m + rw.logicId).value = '';
    }
    if (this.selectedOptions['len' + rw.logicId] == 0 || this.selectedArrG['form' + rw.logicId] == '') {
      this.el.nativeElement.querySelector("#invalue" + m + rw.logicId).value = '';
    }
  }

  removeExistLogic(index, i) {
    this.bannerPointList[i]["logic"].splice(index, 1);
  }

  saveBannerPointAll() {
    let allForm = this.segmentForm.get('segmentItems')['controls'];
    let error = 0;
    let allSegment = [];
    let errorMsg = "";

    let findUnique = [];
    let grp_dupl_arr = [];
    allForm.forEach((row) => {
      grp_dupl_arr.push(row.value.segmentname.toLowerCase());
    });

    let uniq = grp_dupl_arr.map((name) => {
      return {
        count: 1,
        name: name
      }
    }).reduce((a, b) => {
      a[b.name] = (a[b.name] || 0) + b.count
      return a
    }, {});
    findUnique = Object.keys(uniq).filter((a) => uniq[a] > 1);

    if (findUnique.length == 0) {
      allForm.forEach((form, a) => {
        let coma1 = "'";
        let logicalArray = [];
        if (form.value.logicItems.length > 0) {
          form.value.logicItems.forEach((row, k) => {
            let logicalStringOp = {};
            let stringOp = "";
            let variableVal = this.el.nativeElement.querySelector(".question_" + row.logicId).value;
            if (variableVal != '') {
              if (variableVal != "+" && this.el.nativeElement.querySelector(".operator_" + row.logicId).value != '' && this.el.nativeElement.querySelector(".value_" + row.logicId).value != '') {
                if (variableVal != '' && this.el.nativeElement.querySelector(".operator_" + row.logicId).value != "" && this.el.nativeElement.querySelector(".value_" + row.logicId).value != "") {
                  stringOp += variableVal + this.el.nativeElement.querySelector(".operator_" + row.logicId).value + coma1 + this.el.nativeElement.querySelector(".value_" + row.logicId).value + coma1;
                  this.el.nativeElement.querySelector(".question_" + row.logicId).classList.remove("br_error");
                  this.el.nativeElement.querySelector(".operator_" + row.logicId).classList.remove("br_error");
                  this.el.nativeElement.querySelector(".value_" + row.logicId).classList.remove("br_error");
                }
                else {
                  error += 1;
                  if (variableVal == "") {
                    this.el.nativeElement.querySelector(".question_" + row.logicId).classList.add("br_error");
                    errorMsg = "Banner point logic should not be empty";
                  }
                  else if (this.el.nativeElement.querySelector(".operator_" + row.logicId).value == "") {
                    this.el.nativeElement.querySelector(".operator_" + row.logicId).classList.add("br_error");
                    errorMsg = "Banner point logic operator should not be empty";
                  }
                  else if (this.el.nativeElement.querySelector(".value_" + row.logicId).value == "") {
                    this.el.nativeElement.querySelector(".value_" + row.logicId).classList.add("br_error");
                    errorMsg = "Banner point logic value should not be empty";
                  } else if (this.bannerPointList[a]) {
                    if (this.bannerPointList[a]["logic"].length > 0) {

                    }
                    else {
                      error += 1;
                      errorMsg = "Banner point logic is required";
                    }
                  }
                }
              }
              else {
                if (this.selectedArrG['form' + row.logicId] > 0) {
                  if (this.selectedOptions['len' + row.logicId] > 0) {
                    if (this.el.nativeElement.querySelector(".options_" + row.logicId).value != "" && this.el.nativeElement.querySelector(".subOption_" + row.logicId).value != "") {
                      stringOp += this.el.nativeElement.querySelector(".options_" + row.logicId).value + this.el.nativeElement.querySelector(".subOption_" + row.logicId).value;
                      this.el.nativeElement.querySelector(".options_" + row.logicId).classList.remove("br_error");
                      this.el.nativeElement.querySelector(".subOption_" + row.logicId).classList.remove("br_error");
                    }
                    else {
                      error += 1;
                      if (this.el.nativeElement.querySelector(".options_" + row.logicId).value == "") {
                        this.el.nativeElement.querySelector(".options_" + row.logicId).classList.add("br_error");
                        errorMsg = "Banner point logic option should not be empty";
                      }
                      else if (this.el.nativeElement.querySelector(".subOption_" + row.logicId).value == "") {
                        this.el.nativeElement.querySelector(".subOption_" + row.logicId).classList.add("br_error");
                        errorMsg = "Banner point logic sub option should not be empty";
                      }
                      else if (this.bannerPointList[a]) {
                        if (this.bannerPointList[a]["logic"].length > 0) {

                        }
                        else {
                          error += 1;
                          errorMsg = "Banner point logic is required";
                        }
                      }
                    }
                  }
                  else {
                    if (this.el.nativeElement.querySelector(".options_" + row.logicId).value != "" && this.el.nativeElement.querySelector(".operator_" + row.logicId).value != "" && this.el.nativeElement.querySelector(".value_" + row.logicId).value != "") {
                      stringOp += this.el.nativeElement.querySelector(".options_" + row.logicId).value + this.el.nativeElement.querySelector(".operator_" + row.logicId).value + coma1 + this.el.nativeElement.querySelector(".value_" + row.logicId).value + coma1;
                      this.el.nativeElement.querySelector(".options_" + row.logicId).classList.remove("br_error");
                      this.el.nativeElement.querySelector(".operator_" + row.logicId).classList.remove("br_error");
                      this.el.nativeElement.querySelector(".value_" + row.logicId).classList.remove("br_error");
                    }
                    else {
                      error += 1;
                      if (this.el.nativeElement.querySelector(".options_" + row.logicId).value == "") {
                        this.el.nativeElement.querySelector(".options_" + row.logicId).classList.add("br_error");
                        errorMsg = "Banner point logic option should not be empty";
                      }
                      else if (this.el.nativeElement.querySelector(".operator_" + row.logicId).value == "") {
                        this.el.nativeElement.querySelector(".operator_" + row.logicId).classList.add("br_error");
                        errorMsg = "Banner point logic operator should not be empty";
                      }
                      else if (this.el.nativeElement.querySelector(".value_" + row.logicId).value == "") {
                        this.el.nativeElement.querySelector(".value_" + row.logicId).classList.add("br_error");
                        errorMsg = "Banner point logic value should not be empty";
                      } else if (this.bannerPointList[a]) {
                        if (this.bannerPointList[a]["logic"].length > 0) {

                        }
                        else {
                          error += 1;
                          errorMsg = "Banner point logic is required";
                        }
                      }
                    }
                  }
                }
                else {
                  if (this.el.nativeElement.querySelector(".operator_" + row.logicId).value != "" && this.el.nativeElement.querySelector(".value_" + row.logicId).value != "") {
                    stringOp += this.el.nativeElement.querySelector(".operator_" + row.logicId).value + coma1 + this.el.nativeElement.querySelector(".value_" + row.logicId).value + coma1;
                    this.el.nativeElement.querySelector(".value_" + row.logicId).classList.remove("br_error");
                    this.el.nativeElement.querySelector(".operator_" + row.logicId).classList.remove("br_error");
                  } else {
                    error += 1;
                    if (this.el.nativeElement.querySelector(".operator_" + row.logicId).value == "") {
                      this.el.nativeElement.querySelector(".operator_" + row.logicId).classList.add("br_error");
                      errorMsg = "Banner point logic operator should not be empty";
                    }
                    else if (this.el.nativeElement.querySelector(".value_" + row.logicId).value == "") {
                      this.el.nativeElement.querySelector(".value_" + row.logicId).classList.add("br_error");
                      errorMsg = "Banner point logic value should not be empty";
                    }
                  }
                }
              }
            }
            else {
              if (this.bannerPointList[a]) {
                if (this.bannerPointList[a]["logic"].length > 0) {

                }
                else {
                  error += 1;
                  errorMsg = "Banner point logic is required";
                }
              } else {
                error += 1;
                errorMsg = "Banner point logic is required";
              }
            }

            if (form.value.logicItems[k].options.length > 0) {
              form.value.logicItems[k].options.forEach(and => {
                let optionVar = this.el.nativeElement.querySelector(".question_" + and.optionId).value;
                if (optionVar != '') {
                  if (optionVar != "+") {
                    if (this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).value != "" && this.el.nativeElement.querySelector(".operator_" + and.optionId).value != "" && this.el.nativeElement.querySelector(".value_" + and.optionId).value != "") {
                      stringOp += this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).value + optionVar + this.el.nativeElement.querySelector(".operator_" + and.optionId).value + coma1 + this.el.nativeElement.querySelector(".value_" + and.optionId).value + coma1;
                      this.el.nativeElement.querySelector(".value_" + and.optionId).classList.remove("br_error");
                      this.el.nativeElement.querySelector(".operator_" + and.optionId).classList.remove("br_error");
                      this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).classList.remove("br_error");
                    }
                    else {
                      error += 1;
                      if (this.el.nativeElement.querySelector(".question_" + and.optionId).value == "") {
                        errorMsg = "Banner point logic variable should not be empty";
                        this.el.nativeElement.querySelector(".question_" + and.optionId).classList.add("br_error");
                      }
                      else if (this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).value == "") {
                        errorMsg = "Banner point logic operator should not be empty";
                        this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).classList.add("br_error");
                      }
                      else if (this.el.nativeElement.querySelector(".operator_" + and.optionId).value == "") {
                        this.el.nativeElement.querySelector(".operator_" + and.optionId).classList.add("br_error");
                        errorMsg = "Banner point logic operator should not be empty";
                      }
                      else if (this.el.nativeElement.querySelector(".value_" + and.optionId).value == "") {
                        this.el.nativeElement.querySelector(".value_" + and.optionId).classList.add("br_error");
                        errorMsg = "Banner point logic value should not be empty";
                      }
                      else {
                        errorMsg = "Banner point logic required";
                      }
                    }
                  }
                  else {
                    if (this.selectedArrG1['option' + and.optionId] > 0) {
                      if (this.selectedOptions1['len' + and.optionId] > 0) {
                        if (this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).value != "" && this.el.nativeElement.querySelector(".options_" + and.optionId).value != "" && this.el.nativeElement.querySelector(".subOption_" + and.optionId).value != "") {
                          stringOp += this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).value + this.el.nativeElement.querySelector(".options_" + and.optionId).value + this.el.nativeElement.querySelector(".subOption_" + and.optionId).value;
                          this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).classList.remove("br_error");
                          this.el.nativeElement.querySelector(".subOption_" + and.optionId).classList.remove("br_error");
                          this.el.nativeElement.querySelector(".options_" + and.optionId).classList.remove("br_error");
                        } else {
                          error += 1;
                          if (this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).value == "") {
                            this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).classList.add("br_error");
                            errorMsg = "Banner point logic operator should not be empty";
                          }
                          else if (this.el.nativeElement.querySelector(".subOption_" + and.optionId).value == "") {
                            this.el.nativeElement.querySelector(".subOption_" + and.optionId).classList.add("br_error");
                            errorMsg = "Banner point logic sub option should not be empty";
                          }
                          else if (this.el.nativeElement.querySelector(".options_" + and.optionId).value == "") {
                            this.el.nativeElement.querySelector(".options_" + and.optionId).classList.add("br_error");
                            errorMsg = "Banner point logic option should not be empty";
                          }
                          else {
                            errorMsg = "Banner point logic required";
                          }
                        }
                      }
                      else {
                        if (this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).value != "" && this.el.nativeElement.querySelector(".options_" + and.optionId).value != "" && this.el.nativeElement.querySelector(".operator_" + and.optionId).value != "" && this.el.nativeElement.querySelector(".value_" + and.optionId).value != "") {
                          stringOp += this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).value + this.el.nativeElement.querySelector(".options_" + and.optionId).value + this.el.nativeElement.querySelector(".operator_" + and.optionId).value + coma1 + this.el.nativeElement.querySelector(".value_" + and.optionId).value + coma1;
                          this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).classList.remove("br_error");
                          this.el.nativeElement.querySelector(".operator_" + and.optionId).classList.remove("br_error");
                          this.el.nativeElement.querySelector(".options_" + and.optionId).classList.remove("br_error");
                          this.el.nativeElement.querySelector(".value_" + and.optionId).classList.remove("br_error");
                        } else {
                          error += 1;
                          if (this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).value == "") {
                            this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).classList.add("br_error");
                            errorMsg = "Banner point logic operator should not be empty";
                          }
                          else if (this.el.nativeElement.querySelector(".options_" + and.optionId).value == "") {
                            this.el.nativeElement.querySelector(".options_" + and.optionId).classList.add("br_error");
                            errorMsg = "Banner point logic options should not be empty";
                          }
                          else if (this.el.nativeElement.querySelector(".value_" + and.optionId).value == "") {
                            this.el.nativeElement.querySelector(".value_" + and.optionId).classList.add("br_error");
                            errorMsg = "Banner point logic value should not be empty";
                          }
                          else if (this.el.nativeElement.querySelector(".operator_" + and.optionId).value == "") {
                            this.el.nativeElement.querySelector(".operator_" + and.optionId).classList.add("br_error");
                            errorMsg = "Banner point logic operator should not be empty";
                          }
                          else {
                            errorMsg = "Banner point logic required";
                          }
                        }
                      }
                    }
                    else {
                      if (this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).value != "" && this.el.nativeElement.querySelector(".operator_" + and.optionId).value != "" && this.el.nativeElement.querySelector(".value_" + and.optionId).value != "") {
                        stringOp += this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).value + this.el.nativeElement.querySelector(".operator_" + and.optionId).value + coma1 + this.el.nativeElement.querySelector(".value_" + and.optionId).value + coma1;
                        this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).classList.remove("br_error");
                        this.el.nativeElement.querySelector(".operator_" + and.optionId).classList.remove("br_error");
                        this.el.nativeElement.querySelector(".value_" + and.optionId).classList.remove("br_error");
                      } else {
                        if (this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).value == "" || this.el.nativeElement.querySelector(".operator_" + and.optionId).value == "") {
                          this.el.nativeElement.querySelector(".andoroperator_" + and.optionId).classList.add("br_error");
                          errorMsg = "Banner point logic operator should not be empty";
                        }
                        else if (this.el.nativeElement.querySelector(".value_" + and.optionId).value == "") {
                          this.el.nativeElement.querySelector(".value_" + and.optionId).classList.add("br_error");
                          errorMsg = "Banner point logic value should not be empty";
                        }
                        else {
                          errorMsg = "Banner point logic required";
                        }
                      }
                    }
                  }
                }
                else {
                  error += 1;
                  errorMsg = "Banner point logic is required";
                }
              });
            }

            if (error == 0) {
              if (stringOp != "") {
                logicalStringOp["pointLogic"] = stringOp;
                logicalArray.push(logicalStringOp);
              }
            }
          });
        }
        if (error == 0) {
          let pointId = "";
          if (this.bannerPointList[a]) {
            pointId = this.bannerPointList[a]["pointID"];
            if (this.bannerPointList[a]["logic"].length > 0) {
              this.bannerPointList[a]["logic"].forEach(lg => {
                logicalArray.push({ "pointLogic": lg.pointLogic });
              });
            }
          }
          allSegment.push({
            "pointID": pointId,
            "segTitle": form.value.segmentname,
            "groupName": form.value.segmentGroup,
            "logic": logicalArray
          });
        }
      });

      if (error == 0 && allSegment.length == allForm.length) {
        this.loaderService.show();
        let sendJson = {
          "studyID": this.masterData['urlStudyId'],
          "bannerID": this.masterData["bannerInfo"]["bannerID"],
          "allSegment": allSegment
        }
        this.httpService.callApi('addBannerPoint', { body: sendJson }).subscribe((response) => {
          let viewResp = response["header"]["code"];
          if (viewResp == 200) {
            // this.getUpdatedBannerPoint();
            // this.toastr.success(" Segment saved successfully", '');
            this.loaderService.hide();
            this.out.emit('close');
            if (this.masterData["bannerInfo"] == undefined) {
              this.masterData["bannerInfo"] = {};
            }
            this.systemSr.clearCrosstabTable();
            this.masterData["bannerInfo"]["bannerPoint"] = response["response"];
            this.systemSr.setLocalStorage(this.masterData);
            // this.navigateUrl('table-list');
            this.out.emit('close');
          }
        });
      }
      else {
        this.toastr.error(errorMsg, '');
      }
    }
    else {
      this.toastr.error(findUnique[0] + " banner point name should be unique", '');
    }
  }

  updateBannerPoint(item, index) {
    if (item.value.segmentname != "") {
      let getPointId = this.bannerPointList.filter(obj => {
        return obj.seq === index;
      })
      this.loaderService.show();
      let bannerJsn = {
        "studyID": this.masterData['urlStudyId'],
        "bannerID": this.masterData["bannerInfo"]["bannerID"],
        "title": item.value.segmentname,
        "logic": item.value.segmentGroup,
        "bannerGroup": getPointId[0]["bannerGroup"],
        "pointID": getPointId[0]["pointID"],
      }
      this.httpService.callApi('bannerPointEdit', { body: bannerJsn }).subscribe((response) => {
        let viewResp = response["header"]["code"];
        if (viewResp == 200) {
          this.toastr.success(item.value.segmentname + " updated successfully", '');
          this.loaderService.hide();
        }
      });
    }
    else {
      this.toastr.error("Segment name is required", '');
    }
  }

  // get updated segment
  getUpdatedBannerPoint() {
    let listBanner = {
      "studyID": this.masterData['urlStudyId'],
      "bannerID": this.masterData["bannerInfo"]["bannerID"]
    }
    this.httpService.callApi('bannerPointList', { body: listBanner }).subscribe((response) => {
      let viewResp = response["header"]["code"];
      if (viewResp == 200) {
        this.bannerPointList = response["response"];
        this.init();
      }
    });
  }

  navigateTodas() {
    this.systemSr.navigateToproducts()
  }
}
