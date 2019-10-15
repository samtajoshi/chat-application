import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email:any;
  public password:any;


  constructor(public appService : AppService,public router : Router,public toastr : ToastrService) { }

  ngOnInit() {
  }

  public goToSignup(){
    this.router.navigate(['/sign-up']);
  }

   public signinFunction(){
     let data = {
       email : this.email,
       password : this.password
     }
     this.appService.signInFunction(data).subscribe(
       response =>{
         if(response["status"]===200){
         this.toastr.success('login successful - '+response["message"]);
         this.router.navigate(['/chat-box']);
         }
         else{
          this.toastr.success('login failed- '+response["message"]);
         }
      },
      error => {
        this.toastr.error('some error occured');
      }
     );
   }
}
