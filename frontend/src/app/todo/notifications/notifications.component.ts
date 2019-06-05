import { Component, OnInit } from "@angular/core";
import { Cookie } from "ng2-cookies";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { SocketService } from "src/app/services/socket.service";
import { ToastrService } from "ngx-toastr";
import { ListService } from "src/app/services/list.service";

declare var $;

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"]
})
export class NotificationsComponent implements OnInit {
  authToken: any;
  userId: any;
  userName: any;
  public allNotifications: [] = [];
  constructor(
    public userService: UserService,
    public socketService: SocketService,
    private toastr: ToastrService,
    public listService: ListService,
    public router: Router,
    public _route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authToken = Cookie.get("authToken");
    this.userId = Cookie.get("receiverId");
    this.userName = Cookie.get("receiverName");
    this.getNotifications();
    this.userService.notifyUser.subscribe(val => {
      if (val == "notify") {
        this.getNotifications();
        this.showNotification(this.userId);
      }
    });
  }

  public getNotifications(): any {
    this.listService.getAllNotifications(this.userId, this.authToken).subscribe(
      response => {
        if (response.status === 200) {
          this.allNotifications = response.data;
        } else {
          this.allNotifications = [];
          this.toastr.warning(response.message);
        }
      },
      err => {
        this.allNotifications = [];
        this.toastr.error("Error Occoured");
        this.router.navigate(["/error"]);
      }
    );
  }

  public deleteNotification(notificationId): any {
    this.listService
      .deleteNotification(notificationId, this.authToken)
      .subscribe(
        response => {
          if (response.status === 200) {
            this.toastr.success(response.message);
            this.getNotifications();
          } else {
            this.allNotifications = [];
            this.toastr.warning(response.message);
          }
        },
        err => {
          this.allNotifications = [];
          this.toastr.error("Error Occoured");
          this.router.navigate(["/error"]);
        }
      );
  }

  public showNotification(frindId): any {
    this.userService.showNotificationDot.next("dot");
    this.userService.notifyFriend(frindId);
  }
}
