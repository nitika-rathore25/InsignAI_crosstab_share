import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/service/http.service';
import { LoaderService } from 'src/app/service/loader.service';
import { SystemService } from 'src/app/service/system.service';

@Component({
  selector: 'app-download-all',
  templateUrl: './download-all.component.html',
  styleUrls: ['./download-all.component.css']
})
export class DownloadAllComponent implements OnInit {

  downStatusModal: boolean = false;
  masterData: any;
  downloadStatusList: any;
  display = "none";

  constructor(public systemSr: SystemService, private el: ElementRef, private httpService: HttpService, private router: Router, private http: HttpClient, private loaderService: LoaderService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.masterData = this.systemSr.getLocalStorage();
    this.downloadStatus();
  }

  downloadStatus() {
    this.loaderService.show();
    let resetJson = {
      "studyID": this.masterData['urlStudyId']
    }
    this.httpService.callApi('downloadProcessList', { body: resetJson }).subscribe((response) => {
      let viewResp = response["header"]["code"];
      console.log('test')
      if (viewResp == 200) {
        this.downloadStatusList = response["response"];
        this.display = "block";
        this.downStatusModal = true;
        this.loaderService.hide();
        if (response["response"]["incomplete"] > 0) {
          this.recallProcessList();
          this.loaderService.hide();
        }
      }
    });
  }

  recallProcessList() {
    let resetJson = {
      "studyID": this.masterData['urlStudyId']
    }
    this.httpService.callApi('downloadProcessList', { body: resetJson }).subscribe((response) => {
      console.log('test2')
      let viewResp = response["header"]["code"];
      if (viewResp == 200) {
        this.downloadStatusList = response["response"];
        this.loaderService.hide();
        if (response["response"]["incomplete"] > 0 && this.systemSr.downloadHistory == true) {
          setTimeout(() => {
            this.recallProcessList()
          }, 4000);
        }
      }
    });
  }

  downloadLink(list) {
    this.toastr.info("Processing " + list.req_name + " for download", '');
    this.el.nativeElement.querySelector("#pid_" + list.pid).classList.add("d_op");
    let pptJson = {
      "studyID": this.masterData['urlStudyId'],
      "pid": list.pid
    }
    this.httpService.callApi('downloadProcess', { body: pptJson, responseType: 'blob' as 'json' }).subscribe((response) => {
      if (response != null) {
        if (response.size > 0) {
          let filename = this.masterData['stdName'] + "_" + Date.now() + '.' + list.file_type;
          this.el.nativeElement.querySelector("#pid_" + list.pid).classList.remove("d_op");
          let fileType = response.type;
          let rspData = [];
          rspData.push(response);
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(rspData, { type: fileType }));
          if (filename) {
            downloadLink.setAttribute('download', filename);
            document.body.appendChild(downloadLink);
            downloadLink.click();
          }
          this.toastr.success(this.masterData.stdName + " downloaded successfully", '');
        }
      }
    });
  }

  clearHistory() {
    this.el.nativeElement.querySelector("#cl_history").classList.add("d-none");
    this.el.nativeElement.querySelector("#cl_confirm_history").classList.remove("d-none");
  }

  clearDownloadHistory() {
    this.loaderService.show();
    let resetJson = {
      "studyID": this.masterData['urlStudyId']
    }
    this.httpService.callApi('clearProcessList', { body: resetJson }).subscribe((response) => {
      let viewResp = response["header"]["code"];
      if (viewResp == 200) {
        this.downloadStatusList = response["response"];
        this.loaderService.hide();
        this.toastr.success("Download history cleared successfully", '');
        this.dismissStatusModal();
      }
    });
  }

  dismissStatusModal() {
    this.display = "none";
    this.downStatusModal = false;
    this.systemSr.downloadHistory = false;
  }
}
