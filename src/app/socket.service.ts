import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { CookieService } from 'ng2-cookies';



@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket :any;
  public url = 'https://chatapi.edwisor.com';

  constructor(public http : HttpClient, public cookie : CookieService) {
    //handshake is made
    //connection is being created
    this.socket = io(this.url);
   }

   //events to be listened
   public verifyUser :any =() => {
     return Observable.create((observer)=>{
       this.socket.on("verifyUser",(data) => {
         observer.next(data);
       })
     })
   }   //end of verifyUser()

   public onlineUserList :any =() => {
    return Observable.create((observer)=>{
      this.socket.on("online-user-list",(data) => {
        observer.next(data);
      })
    })
  }   //end of onlineUserList()


  public disconnectedSocket :any =() => {
    return Observable.create((observer)=>{
      this.socket.on("disconnect",() => {
        observer.next();
      })
    })
  }   //end of disconnectedSocket()


  public chatByUserId : any = (userId) =>{
    return Observable.create((observer) =>{
    this.socket.on(userId, (data)=>{
      observer.next(data);
    })
  })
  }//end of chatByUserId()

  //end of events to be listened

  //events to be emitted
  public setUser :any =(authToken) => {
    this.socket.emit("set-user",authToken);
  }//end of setUser()

  public sendChatMessage :any = (data) => {
    this.socket.emit("chat-msg",data);
  }//end of sendChatMessage()

  public markChatAsSeen : any =(data) =>{
    this.socket.emit("mark-chat-as-seen",data);
  }//end of markChatAsSeen()

  //end of events to be emitted

  //event of diconnecting the socket
  public exitSocket :any =() =>{
    this.socket.disconnect();
  }

//method requesting to get paginated chats of user
public getChat(senderId,receiverId,skip):any{
  return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${this.cookie.get('authToken')}`)
 
} 

  //method for error handling
  private handleError(err : HttpErrorResponse){
    let errorMessage = '';

    if(err.error instanceof Error){
      errorMessage = `An error occured : ${err.error.message}`;
    }
    else{
      errorMessage = `Server returned code : ${err.status}, Error message is : ${err.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }     //end of handleError()

}
