import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../service/http.service';
import { LoaderService } from '../service/loader.service';
import { SystemService } from '../service/system.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  masterData: any;
  url: any;
  helpModal: boolean = false;
  logoutModal: boolean = false;
  folderList = [];
  headList = [];
  folderData: any;
  renameModal: boolean = false;
  apiResponsd: boolean = false;
  linkModal: boolean = false;
  helpPopup: boolean = false;
  showLink: boolean = false;
  renameVal: any;
  @Input() questionInfo: any;
  @Input() insights: any;
  @Input() builderInfo: any;
  toInfo: any;
  inter_id: any;
  noti_inter_id: any;
  notification: any;
  themeArray: any[] = [];

  constructor(
    public systemSr: SystemService,
    private el: ElementRef,
    private httpService: HttpService,
    private router: Router,
    private loaderService: LoaderService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // this.userTheme();
    // this.url = this.systemSr.currentUrl.replace('/', '');
    this.masterData = this.systemSr.getLocalStorage();
    this.builderInfo = this.masterData.sample_feasible;
    if (
      this.masterData.grp != 'admin' &&
      this.url != 'edit-banner' &&
      this.url != 'table-list' &&
      this.url != 'crosstab'
    ) {
      // this.qTrack();
    }

    // this.httpService.callApi('notification', {}).subscribe((response) => {
    //   let code = response['header']['code'];
    //   if (code == 200) {
    //     this.notification = response['response'];
    //   }
    // });

    // this.noti_inter_id = setInterval(() => {
    //   this.notification = [];
    //   this.stopInterval();
    // }, 20000);
  }

  logout() {
    // this.systemSr.logout();
    this.httpService.callApi('logout', { body: {} }).subscribe((response) => {
      let deleteResponse = response['header']['code'];
      if (deleteResponse == 200) {
        // this.closeLogoutModal();
        // localStorage.clear();
        // this.router.navigate(['']);
      }
    });
    this.closeLogoutModal();
    localStorage.clear();
    this.router.navigate(['']);
  }

  navigateToproducts() {
    this.systemSr.navigateToproducts();
  }

  navigateUrl(url) {
    this.router.navigate([url]);
  }

  getRestModal() {
    this.systemSr.getResetPass();
  }

  goToResetPassword() {
    this.masterData['fromInputCurrentUrl'] = this.systemSr.currentUrl;
    this.systemSr.setLocalStorage(this.masterData);
    let makeUrl = this.systemSr.urlsService.masterUrl + '#settings';
    window.open(makeUrl, '_self');
  }

  getInstruction() {
    let fileName =
      'https://8451consumerresearchbridge.com/crosstab-file/Crosstabs_Feature_Training.ppsx';
    window.open(fileName, '_target');
  }

  showHelpModal() {
    this.showLink = false;
    this.systemSr.display = 'block';
    this.helpModal = true;
    this.folderListApi();
    sessionStorage.clear();
    this.inter_id = setInterval(() => {
      this.showLink = true;
      this.stopInterval();
    }, 60000);
  }

  stopInterval() {
    if (this.inter_id) {
      clearInterval(this.inter_id);
    }
    if (this.noti_inter_id) {
      clearInterval(this.noti_inter_id);
    }
  }

  clHelpModal() {
    this.systemSr.display = 'none';
    this.helpModal = false;
    sessionStorage.clear();
  }

  getPdf(list) {
    let url =
      'https://8451inqueries.com/_temp/file_help/RTI_2.0_Custom_Surveys_15_Playbook.pdf';
    if (list._type == 'file') {
      url = list._access;
    }
    window.open(url, '_target');
  }

  openLogoutModal() {
    this.logoutModal = true;
    this.systemSr.display = 'block';
  }

  closeLogoutModal() {
    this.logoutModal = false;
    this.systemSr.display = 'none';
  }

  // Learning Center
  folderListApi() {
    this.headList = [];
    this.folderList = [];
    this.apiResponsd = true;
    sessionStorage.removeItem('_path');
    this.httpService
      .callApi('folderList', { body: {} })
      .subscribe((response) => {
        let dataResponse = response['header']['code'];
        if (dataResponse == 200) {
          this.apiResponsd = false;
          this.folderList = response['response'];
          this.folderList.sort();
          this.folderList.forEach((row) => {
            if (row._type == 'file') {
              let mk = row._name.split('.');
              let fl = mk[mk.length - 1].toLowerCase();
              if (fl == 'ppsx' || fl == 'pptx' || fl == 'ppt' || fl == 'pptm') {
                row['file_type'] = 'fa-duotone fa-file-powerpoint';
              } else if (
                fl == 'xlsx' ||
                fl == 'xlsm' ||
                fl == 'xls' ||
                fl == 'xla' ||
                fl == 'xlam'
              ) {
                row['file_type'] = 'fa-duotone fa-file-excel';
              } else if (fl == 'docx' || fl == 'doc') {
                row['file_type'] = 'fa-duotone fa-file-word';
              } else if (fl == 'pdf') {
                row['file_type'] = 'fa-duotone fa-file-pdf';
              } else if (
                fl == 'jpg' ||
                fl == 'png' ||
                fl == 'jpeg' ||
                fl == 'gif'
              ) {
                row['file_type'] = 'fa-duotone fa-image';
              } else if (
                fl == 'mp4' ||
                fl == 'mov' ||
                fl == 'avi' ||
                fl == 'flv' ||
                fl == 'mkv' ||
                fl == 'wmp' ||
                fl == 'webm' ||
                fl == 'mpeg'
              ) {
                row['file_type'] = 'fa-duotone fa-video';
              } else {
                row['file_type'] = 'fa-duotone fa-file-lines';
              }
            }
          });
        }
      });
  }

  createFolder() {
    let name = 'New folder (' + (this.folderList.length + 1) + ')';
    if (name != '') {
      let _path = '';
      let session = this.systemSr.getSession('_path');
      if (session != undefined && session != null) {
        session.forEach((row, i) => {
          if (i == 0) {
            _path += row;
          } else {
            _path += '/' + row;
          }
        });
      } else {
        _path = '';
      }
      if (_path == null) {
        _path = '';
      }

      let data = {
        folderPath: _path,
        newFolderName: name,
      };
      this.httpService
        .callApi('createFolder', { body: data })
        .subscribe((response) => {
          let dataResponse = response['header']['code'];
          if (dataResponse == 200) {
            this.callFolderApi(_path);
          }
        });
    } else {
      this.toastr.warning('Folder name is required.', '');
    }
  }

  getFolder(list) {
    this.folderData = list;
    let _path = '';
    let session = this.systemSr.getSession('_path');
    if (session != undefined && session != null) {
      let found = session.some((hd) => hd == list);
      if (found == false) {
        session.push(list);
      }

      session.forEach((row, i) => {
        if (i == 0) {
          _path += row;
        } else {
          _path += '/' + row;
        }
      });
      this.headList = session;
    } else {
      this.headList = [];
      this.headList.push(list);
      _path += list;
    }
    this.systemSr.setSession(this.headList, '_path');
    this.callFolderApi(_path);
  }

  getPrevious(index) {
    let session = this.systemSr.getSession('_path');
    if (session != undefined && session != null) {
      let _path = '';
      session.splice(index + 1, session.length - (index + 1));
      this.headList.splice(index + 1, this.headList.length - (index + 1));
      this.systemSr.setSession(this.headList, '_path');
      session.forEach((row, i) => {
        if (i == 0) {
          _path += row;
        } else {
          _path += '/' + row;
        }
      });
      this.callFolderApi(_path);
    }
  }

  callFolderApi(_path) {
    this.folderList = [];
    this.apiResponsd = true;
    this.httpService
      .callApi('folderList', { body: { folderPath: _path } })
      .subscribe((response) => {
        let dataResponse = response['header']['code'];
        if (dataResponse == 200) {
          this.apiResponsd = false;
          this.folderList = response['response'];
          this.folderList.forEach((row) => {
            if (row._type == 'file') {
              let mk = row._name.split('.');
              let fl = mk[mk.length - 1].toLowerCase();
              if (fl == 'ppsx' || fl == 'pptx' || fl == 'ppt' || fl == 'pptm') {
                row['file_type'] = 'fa-duotone fa-file-powerpoint';
              } else if (
                fl == 'xlsx' ||
                fl == 'xlsm' ||
                fl == 'xls' ||
                fl == 'xla' ||
                fl == 'xlam'
              ) {
                row['file_type'] = 'fa-duotone fa-file-excel';
              } else if (fl == 'docx' || fl == 'doc') {
                row['file_type'] = 'fa-duotone fa-file-word';
              } else if (fl == 'pdf') {
                row['file_type'] = 'fa-duotone fa-file-pdf';
              } else if (
                fl == 'jpg' ||
                fl == 'png' ||
                fl == 'jpeg' ||
                fl == 'gif'
              ) {
                row['file_type'] = 'fa-duotone fa-image';
              } else if (
                fl == 'mp4' ||
                fl == 'mov' ||
                fl == 'avi' ||
                fl == 'flv' ||
                fl == 'mkv' ||
                fl == 'wmp' ||
                fl == 'webm' ||
                fl == 'mpeg'
              ) {
                row['file_type'] = 'fa-duotone fa-video';
              } else {
                row['file_type'] = 'fa-duotone fa-file-lines';
              }
            }
          });
        }
      });
  }

  uploadFile(event) {
    let fileName = event.target.files[0];
    let lenFile = event.target.files.length;
    fileName = event.target.files[0];
    if (fileName.name != '' && lenFile > 0) {
      let _path = '';
      let session = this.systemSr.getSession('_path');
      if (session != undefined && session != null) {
        session.forEach((row, i) => {
          if (i == 0) {
            _path += row;
          } else {
            _path += '/' + row;
          }
        });
      }

      this.folderList = [];
      let fileType = fileName.name;
      var formData: any = new FormData();
      formData.append('apiToken', this.masterData['token']);
      formData.append('file', fileName, fileType);
      formData.append('filePath', _path);

      this.httpService.callApi('uploadFile', { body: formData }).subscribe(
        (response) => {
          let temResp = response['header']['code'];
          let thisResp = response['header']['message'];
          if (temResp == 200) {
            this.callFolderApi(_path);
            this.el.nativeElement.querySelector('#myFile').value = '';
          } else if (temResp > 400 && temResp < 500) {
            this.toastr.error(thisResp, '');
            this.loaderService.hide();
            this.el.nativeElement.querySelector('#myFile').value = '';
          }
        },
        (error) => {
          this.el.nativeElement.querySelector('#myFile').value = '';
        }
      );
    } else {
      this.toastr.error('Image or Video is required.', '');
    }
  }

  clFlModal() {
    this.renameModal = false;
  }

  showRepoModal() {
    this.systemSr.insightsModal = true;
    this.systemSr.display = 'block';
  }

  renameFolder(list) {
    this.renameModal = true;
    this.renameVal = list;
  }

  saveRename() {
    let name = this.el.nativeElement.querySelector('#rename_fl').value.trim();
    if (name != '') {
      let mkJson = {};
      this.el.nativeElement.querySelector('#sp_rename').classList.add('d-none');
      this.el.nativeElement.querySelector('#sp_cr').classList.remove('d-none');
      let _path = '';
      let session = this.systemSr.getSession('_path');
      if (session != undefined && session != null) {
        session.forEach((row, i) => {
          if (i == 0) {
            _path += row;
          } else {
            _path += '/' + row;
          }
        });
      }

      mkJson = {
        path: _path,
        name: this.renameVal._name,
        updatedName: name,
        type: this.renameVal._type,
      };

      if (this.renameVal._type == 'vimeo') {
        mkJson['id'] = this.renameVal.ID;
      }

      this.httpService
        .callApi('renameFl', { body: mkJson })
        .subscribe((response) => {
          let dataResponse = response['header']['code'];
          this.el.nativeElement.querySelector('#sp_cr').classList.add('d-none');
          this.el.nativeElement
            .querySelector('#sp_rename')
            .classList.remove('d-none');
          if (dataResponse == 200) {
            this.folderList.forEach((row) => {
              if (this.renameVal._name == row._name) {
                row._name = name;
              }
            });
            this.clFlModal();
            // this.callFolderApi(_path);
          }
        });
    } else {
      this.toastr.error('File name is required.', '');
    }
  }

  backTofolder() {
    let _path = '';
    let session = this.systemSr.getSession('_path');
    if (session != undefined && session != null) {
      if (session.length == 1) {
        this.folderListApi();
        this.headList = [];
        sessionStorage.removeItem('_path');
      } else {
        session.forEach((row, i) => {
          if (i == 0) {
            _path += row;
          } else if (i < session.length - 1) {
            _path += '/' + row;
          }
        });
        this.callFolderApi(_path);
        session.splice(session.length - 1, 1);
        this.headList = session;
        this.systemSr.setSession(session, '_path');
      }
    }
  }

  removeFolder(list, index) {
    let _path = '';
    let session = this.systemSr.getSession('_path');
    if (session != undefined && session != null) {
      session.forEach((row, i) => {
        if (i == 0) {
          _path += row;
        } else {
          _path += '/' + row;
        }
      });
      this.headList = session;
    }

    let mkJson = {
      path: _path,
      name: list._name,
      type: list._type,
    };
    this.httpService
      .callApi('deleteFolder', { body: mkJson })
      .subscribe((response) => {
        let dataResponse = response['header']['code'];
        if (dataResponse == 200) {
          this.folderList.splice(index, 1);
          this.callFolderApi(_path);
        }
      });
  }

  addLinkModal() {
    this.linkModal = true;
  }

  clLinkModal() {
    this.linkModal = false;
  }

  saveUrl() {
    let linkName = this.el.nativeElement
      .querySelector('#link_name')
      .value.trim();
    let vimoeUrl = this.el.nativeElement
      .querySelector('#link_url')
      .value.trim();
    if (linkName != '' && vimoeUrl != '') {
      this.el.nativeElement.querySelector('#add_url').classList.add('d-none');
      this.el.nativeElement.querySelector('#sp_rt').classList.remove('d-none');
      this.el.nativeElement
        .querySelector('#link_name')
        .classList.remove('errorClr');
      this.el.nativeElement
        .querySelector('#link_url')
        .classList.remove('errorClr');
      let _path = '';
      let session = this.systemSr.getSession('_path');
      if (session != undefined && session != null) {
        session.forEach((row, i) => {
          if (i == 0) {
            _path += row;
          } else {
            _path += '/' + row;
          }
        });
      }

      let mkJson = {
        path: _path,
        name: linkName,
        url: vimoeUrl,
      };
      this.httpService
        .callApi('addToLearning', { body: mkJson })
        .subscribe((response) => {
          let dataResponse = response['header']['code'];
          this.el.nativeElement
            .querySelector('#add_url')
            .classList.remove('d-none');
          this.el.nativeElement.querySelector('#sp_rt').classList.add('d-none');
          if (dataResponse == 200) {
            this.clLinkModal();
            this.callFolderApi(_path);
          }
        });
    } else {
      let errmsg = '';
      if (linkName == '') {
        errmsg = 'Name is required.';
        this.el.nativeElement
          .querySelector('#link_name')
          .classList.add('errorClr');
      } else {
        errmsg = 'URL is required.';
        this.el.nativeElement
          .querySelector('#link_url')
          .classList.add('errorClr');
      }
      this.toastr.error(errmsg, '');
    }
  }

  keyHandle(event, id) {
    if (event.target.value == '') {
      this.el.nativeElement.querySelector(id).classList.add('errorClr');
    } else {
      this.el.nativeElement.querySelector(id).classList.remove('errorClr');
    }
  }

  removeUrl(list) {
    let mkJson = {
      id: list.ID,
    };
    this.httpService
      .callApi('removeLink', { body: mkJson })
      .subscribe((response) => {
        let dataResponse = response['header']['code'];
        if (dataResponse == 200) {
          let _path = '';
          let session = this.systemSr.getSession('_path');
          if (session != undefined && session != null) {
            session.forEach((row, i) => {
              if (i == 0) {
                _path += row;
              } else {
                _path += '/' + row;
              }
            });
          }
          this.callFolderApi(_path);
        }
      });
  }

  playVimeo(list) {
    window.open(list._url, '_blank');
  }

  qTrack() {
    if (this.url == 'study-listing') {
      let makeJson = {};
      makeJson['orgID'] = this.masterData['orgId'];
      this.httpService
        .callApi('subscriptionActiveUser', { body: makeJson })
        .subscribe((response) => {
          let dataResponse = response['header']['code'];
          if (dataResponse == 200) {
            this.questionInfo = response['response'];
          }
        });
    } else {
      if (this.masterData['urlStudyId']) {
        let makeJson = {
          studyID: this.masterData['urlStudyId'],
        };
        if (this.masterData.grp == 'admin') {
          makeJson['orgID'] = this.masterData['orgId'];
        }
        this.httpService
          .callApi('getUsedQuestions', { body: makeJson })
          .subscribe((response) => {
            let dataResponse = response['header']['code'];
            if (dataResponse == 200) {
              this.questionInfo = response['response'];
              this.masterData['created_q'] = response['response']['created_q'];
              this.systemSr.setLocalStorage(this.masterData);
            }
          });
      }
    }
  }

  openHelp() {
    if (this.masterData.userType == 'user') {
      this.loaderService.show();
      this.httpService
        .callApi('orgList', { body: {} })
        .subscribe((response) => {
          let deleteResponse = response['header']['code'];
          if (deleteResponse == 200) {
            this.toInfo = response['response'][0];
            this.helpModal = false;
            this.helpPopup = true;
            this.loaderService.hide();
          }
        });
    } else {
      this.helpModal = false;
      this.helpPopup = true;
    }
  }

  closeHelp() {
    this.helpPopup = false;
    this.helpModal = true;
    this.stopInterval();
  }

  sendHelpEmail(type) {
    let brief = this.el.nativeElement.querySelector('#brief').value.trim();
    let detail = this.el.nativeElement
      .querySelector('#detail_help')
      .value.trim();
    if (
      brief != '' &&
      detail != '' &&
      brief.length <= 300 &&
      detail.length <= 800
    ) {
      this.el.nativeElement
        .querySelector('#brief')
        .classList.remove('is-invalid');
      this.el.nativeElement
        .querySelector('#detail_help')
        .classList.remove('is-invalid');
      this.loaderService.show();
      this.httpService
        .callApi('learningHelp', {
          body: { short_detail: brief, long_detail: detail },
        })
        .subscribe((response) => {
          let rsp = response['header']['code'];
          if (rsp == 200) {
            if (type != '') {
              this.helpPopup = false;
              this.helpModal = true;
            } else {
              this.helpPopup = false;
              this.systemSr.display = 'none';
            }
            this.toastr.success('Email sent successfully');
            this.loaderService.hide();
          }
        });
    } else {
      if (brief == '') {
        this.el.nativeElement
          .querySelector('#brief')
          .classList.add('is-invalid');
      } else if (detail == '') {
        this.el.nativeElement
          .querySelector('#detail_help')
          .classList.add('is-invalid');
      } else if (brief.length > 300 && detail.length > 800) {
        this.toastr.error(
          'Short description character should be maximum 300 and long description character should be maximum 800'
        );
      }
    }
  }

  // getTheme() {
  //   this.httpService
  //     .callApi('themeList', {
  //       body: {},
  //     })
  //     .subscribe((response) => {
  //       this.themeArray = response.response;
  //     });
  // }

  // setTheme(theme_id) {
  //   this.httpService
  //     .callApi('setTheme', {
  //       body: {
  //         user_theme: theme_id,
  //       },
  //     })
  //     .subscribe((res) => {
  //       this.saveTheme(theme_id)
  //     });
  // }
  // userTheme() {
  //   this.httpService
  //     .callApi('setUserTheme', { body: {} })
  //     .subscribe((res) => {
  //       this.saveTheme(res.response[0].user_theme);
  //     });
  // }
  // saveTheme(theme_id){
  //   let body = window.document.getElementsByTagName('body');
  //   if (theme_id == 'light') {
  //     body[0].classList.remove('dark');
  //     body[0].classList.add('light');
  //     localStorage.setItem("user_theme", theme_id)
  //   } else {
  //     body[0].classList.remove('light');
  //     body[0].classList.add('dark');
  //     localStorage.setItem("user_theme", theme_id)
  //   }
  // }
}
