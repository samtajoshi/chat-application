import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//importing feature modules
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';

import { RouterModule } from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { CookieService } from 'ng2-cookies';
import { HttpClientModule } from '@angular/common/http';
//importing toaster related modules
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ChatModule,
    UserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot() ,
    RouterModule.forRoot([
      {path : 'login' , component : LoginComponent, pathMatch :'full'},
      {path : '', component : LoginComponent},
      {path : '*', component :LoginComponent},
      {path : '**', component : LoginComponent},
    ])
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
