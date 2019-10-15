import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket :any;
  public url = 'http://chatapi.edwisor.com';

  constructor() {
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
  //end of events to be listened

  //events to be emitted
  public setUser :any =(authToken) => {
    this.socket.emit("set-user",authToken);
  }//end of setUser()

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
