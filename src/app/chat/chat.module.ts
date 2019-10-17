import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from './chat-box/chat-box.component';
//routing
import { RouterModule , Routes} from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RemoveSpecialCharPipe } from '../shared/remove-special-char.pipe';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
//import { UserDetailsComponent } from '../shared/user-details/user-details.component';
//import { FirstCharComponent } from '../shared/first-char/first-char.component';





@NgModule({
  declarations: [ChatBoxComponent,RemoveSpecialCharPipe],
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    FormsModule,
    //UserDetailsComponent,
    //FirstCharComponent,
    RouterModule.forChild([
      {path : 'chat-box', component : ChatBoxComponent}
    ])
  ]
})
export class ChatModule { }
