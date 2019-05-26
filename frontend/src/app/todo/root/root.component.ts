import { Component, OnInit } from "@angular/core";
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

  constructor(
    public userService: UserService,
    public socketService: SocketService,
    private toastr: ToastrService,
    public listService: ListService,
    public router: Router
  ) {
    this.userService.viewFriendList.subscribe(val => {
      if (val == "list") {
        this.friends = false;
        this.list = false;
        this.notifications = false;
        this.viewFriend = true;
        this.router.navigate(["/root/user/list"]);
      }
    });
  }

  ngOnInit() {
    this.authToken = Cookie.get("authToken");
    this.userId = Cookie.get("receiverId");
    this.userName = Cookie.get("receiverName");
    this.userInfo = this.userService.getUserInfoFromLocalStorage();
    this.list = true;
    this.verifyUser();
    this.userService.viewFriendList.subscribe(val => {
      console.log(val);
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
  }
  onClickOnLink(event) {
    event.preventDefault();
  }
  public mobileNavHandler(): any {
    $(".backdrop").fadeIn();
    $(".mobile-nav").fadeIn(300);
  }

  public closeMobileNav(): any {
    $(".backdrop").fadeOut(100);
    $(".mobile-nav").fadeOut(300);
  }

  public gotoList(): any {
    this.friends = false;
    this.list = true;
    this.notifications = false;
    this.router.navigate(["/root/user/list"]);
  }

  public gotoFriends(): any {
    this.list = false;
    this.notifications = false;
    this.friends = true;
    this.router.navigate(["/root/friends"]);
  }

  public gotoNotifications(): any {
    this.friends = false;
    this.list = false;
    this.notifications = true;
    this.router.navigate(["/root/notifications"]);
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
        } else {
          this.toastr.warning(`${response.message}`, "ERROR");
        }
      },
      err => {
        this.toastr.error("Some error occurred.", "ERROR");
        this.router.navigate(["/error"]);
      }
    );
  }
}
