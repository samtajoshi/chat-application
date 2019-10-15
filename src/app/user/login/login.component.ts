import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CookieService } from 'ng2-cookies';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email:any;
  public password:any;


  constructor(public appService : AppService,public router : Router,public toastr : ToastrService, public cookieService :CookieService) { }

  ngOnInit() {
  }

  //function to navigate page to sign-up page
  public goToSignup(){
    this.router.navigate(['/sign-up']);
  }

  //login function
   public signinFunction(){
     let info = {
       email : this.email,
       password : this.password,
     };
     
     this.appService.signInFunction(info).subscribe(
       response =>{
         if(response.status===200){
         this.toastr.success('login successful - '+response.message);
         this.cookieService.set('authToken', response.data.authToken);
         this.cookieService.set('receiverId', response.data.userDetails.userId);
         this.cookieService.set('receiverName', response.data.userDetails.firstName+' '+response.data.userDetails.lastName);
         this.appService.setUserInfoInLocalStorage(response.data.userDetails);
         this.router.navigate(['/chat-box']);
         }
         else{
          this.toastr.success('login failed- '+response.message);
         }
      },
      error => {
        this.toastr.error('some error occured');
      }
     );
   }
}
