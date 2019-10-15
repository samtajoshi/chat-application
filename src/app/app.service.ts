import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';

import { CookieService } from 'ng2-cookies';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private baseUrl :any;

  constructor(public http : HttpClient,public cookie :CookieService ) {
    this.baseUrl = 'https://chatapi.edwisor.com/api/v1';
   }

   //function to set userInfo in localStorage
   public setUserInfoInLocalStorage = (data) =>{
     localStorage.setItem('userInfo',JSON.stringify(data));
   }

   //function to get userInfo from localStorage
   public getUserInfoFromLocalStorage() :any{
     return JSON.parse(localStorage.getItem('userInfo'));
   }

   //signupFunction()
  public signupFunction(data) :any {

    const params = new HttpParams()
    .set('firstName', data.firstName)
    .set('lastName', data.lastName)
    .set('mobile',data.mobile)
    .set('email', data.email)
    .set('password',data.password)
    .set('apiKey',data.apiKey);

    return this.http.post(this.baseUrl+'/users/signup',params);
  }  //end of signUp function()

  //signIn Function
  public signInFunction(data) :any{

    const params = new HttpParams()
    .set('email', data.email)
    .set('password', data.password);

    return this.http.post(this.baseUrl+'/users/login',params);

  }   //end of signInFunction

  private handleError(err : HttpErrorResponse){
    let msg ='';
    if(err.error instanceof Error) {
      msg = `An error occured : ${err.error.message}`;
      alert(msg);
    }
  }    //end og handleError function()

  
}
