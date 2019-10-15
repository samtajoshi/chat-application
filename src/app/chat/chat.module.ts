import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from './chat-box/chat-box.component';
//routing
import { RouterModule } from '@angular/router';





@NgModule({
  declarations: [ChatBoxComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path : 'chat-box', component : ChatBoxComponent}
    ])
  ]
})
export class ChatModule { }
