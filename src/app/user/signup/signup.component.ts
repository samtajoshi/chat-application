import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import {ActivatedRoute , Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public firstName :any;
  public lastName :any;
  public mobile : any;
  public email :any;
  public password :any;
  public apiKey : any;

  constructor(public appService : AppService, public router : Router, public toastr : ToastrService,) { }

  ngOnInit() {
  }

  //goToSignIn function
  public goToSignIn(){
    this.router.navigate(['/']);
  }

  //signup Function
  public signupFunction(){

    let data = {
      firstName: this.firstName,
      lastName: this.lastName,
      mobile: this.mobile,
      email: this.email,
      password: this.password,
      apiKey: this.apiKey
    }

    this.appService.signupFunction(data).subscribe(
      response => {
        if(response["status"]===200){
          this.toastr.success('signin successfull '+response["message"]);
          this.goToSignIn();
        }
        else{
          this.toastr.error(response["message"]);
        }
      },
      error =>{this.toastr.error('some error occured')}
    );
      
        
      }
    
  }

