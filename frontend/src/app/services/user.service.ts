import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

import { HttpParams, HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class UserService {
  public baseUrl: string = "http://localhost:3000/api/v1";
  public popup: Subject<any> = new Subject<any>();

  public userType: any = "";
  public passwordRegex = /^[A-Za-z0-9]\w{7,}$/;
  public userNameRegex = /^[a-zA-Z0-9\@\-\_]{8,}$/;
  public emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(private http: HttpClient) {}

  /**
   * Setting user information to local storage.
   */
  public setUserInfoInLocalStorage = data => {
    localStorage.setItem("userInfo", JSON.stringify(data));
  };

  /**
   * Getting user information from local storage.
   */
  public getUserInfoFromLocalStorage: any = () => {
    return JSON.parse(localStorage.getItem("userInfo"));
  };

  /**
   * User login function.
   * @param data
   */
  public logIn(data): Observable<any> {
    const params = new HttpParams()
      .set(
        data.email ? "email" : "userName",
        data.email ? data.email : data.userName
      )
      .set("password", data.password);
    return this.http.post(`${this.baseUrl}/users/login`, params);
  }

  /**
   * To register user into database.
   * @param data
   */
  public signUp(data): Observable<any> {
    const params = new HttpParams()
      .set("firstName", data.firstName)
      .set("lastName", data.lastName)
      .set("mobile", data.mobile)
      .set("email", data.email)
      .set("userName", data.userName)
      .set("countryName", data.countryName)
      .set("password", data.password);
    return this.http.post(`${this.baseUrl}/users/signup`, params);
  }

  /**
   * To reset password.
   * @param data
   */
  public resetPassword(data): Observable<any> {
    const params = new HttpParams().set("email", data.email);
    return this.http.post(`${this.baseUrl}/users/reset-password`, params);
  }

  public verifyUser(userId): Observable<any> {
    const params = new HttpParams().set("userId", userId);
    return this.http.put(`${this.baseUrl}/users/verify`, params);
  }

  /**
   * To update user password.
   * @param data
   */
  public updatePassword(data): Observable<any> {
    const params = new HttpParams()
      .set("confirm", data.confirm)
      .set("resetToken", data.resetToken)
      .set("password", data.password);
    return this.http.put(`${this.baseUrl}/users/update-password`, params);
  }

  public getAllUsers(authToken): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/users/view/all?authToken=${authToken}`
    );
  }

  public getUser(userId, authToken): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/users/details/${userId}?authToken=${authToken}`
    );
  }

  public getCountryNames(): Observable<any> {
    return this.http.get("./../assets/country/name.json");
  }

  public getCountryNumbers(): Observable<any> {
    return this.http.get("./../assets/country/phone.json");
  }

  public logout(authToken): Observable<any> {
    const params = new HttpParams().set("authToken", authToken);
    return this.http.post(`${this.baseUrl}/users/logout`, params);
  }

  public validateEmail(email): boolean {
    if (email.match(this.emailRegex)) {
      return true;
    }
    return false;
  }

  public validateUserName(userName): boolean {
    if (userName.match(this.userNameRegex)) {
      return true;
    }
    return false;
  }

  public validatePassword(password): boolean {
    if (password.match(this.passwordRegex)) {
      return true;
    }
    return false;
  }

  public logOut(authToken): Observable<any> {
    const params = new HttpParams().set("authToken", authToken);
    return this.http.post(`${this.baseUrl}/users/logout`, params);
  }

  public sendRequest(obj): Observable<any> {
    const params = new HttpParams()
      .set("senderId", obj.senderId)
      .set("senderName", obj.senderName)
      .set("receiverId", obj.receiverId)
      .set("receiverName", obj.receiverName)
      .set("authToken", obj.authToken);
    return this.http.post(
      `${this.baseUrl}/multi-users/send/friend-request`,
      params
    );
  }

  public getAllSentRequests(userId, authToken): Observable<any> {
    return this.http.get(
      `${
        this.baseUrl
      }/multi-users/view/all/sent-requests/${userId}?authToken=${authToken}`
    );
  }

  public getAllReceivedRequests(userId, authToken): Observable<any> {
    return this.http.get(
      `${
        this.baseUrl
      }/multi-users/view/all/received-requests/${userId}?authToken=${authToken}`
    );
  }

  public cancelRequest(obj): Observable<any> {
    const params = new HttpParams()
      .set("senderId", obj.senderId)
      .set("senderName", obj.senderName)
      .set("receiverId", obj.receiverId)
      .set("receiverName", obj.receiverName)
      .set("authToken", obj.authToken);
    return this.http.post(
      `${this.baseUrl}/multi-users/cancel/friend-request`,
      params
    );
  }

  public rejectRequest(obj): Observable<any> {
    const params = new HttpParams()
      .set("senderId", obj.senderId)
      .set("senderName", obj.senderName)
      .set("receiverId", obj.receiverId)
      .set("receiverName", obj.receiverName)
      .set("authToken", obj.authToken);
    return this.http.post(
      `${this.baseUrl}/multi-users/reject/friend-request`,
      params
    );
  }

  public acceptRequest(obj): Observable<any> {
    const params = new HttpParams()
      .set("senderId", obj.senderId)
      .set("senderName", obj.senderName)
      .set("receiverId", obj.receiverId)
      .set("receiverName", obj.receiverName)
      .set("authToken", obj.authToken);
    return this.http.post(
      `${this.baseUrl}/multi-users/accept/friend-request`,
      params
    );
  }

  public unfriend(obj): Observable<any> {
    const params = new HttpParams()
      .set("senderId", obj.senderId)
      .set("senderName", obj.senderName)
      .set("receiverId", obj.receiverId)
      .set("receiverName", obj.receiverName)
      .set("authToken", obj.authToken);
    return this.http.post(`${this.baseUrl}/multi-users/unfriend`, params);
  }
}
