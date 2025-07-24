import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from "rxjs";
import { catchError, map, tap } from 'rxjs/operators';
import { UrlsService } from './urls.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../service/loader.service';
import { SystemService } from './system.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(public systemSr: SystemService, private httpClient: HttpClient, public urlsService: UrlsService, private toastr: ToastrService, private loaderService: LoaderService) { }

  callApi(action, options: { body?: any; headers?: HttpHeaders; params?: HttpParams; pathVariable?: any; observe?: "response"; responseType?: 'json' }): Observable<any> {
    let urlObject = this.urlsService.urlObject[action];

    let url = urlObject.url + (options.pathVariable || '');

    if (action != 'login' && action != "notification" && action != "validateEmail" && action != "validatePassKey" && action != 'studyInfo') {
      let masterData = this.systemSr.getLocalStorage();
      options["body"]["switchKey"] = masterData["token"];
      // options["headers"] = this.systemSr.getMasterToken();

      // if(urlObject?.method == "POST"){
      //   if(Object.keys(options["body"].length > 0)){
      //     Object.keys(options["body"]).forEach(row => {
      //       if(typeof options["body"][row] === 'string') {
      //         if(row != "email_address" && row != "email" && action != 'setLinks'){
      //           options["body"][row] = options["body"][row].replaceAll("http://", "").replaceAll("https://", "").replaceAll("://", "").replaceAll(".com", "").replaceAll(".org", "").replaceAll(".edu", "").replaceAll(".in", "").replaceAll(".ai", "");
      //         }
      //         // options["body"][row] = options["body"][row].replaceAll("<", '&lt;').replaceAll(">", '&gt;');
      //       }
      //     });
      //   }
      // }
    }

    if (urlObject?.method == "POST") {
      if (Object.keys(options["body"].length > 0)) {
        Object.keys(options["body"]).forEach(row => {
          if (typeof options["body"][row] === 'string') {
            options["body"][row] = this.systemSr.stripHtml(options["body"][row]);
          }
        });
        // if(action == "addNewQuestion"){
        //   options["body"] = this.convertText(options["body"])
        // }
        // else {
        //   options["body"] = this.getEncodeList(options["body"], action);
        // }
        options["body"] = this.getEncodeList(options["body"], action);
      }
    }

    return this.httpClient.request(urlObject.method, url, options).pipe(tap(result => {
      if (action != 'login' && action != "downloadProcess" && action != "validateEmail") {
        if (result.header.code == 200 || result.header.code == 202 || result.header.code == 201) {
          // if(action == "savedQuestions"){
          //   result = this.parseText(result);
          // }
          // result = this.getDecodeList(result, action);
          return result;
        }
        else if (result.header.code == 401) {
          this.loaderService.hide();
          this.systemSr.logout();
        }
        else if (result.header.code == 403 && action != "getStatus" && action != "saveSampleBuilder") {
          this.loaderService.hide();
          this.toastr.warning(result.header.message, '');
        }
        else if ((result.header.code == 400 || result.header.code == 404) && action != "getStatus" && action != "saveSampleBuilder") {
          this.loaderService.hide();
          this.systemSr.hide();
          this.toastr.error(result.header.message, '');
        }
        else {
          if (action != "getStatus" && action != "saveSampleBuilder") {
            this.systemSr.hide();
            this.loaderService.hide();
            this.toastr.error(result.header.message, '');
          }
        }
      }
      else {
        if (action == 'login') {
          if (result['body']['header']['code'] == 200) {
            // result = this.getDecodeList(result, action);
            return result;
          }
          else {
            if (action != "getStatus" && action != "saveSampleBuilder") {
              this.systemSr.hide();
              this.loaderService.hide();
              this.toastr.error(result['body']['header'].message, '');
            }
          }
        }
        else {
          // result = this.getDecodeList(result, action);
          return result;
        }
      }
    }, error => {
      if (error?.status == 403 && action != "getStatus" && action != "saveSampleBuilder") {
        this.systemSr.hide();
        this.loaderService.hide();
        this.toastr.warning(error?.error?.header?.message, '');
      }
      else if (error?.status == 401) {
        this.systemSr.logout();
      }
      else if (error?.status == 500) {
        this.systemSr.hide();
        this.loaderService.hide();
        this.toastr.error("There was an error while performing your request. Please contact the administrator.", '');
      }
      else {
        if (action != "getStatus" && action != "saveSampleBuilder") {
          this.systemSr.hide();
          this.loaderService.hide();
          this.toastr.error(error?.error?.header?.message, '');
        }
      }
    }));
  }

  getDecodeList(response, action) {
    if (action == 'login') {
      response["body"]["response"]["firstName"] = this.decodeData(response["body"]["response"]["firstName"]);
      response["body"]["response"]["lastName"] = this.decodeData(response["body"]["response"]["lastName"]);
      response["body"]["response"]["userType"] = this.decodeData(response["body"]["response"]["userType"]);
      response["body"]["response"]["grp"] = this.decodeData(response["body"]["response"]["grp"]);
      response["body"]["response"]["org_name"] = this.decodeData(response["body"]["response"]["org_name"]);
    }
    if (action == 'allUserList') {
      if (response["response"].length > 0) {
        response["response"].forEach(row => {
          row["firstName"] = this.decodeData(row["firstName"]);
          row["lastName"] = this.decodeData(row["lastName"]);
          row["emailAddress"] = this.decodeData(row["emailAddress"]);
          row["userType"] = this.decodeData(row["userType"]);
          row["grp"] = this.decodeData(row["grp"]);
          // row["org_name"] = this.decodeData(row["org_name"]);
        });
      }
    }
    if (action == 'allUserListAll') {
      if (response["response"].length > 0) {
        response["response"].forEach(row => {
          row["firstName"] = this.decodeData(row["firstName"]);
          row["lastName"] = this.decodeData(row["lastName"]);
          row["emailAddress"] = this.decodeData(row["emailAddress"]);
          row["userType"] = this.decodeData(row["userType"]);
          row["grp"] = this.decodeData(row["grp"]);
          row["org_name"] = this.decodeData(row["org_name"]);
        });
      }
    }
    if (action == 'orgList') {
      if (response["response"].length > 0) {
        response["response"].forEach(row => {
          row["manager_data"] = this.decodeData(row["manager_data"]);
          row["org_name"] = this.decodeData(row["org_name"]);
        });
      }
    }
    if (action == 'orgListAll') {
      if (response["response"].length > 0) {
        response["response"].forEach(row => {
          row["org_name"] = this.decodeData(row["org_name"]);
        });
      }
    }
    if (action == 'getAddUserRequests') {
      if (response["response"].length > 0) {
        response["response"].forEach(row => {
          row["firstName"] = this.decodeData(row["firstName"]);
          row["lastName"] = this.decodeData(row["lastName"]);
          row["emailAddress"] = this.decodeData(row["emailAddress"]);
          row["req_firstName"] = this.decodeData(row["req_firstName"]);
          row["req_lastName"] = this.decodeData(row["req_lastName"]);
        });
      }
    }
    if (action == 'subscriptionActiveUser') {
      response["response"]['org_name'] = this.decodeData(response["response"]["org_name"]);
    }
    if (action == 'userStudyListing') {
      if (response["response"].length > 0) {
        response["response"].forEach(row => {
          row["studyName"] = this.decodeData(row["studyName"]);
          row["name"] = this.decodeData(row["name"]);
          row["liveLink"] = this.decodeData(row["liveLink"]);
          row["email"] = this.decodeData(row["email"]);
        });
      }
    }
    if (action == "studyInfo") {
      response["response"]["panel"] = this.decodeData(response["response"]["panel"]);
      response["response"]["studyName"] = this.decodeData(response["response"]["studyName"]);
    }

    return response;
  }

  decodeData(list) {
    if (list != '' && list != null && list != undefined) {
      list = atob(list);
      let enc = list.split('^!*');
      let encTwo = enc[0].split('*!^');
      list = atob(encTwo[1]);
      return list;
    }
    else {
      return list;
    }
  }

  getEncodeList(payload, action) {
    if (action == "login") {
      payload["username"] = this.enCodePayload(payload["username"]);
    }
    if (action == "userSignUp") {
      payload["first_name"] = this.enCodePayload(payload["first_name"]);
      payload["last_name"] = this.enCodePayload(payload["last_name"]);
      payload["email_address"] = this.enCodePayload(payload["email_address"]);
      payload["user_type"] = this.enCodePayload(payload["user_type"]);
    }
    if (action == "updateUser") {
      payload["first_name"] = this.enCodePayload(payload["first_name"]);
      payload["last_name"] = this.enCodePayload(payload["last_name"]);
      payload["user_type"] = this.enCodePayload(payload["user_type"]);
    }
    if (action == "orgCreate" || action == "orgRename" || action == "orgDelete") {
      payload["orgName"] = this.enCodePayload(payload["orgName"]);
    }
    if (action == "sendRequestToAdd") {
      payload["firstName"] = this.enCodePayload(payload["firstName"]);
      payload["lastName"] = this.enCodePayload(payload["lastName"]);
      payload["email"] = this.enCodePayload(payload["email"]);
    }
    return payload;
  }

  enCodePayload(list) {
    if (list != '' && list != null && list != undefined) {
      let randOne = this.systemSr.randomPassValue(Math.floor(Math.random() * 10) + 4);
      let randTwo = this.systemSr.randomPassValue(Math.floor(Math.random() * 10) + 4);
      list = btoa(list);
      list = (btoa(randOne + "*!^" + list + "^!*" + randTwo));
      return list;
    }
    else {
      return list;
    }
  }

  // Template question add
  convertText(payload) {
    if (payload.data) {
      payload.data.forEach(ques => {
        if (Object.keys(ques.length > 0)) {
          Object.keys(ques).forEach(key => {
            if (typeof ques[key] === 'string') {
              ques[key] = ques[key].replaceAll("http://", "").replaceAll("https://", "").replaceAll("://", "").replaceAll(".com", "").replaceAll(".org", "").replaceAll(".edu", "").replaceAll(".in", "").replaceAll(".ai", "");
              ques[key] = ques[key].replaceAll("<", '&lt;').replaceAll(">", '&gt;');
            }
          });
        }

        if (ques.rowOptionList.length > 0) {
          ques.rowOptionList.forEach(row => {
            if (Object.keys(row.length > 0)) {
              Object.keys(row).forEach(key => {
                if (typeof row[key] === 'string') {
                  row[key] = row[key].replaceAll("http://", "").replaceAll("https://", "").replaceAll("://", "").replaceAll(".com", "").replaceAll(".org", "").replaceAll(".edu", "").replaceAll(".in", "").replaceAll(".ai", "");
                  row[key] = row[key].replaceAll("<", '&lt;').replaceAll(">", '&gt;');
                }
              });
            }
          });
        }

        if (ques.colOptionList.length > 0) {
          ques.colOptionList.forEach(col => {
            if (Object.keys(col.length > 0)) {
              Object.keys(col).forEach(key => {
                if (typeof col[key] === 'string') {
                  col[key] = col[key].replaceAll("http://", "").replaceAll("https://", "").replaceAll("://", "").replaceAll(".com", "").replaceAll(".org", "").replaceAll(".edu", "").replaceAll(".in", "").replaceAll(".ai", "");
                  col[key] = col[key].replaceAll("<", '&lt;').replaceAll(">", '&gt;');
                }
              });
            }
          });
        }
      });
    }
    return payload;
  }

  parseText(result) {
    if (result?.response?.length > 0) {
      result.response.forEach(ques => {
        if (Object.keys(ques.length > 0)) {
          Object.keys(ques).forEach(key => {
            if (typeof ques[key] === 'string') {
              let check = ques[key].includes("&lt;");
              if (check == true) {
                ques[key] = ques[key].replaceAll("&lt;", '<')
              }

              let check2 = ques[key].includes("&gt;");
              if (check2 == true) {
                ques[key] = ques[key].replaceAll("&gt;", '>');
              }
            }
          });
        }

        if (ques.rowOptionList.length > 0) {
          ques.rowOptionList.forEach(row => {
            if (Object.keys(row.length > 0)) {
              Object.keys(row).forEach(key => {
                if (typeof row[key] === 'string') {
                  let check = row[key].includes("&lt;");
                  if (check == true) {
                    row[key] = row[key].replaceAll("&lt;", '<')
                  }

                  let check2 = row[key].includes("&gt;");
                  if (check2 == true) {
                    row[key] = row[key].replaceAll("&gt;", '>');
                  }
                }
              });
            }
          });
        }

        if (ques.colOptionList.length > 0) {
          ques.colOptionList.forEach(col => {
            if (Object.keys(col.length > 0)) {
              Object.keys(col).forEach(key => {
                if (typeof col[key] === 'string') {
                  let check = col[key].includes("&lt;");
                  if (check == true) {
                    col[key] = col[key].replaceAll("&lt;", '<')
                  }

                  let check2 = col[key].includes("&gt;");
                  if (check2 == true) {
                    col[key] = col[key].replaceAll("&gt;", '>');
                  }
                }
              });
            }
          });
        }
      });
    }
    return result;
  }
}
