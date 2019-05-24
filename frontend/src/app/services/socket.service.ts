import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import * as io from "socket.io-client";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SocketService {
  public baseUrl: string = "http://localhost:3000";
  private socket: any;
  constructor(private http: HttpClient) {
    this.socket = io(this.baseUrl);
  }

  public setUser(authToken): any {
    this.socket.emit("set-user", authToken);
  }

  public sendNotification(data): any {
    this.socket.emit("notification", data);
  }

  public disconnectUser(): any {
    this.socket.emit("disconnect", "");
  }

  public exitSocket(): any {
    this.socket.disconnect();
  }

  /**
   * Listening Events
   */
  public verifyUser(): any {
    return Observable.create(observer => {
      this.socket.on("verify-user", data => {
        observer.next(data);
      });
    });
  }

  public onlineUsersList(): any {
    return Observable.create(observer => {
      this.socket.on("online-user-list", userList => {
        observer.next(userList);
      });
    });
  }

  public disconnectSocket(): any {
    return Observable.create(observer => {
      this.socket.on("disconnect", () => {
        observer.next();
      });
    });
  }

  public authError(): any {
    return Observable.create(observer => {
      this.socket.on("auth-error", data => {
        observer.next(data);
      });
    });
  }

  public updateList(): any {
    return Observable.create(observer => {
      this.socket.on("Update-list", data => {
        observer.next(data);
      });
    });
  }

  public updateTask(): any {
    return Observable.create(observer => {
      this.socket.on("Update-task", data => {
        observer.next(data);
      });
    });
  }

  public updateSubtask(): any {
    return Observable.create(observer => {
      this.socket.on("Update-subtask", data => {
        observer.next(data);
      });
    });
  }
}
