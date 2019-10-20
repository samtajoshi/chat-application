import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CookieService } from 'ng2-cookies';
import { AppService } from 'src/app/app.service';
import { SocketService } from 'src/app/socket.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
//import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
//import { FirstCharComponent } from 'src/app/shared/first-char/first-char.component';




@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers : [SocketService]
})
export class ChatBoxComponent implements OnInit {
  // @ViewChild('modalContent', { static: true }) 
  // modalContent: TemplateRef<any>;

  //@ViewChild('scrollMe',  {read: ElementRef }) 
  @ViewChild('scrollMe',  {static :true})
  public scrollMe : ElementRef<any>;
  

  public authToken:any;  
  public receiverId : any;
  public receiverName :any;
  public userInfo :any;
  public disconnectedSocket : boolean;
  public userList :any;
  public messageText : any;
  public messageList :any;
  public scrollToChatTop : boolean;
  public pageValue : any;
  public loadingPreviousChat : any;

  //constructor
  constructor(public router : Router,public cookieService : CookieService,public appService : AppService,public socketService : SocketService,public toastr : ToastrService) { 
    this.authToken = cookieService.get('authToken');
    this.receiverName = cookieService.get('receiverName');
    this.receiverId = cookieService.get('receiverId');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.userList = [];
    this.messageList =[];
    this.scrollToChatTop = false;
    this.loadingPreviousChat = false;
  }

  //ngOnInit()
  ngOnInit() {
    this.receiverName = this.cookieService.get('receiverName');
    this.receiverId = this.cookieService.get('receiverId');
    console.log(this.receiverId,this.receiverName);

    if(this.receiverId!=null&&this.receiverId!=undefined&&this.receiverId!=''){
      this.userSelectedToChat(this.receiverId,this.receiverName);
    }
    this.verifyUserConfirmation();
    this.getOnlineUserList();
    this.getMessageFromAUser();
    
  }

  public checkStatus : any =() =>{
    if(this.userInfo.authToken===undefined||this.userInfo.authToken===null||this.userInfo.authToken===''){
      this.toastr.warning('authToken NOT valid');  
      this.router.navigate(['/']);
      return false;
    }
    else{
      return true;
    }
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

  //methods controlling the user button click function
  public userSelectedToChat : any =(id,name)=>{
    console.log('sending selected user as active');
    //to highlight particular user in online userList
    this.userList.map((user)=>{
      if(user.userId==id){
        user.chatting=true;
      }
      else{
        user.chatting = false;
      }
    })

    //to reset cookie information
    this.cookieService.set('receiverId',id);
    this.cookieService.set('receiverName',name);
    //to emit data in socket service
    let chatDetails = {
      userId : this.userInfo.userId,
      senderId : id
    }
    this.socketService.markChatAsSeen(chatDetails);
    this.messageList = [];
    this.pageValue = 0;
    this.receiverId = id;
    this.receiverName = name;
    this.getPreviousChatWithAUser();
  }  //end of userSelectedToChat()

  // method to show last 10 chat messages in chat-box
  public getPreviousChatWithAUser : any = ()=>{
   let previousChat= (this.messageList.length>0?this.messageList.slice() : []);
   this.socketService.getChat(this.userInfo.userId,this.cookieService.get('receiverId'),this.pageValue*10).subscribe(
     data =>{console.log(data)
       if(data.status===200){
         this.messageList = data.data.concat(previousChat);
         
       }
       else{
         this.messageList = previousChat;
         this.toastr.error('no messages available');
       }
       this.loadingPreviousChat = false;
     },
     err =>{
        this.toastr.error('some error occured: ');
     }
   );
  } //end getPreviousChatWithUser()

  //method to load previous messages on asking to load more
  public loadEarlierPageOfChat : any =() => {
    this.loadingPreviousChat = true;
    this.pageValue++;
    this.scrollToChatTop = true;
    this.getPreviousChatWithAUser();
  }   // end loadEarlierPageOfChat()



  //methods involved in sending any chat message

public sendMessageUsingKeyPress : any = (event : any) =>{
  if(event.keyCode===13){
    this.sendMessage();
  }
}

public sendMessage :any =()=>{
  if(this.messageText){
     let ChatMsgObject ={
       senderName : this.userInfo.firstName+" "+this.userInfo.lastName,
       senderId : this.userInfo.userId,
       receiverName : this.cookieService.get('receiverName'),
       receiverId : this.cookieService.get('receiverId'),
       message : this.messageText,
       createdOn : new Date()
     }
     console.log(ChatMsgObject);
     this.socketService.sendChatMessage(ChatMsgObject);
     this.pushToChatWindow(ChatMsgObject);
  }
  else{
    this.toastr.warning('Text message can not be empty');
  }
}  //end of sendMessage()

public pushToChatWindow :any =(data) =>{
  this.messageText = "";
  this.messageList.push(data);
  this.scrollToChatTop = false;

}   // end of pushToChatWindow()


//methods involved in receiving any message

public getMessageFromAUser : any =()=>{
  this.socketService.chatByUserId(this.userInfo.userId).subscribe(
    data =>{
      (this.receiverId==data.senderId)?this.messageList.push(data):'';
      this.toastr.success(`${data.senderName} : ${data.message}`)
      this.scrollToChatTop=false;
    }
  );
}  // end of getMessageFromAUser()

//logout function
public logout :any = ()=>{
  let data ={
    userId : this.userInfo.userId,
    authToken : this.cookieService.get('authToken'),
  }
  this.appService.logout(data).subscribe(
    data=>{
      if(data.status===200){
        console.log("logout called");
        this.cookieService.delete('authToken');
        this.cookieService.delete('receiverId');
        this.cookieService.delete('receiverName');
        this.socketService.exitSocket();
        this.router.navigate(['/']);
      }
      else{
        this.toastr.error(data.message);
      }
    },
    error =>{
        this.toastr.error('some Error occured , sorry!...');
    }
  );
}   //end logout()

public showUserName :any= (name:string) =>{
  this.toastr.success(`you are chatting with ${name}`)
}

}
