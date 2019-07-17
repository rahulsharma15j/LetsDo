import { Component, OnInit, OnChanges } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { SocketService } from "src/app/services/socket.service";
import { ToastrService } from "ngx-toastr";
import { ListService } from "src/app/services/list.service";
import { Router } from "@angular/router";
import { Cookie } from "ng2-cookies";

declare var $;

@Component({
  selector: "app-root",
  templateUrl: "./root.component.html",
  styleUrls: ["./root.component.css"]
})
export class RootComponent implements OnInit {
  public authToken: string;
  public userId: string;
  public userName: string;
  public userInfo: any;

  public list: boolean = false;
  public friends: boolean = false;
  public notifications: boolean = false;
  public viewFriend: boolean = false;
  public showDot: boolean = false;

  constructor(
    public userService: UserService,
    public socketService: SocketService,
    private toastr: ToastrService,
    public listService: ListService,
    public router: Router
  ) {}

  ngOnInit() {
    this.authToken = Cookie.get("authToken");
    this.userId = Cookie.get("receiverId");
    this.userName = Cookie.get("receiverName");
    this.userInfo = this.userService.getUserInfoFromLocalStorage();
    this.list = true;
    this.verifyUser();
    this.notifyUser();

    this.userService.viewFriendList.subscribe(val => {
      if (val == "list") {
        this.userService.selectedFriendId.subscribe(friendId => {
          this.friends = false;
          this.list = false;
          this.notifications = false;
          this.viewFriend = true;
          this.router.navigate([`/root/view/friend/${friendId}`]);
        });
      }
    });
    this.userService.showNotificationDot.subscribe(val => {
      if (val == "dot") {
        this.userService.data.subscribe(friendId => {
          if (this.userId === friendId) {
            this.showDot = true;
          }
        });
      }
    });
  }

  onClickOnLink(event) {
    event.preventDefault();
    this.router.navigate(["/root/user/list"]);
  }
  public mobileNavHandler(): any {
    $(".backdrop").fadeIn();
    $(".mobile-nav").animate({ left: "20%" }, 400);
  }

  public closeMobileNav(): any {
    $(".backdrop").fadeOut(100);
    $(".mobile-nav").animate({ left: "100%" }, 400);
  }

  public gotoList(): any {
    this.friends = false;
    this.viewFriend = false;
    this.notifications = false;
    this.list = true;
    this.router.navigate(["/root/user/list"]);
    this.closeMobileNav();
  }

  public gotoFriends(): any {
    this.list = false;
    this.notifications = false;
    this.viewFriend = false;
    this.friends = true;
    this.router.navigate(["/root/friends"]);
    this.closeMobileNav();
  }

  public gotoNotifications(): any {
    this.showDot = false;
    this.friends = false;
    this.list = false;
    this.viewFriend = false;
    this.notifications = true;
    this.router.navigate(["/root/notifications"]);
    this.closeMobileNav();
  }

  public verifyUser(): any {
    this.socketService.verifyUser().subscribe(
      () => {
        this.socketService.setUser(this.authToken);
      },
      err => {
        this.toastr.error("Error Occured");
      }
    );
  }

  public logOutUser(): any {
    this.userService.logOut(this.authToken).subscribe(
      response => {
        if (response.status === 200) {
          Cookie.delete("authToken");
          Cookie.delete("receiverId");
          Cookie.delete("receiverName");
          this.socketService.disconnectUser();
          this.socketService.exitSocket();
          setTimeout(() => {
            this.router.navigate(["/login"]);
          }, 500);
          this.closeMobileNav();
        } else {
          this.toastr.warning(`${response.message}`, "ERROR");
          this.closeMobileNav();
        }
      },
      err => {
        this.toastr.error("Some error occurred.", "ERROR");
        this.router.navigate(["/error"]);
        this.closeMobileNav();
      }
    );
  }

  public updateNotification(): any {
    this.userService.notifyUser.next("notify");
  }

  public reloadList(): any {
    this.userService.loadList.next("load");
  }

  public notifyUser(): any {
    this.socketService.notifyUser().subscribe(
      response => {
        if (this.userId === response.userId) {
          this.updateNotification();
          this.reloadList();
          this.toastr.success(response.data);
        }
      },
      err => {
        this.toastr.error("Error Occured");
      }
    );
  }
}
