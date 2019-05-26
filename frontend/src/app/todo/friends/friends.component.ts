import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Cookie } from "ng2-cookies";
import { UserService } from "src/app/services/user.service";
import { ToastrService } from "ngx-toastr";
import { SocketService } from "src/app/services/socket.service";

declare var $;

@Component({
  selector: "app-friends",
  templateUrl: "./friends.component.html",
  styleUrls: ["./friends.component.css"]
})
export class FriendsComponent implements OnInit {
  public cancelRequest: boolean = false;
  public findFriends: boolean = false;
  public receivedRequest: boolean = false;
  public authToken: any;
  public userId: any;
  public userName: any;
  public userInfo: any;

  public allFriendsList: [] = [];
  public allUsersList: [] = [];
  public allSentRequestsList: [] = [];
  public allReceivedRequestsList: [] = [];

  constructor(
    public router: Router,
    public userService: UserService,
    private toastr: ToastrService,
    public socketService: SocketService
  ) {}

  ngOnInit() {
    this.authToken = Cookie.get("authToken");
    this.userId = Cookie.get("receiverId");
    this.userName = Cookie.get("receiverName");
    this.userInfo = this.userService.getUserInfoFromLocalStorage();
    this.allFriendsList = this.userInfo.friends;
    this.findFriends = true;
    this.getAllUsers();
    this.getAllSentRequests();
    this.getAllReceivedRequests();
    this.getAllFriends();
    this.listUpdateNotification();
    this.taskUpdateNotification();
    this.subTakUpdateNotification();
  }

  public mobileNavHandler(): any {
    $(".backdrop").fadeIn();
    $(".mobile-nav").fadeIn(300);
  }

  public closeMobileNav(): any {
    $(".backdrop").fadeOut(100);
    $(".mobile-nav").fadeOut(300);
  }

  public onClickOnLogo(event) {
    event.preventDefault();
  }

  public onClickOnHome(): any {
    this.router.navigate(["/user"]);
  }

  public onClickFindFriends() {
    this.cancelRequest = false;
    this.findFriends = true;
    this.receivedRequest = false;
  }

  public onClickSentReq() {
    this.cancelRequest = true;
    this.findFriends = false;
    this.receivedRequest = false;
    this.closeMobileNav();
    this.getAllSentRequests();
  }

  public onClickReceivedReq() {
    this.cancelRequest = false;
    this.findFriends = false;
    this.receivedRequest = true;
    this.closeMobileNav();
    this.getAllReceivedRequests();
  }

  public onClickOnNotifications() {
    this.router.navigate(["/notifications"]);
  }

  public getAllUsers(): any {
    this.userService.getAllUsers(this.authToken).subscribe(
      response => {
        if (response.status === 200) {
          this.allUsersList = response.data;
        } else {
          this.toastr.warning(response.message);
        }
      },
      err => {
        this.toastr.error("Error Occoured");

        this.router.navigate(["/error"]);
      }
    );
  }

  public getAllFriends(): any {
    this.userService.getUser(this.userId, this.authToken).subscribe(
      response => {
        if (response.status === 200) {
          this.allFriendsList = response.data.friends;
        } else {
          this.toastr.warning(response.message);
        }
      },
      err => {
        this.toastr.error("Error Occoured");

        this.router.navigate(["/error"]);
      }
    );
  }

  public sendFriendRequest(user): any {
    let obj = {
      senderId: this.userId,
      senderName: this.userName,
      receiverId: user.userId,
      receiverName: `${user.firstName} ${user.lastName}`,
      authToken: this.authToken
    };

    this.userService.sendRequest(obj).subscribe(
      response => {
        if (response.status === 200) {
          this.toastr.success(response.message);
        } else {
          this.toastr.warning(response.message);
        }
      },
      err => {
        this.toastr.error("Error Occoured");

        this.router.navigate(["/error"]);
      }
    );
  }

  public getAllSentRequests(): any {
    this.userService.getAllSentRequests(this.userId, this.authToken).subscribe(
      response => {
        if (response.status === 200) {
          this.allSentRequestsList = response.data[0].friendRequestSent;
        } else {
          this.toastr.warning(response.message);
        }
      },
      err => {
        this.toastr.error("Error Occoured");

        this.router.navigate(["/error"]);
      }
    );
  }

  public getAllReceivedRequests(): any {
    this.userService
      .getAllReceivedRequests(this.userId, this.authToken)
      .subscribe(
        response => {
          if (response.status === 200) {
            this.allReceivedRequestsList =
              response.data[0].friendRequestRecieved;
          } else {
            this.toastr.warning(response.message);
          }
        },
        err => {
          this.toastr.error("Error Occoured");

          this.router.navigate(["/error"]);
        }
      );
  }

  public cancelFriendRequest(request): any {
    let obj = {
      senderId: this.userId,
      senderName: this.userName,
      receiverId: request.friendId,
      receiverName: request.friendName,
      authToken: this.authToken
    };
    this.userService.cancelRequest(obj).subscribe(
      response => {
        if (response.status === 200) {
          this.toastr.success(response.message);
          this.getAllSentRequests();
        } else {
          this.toastr.warning(response.message);
        }
      },
      err => {
        this.toastr.error("Error Occoured");

        this.router.navigate(["/error"]);
      }
    );
  }

  public rejectFriendRequest(request): any {
    let obj = {
      senderId: request.friendId,
      senderName: request.friendName,
      receiverId: this.userId,
      receiverName: this.userName,
      authToken: this.authToken
    };
    this.userService.rejectRequest(obj).subscribe(
      response => {
        if (response.status === 200) {
          this.toastr.success(response.message);
          this.getAllReceivedRequests();
        } else {
          this.toastr.warning(response.message);
        }
      },
      err => {
        this.toastr.error("Error Occoured");

        this.router.navigate(["/error"]);
      }
    );
  }

  public acceptFriendRequest(request): any {
    let obj = {
      senderId: request.friendId,
      senderName: request.friendName,
      receiverId: this.userId,
      receiverName: this.userName,
      authToken: this.authToken
    };
    this.userService.acceptRequest(obj).subscribe(
      response => {
        if (response.status === 200) {
          this.toastr.success(response.message);
          //his.getAllReceivedRequests();
        } else {
          this.toastr.warning(response.message);
        }
      },
      err => {
        this.toastr.error("Error Occoured");

        this.router.navigate(["/error"]);
      }
    );
  }

  public unfriendUser(friend): any {
    let obj = {
      senderId: this.userId,
      senderName: this.userId,
      receiverId: friend.friendId,
      receiverName: friend.friendName,
      authToken: this.authToken
    };
    this.userService.unfriend(obj).subscribe(
      response => {
        if (response.status === 200) {
          this.toastr.success(response.message);
          this.getAllFriends();
          //his.getAllReceivedRequests();
        } else {
          this.toastr.warning(response.message);
        }
      },
      err => {
        this.toastr.error("Error Occoured");

        this.router.navigate(["/error"]);
      }
    );
  }

  public subTakUpdateNotification(): any {
    this.socketService.updateSubtask().subscribe(
      response => {
        this.toastr.success(
          `Subtask ${response.data.data} is updated by ${
            response.data.creatorName
          }`
        );
      },
      err => {
        this.toastr.error("Error Occured");
      }
    );
  }

  public taskUpdateNotification(): any {
    this.socketService.updateTask().subscribe(
      response => {
        this.toastr.success(
          `Task ${response.data.data} is updated by ${
            response.data.creatorName
          }`
        );
      },
      err => {
        this.toastr.error("Error Occured");
      }
    );
  }

  public listUpdateNotification(): any {
    this.socketService.updateList().subscribe(
      response => {
        this.toastr.success(
          `List ${response.data.data} is updated by ${
            response.data.creatorName
          }`
        );
      },
      err => {
        this.toastr.error("Error Occured");
      }
    );
  }

  public gotoFriendList(friend): any {
    this.userService.viewFriendList.next("list");
    this.userService.viewFriend(friend.friendId);
  }
}
