import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ng2-cookies';
import { AppService } from 'src/app/app.service';
import { SocketService } from 'src/app/socket.service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers : [SocketService]
})
export class ChatBoxComponent implements OnInit {
  public authToken:any;  
  public receiverId : any;
  public receiverName :any;
  public userInfo :any;
  public disconnectedSocket : boolean;
  public userList :any;

  //constructor
  constructor(public cookieService : CookieService,public appService : AppService,public socketService : SocketService) { 
    this.authToken = cookieService.get('authToken');
    this.receiverName = cookieService.get('receiverName');
    this.receiverId = cookieService.get('receiverId');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.userList = [];
  }

  //ngOnInit()
  ngOnInit() {
    this.verifyUserConfirmation();
    
  }

  //verifyUserConfirmation()
  public verifyUserConfirmation():any{
    this.socketService.setUser(this.authToken);
    this.socketService.verifyUser().subscribe(
      data => { this.disconnectedSocket = false;
                this.getOnlineUserList();
      }
    );
  } //end of verifyUserConfirmation()

  public getOnlineUserList :any = () =>{
    this.socketService.onlineUserList().subscribe(

      userList => {
        this.userList = [];
        for(let x in userList){
          let temp = {
            'userId' : x,
            'name' : userList[x],
            'unread' : 0,
            'chatting' : false
          };
          this.userList.push(temp);
        }
        console.log(this.userList);
      }

    );
  }   //end of getOnlineUserList()

}
