import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { SocketService } from "src/app/services/socket.service";
import { ToastrService } from "ngx-toastr";
import { ListService } from "src/app/services/list.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Cookie } from "ng2-cookies";

@Component({
  selector: "app-view-friend-list",
  templateUrl: "./view-friend-list.component.html",
  styleUrls: ["./view-friend-list.component.css"]
})
export class ViewFriendListComponent implements OnInit {
  @ViewChild("closeModal") closeModal: ElementRef;

  public authToken: string;
  public userId: string;
  public userName: string;
  public userInfo: any;

  public listName: string;
  public taskName: string;
  public subTaskName: string;
  public updateSubTaskName: string;
  public updateTaskName: string;
  public updateListName: string;
  public listDetails: any;
  public name: string;
  public dropDown: boolean = false;
  public addTask: boolean = false;
  public addSubTask: boolean = false;
  public editSubTask: boolean = false;
  public showTask: boolean = false;
  public showList: boolean = false;
  public listId: string;
  public taskId: string;
  public subTaskId: string;
  public friendId: string;
  public friendDetails: any;
  public friendName: string;

  public allLists: [] = [];
  public allTasks: [] = [];
  public showListType = ["All Lists", "Public", "Private"];
  public listMode = ["Public", "Private"];
  public selectedListMode: string = "";
  list: any;

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
    this.userInfo = this.userService.getUserInfoFromLocalStorage();
    this.selectedListMode = this.listMode[1];
    this.friendId = this._route.snapshot.paramMap.get("friendId");
    this.verifyUser();
    this.getSingleUser(this.friendId);
    this.getAllList();
    this.listUpdateNotification();
    this.taskUpdateNotification();
    this.subTakUpdateNotification();
  }

  public onClickOnFriends(): any {
    this.router.navigate(["/friends"]);
  }

  public onClickOnNotifications(): any {
    this.router.navigate(["/notifications"]);
  }

  public onClickOnMode(): any {
    this.dropDown = true;
  }

  public onSelectMode(mode): any {
    this.selectedListMode = mode;
    this.dropDown = false;
  }
  public onClickOnCancel(): any {
    this.addTask = false;
    this.addSubTask = false;
    this.listId = "";
  }

  public onClickOnNo(): any {
    this.closeModal.nativeElement.click();
  }

  public onClickOnAdd(list): any {
    this.list = list;
    this.listId = list.listId;
    this.addTask = true;
  }

  public onClickOnAddSubTask(task): any {
    this.addSubTask = true;
    this.showTask = true;
    this.taskId = task.itemId;
  }

  public onClickOnEditSubTask(subTask, task, list): any {
    this.editSubTask = true;

    this.list = list;
    this.taskId = task.itemId;
    this.subTaskId = subTask.subItemId;
    this.updateSubTaskName = subTask.subItemName;
  }

  public onClickOnCancelSubTask(): any {
    this.taskId = "";
    this.subTaskId = "";
  }

  public onClickOnEditTask(task, list): any {
    this.taskId = task.itemId;
    this.list = list;
    this.updateTaskName = task.itemName;
  }

  public onClickOnCancelTask(): any {
    this.taskId = "";
  }

  public onClickOnEditList(list): any {
    this.showList = true;
    this.listId = list.listId;
    this.updateListName = list.listName;
  }

  public onClickOnCancelList(): any {
    this.listId = "";
    this.showList = false;
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

  public getAllList(): any {
    this.listService.getAllPublicList(this.friendId, this.authToken).subscribe(
      response => {
        if (response.status === 200) {
          this.allLists = response.data;
          if (this.allLists) {
            for (let list of this.allLists) {
              this.getAllTask(list);
            }
          } else {
            this.allLists.length = 0;
          }
        } else {
          this.toastr.warning(response.message);
          this.allLists.length = 0;
        }
      },
      err => {
        this.toastr.error("Error Occoured");
        this.allLists.length = 0;
        this.router.navigate(["/error"]);
      }
    );
  }

  public getAllTask(list): any {
    this.listService.getAllTask(list.listId, this.authToken).subscribe(
      response => {
        if (response.status === 200) {
          this.allTasks = response.data;
          //console.log(this.allTasks);
          if (this.allTasks) {
            list["tasks"] = this.allTasks;
          } else {
            list["tasks"] = [];
          }
        } else {
          this.allTasks.length = 0;
        }
      },
      err => {
        this.toastr.error("Error Occoured");
        this.allTasks.length = 0;
        this.router.navigate(["/error"]);
      }
    );
  }

  public updateSubTask(subItem): any {
    let obj = {
      subItemId: subItem.subItemId,
      subItemName: this.updateSubTaskName,
      modifierId: this.userId,
      modifierName: this.userName,
      friendId: this.friendId,
      friendName: this.friendName,
      authToken: this.authToken
    };
    this.listService.updateFriendSubtask(obj, this.taskId).subscribe(
      response => {
        if (response.status === 200) {
          this.toastr.success(response.message);

          this.getAllTask(this.list);
          this.subTaskId = "";
          this.updateSubTaskName = "";
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

  public updateTask(): any {
    let obj = {
      itemId: this.taskId,
      itemName: this.updateTaskName,
      itemModifierId: this.userId,
      itemModifierName: this.userName,
      friendId: this.friendId,
      friendName: this.friendName,
      authToken: this.authToken
    };

    this.listService.updateFriendTask(obj).subscribe(
      response => {
        if (response.status === 200) {
          this.toastr.success(response.message);

          this.getAllTask(this.list);
          this.taskId = "";
          this.updateTaskName = "";
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

  public updateList(): any {
    let obj = {
      listId: this.listId,
      listName: this.updateListName,
      modifierId: this.userId,
      modifierName: this.userName,
      friendId: this.friendId,
      friendName: this.friendName,
      authToken: this.authToken
    };

    this.listService.updateFriendList(obj).subscribe(
      response => {
        if (response.status === 200) {
          this.toastr.success(response.message);
          this.getAllList();
          this.listId = "";
          this.updateListName = "";
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

  public getSingleList(listId): any {
    this.listService.getList(listId, this.authToken).subscribe(
      response => {
        if (response.status === 200) {
          this.list = response.data;
          this.getAllTask(this.list);
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

  public getSingleUser(friendId): any {
    this.userService.getUser(friendId, this.authToken).subscribe(
      response => {
        if (response.status === 200) {
          this.friendDetails = response.data;
          this.friendName = `${this.friendDetails.firstName} ${
            this.friendDetails.lastName
          }`;
          console.log(this.friendName);
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
    this.socketService.verifyUser().subscribe(
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
    this.socketService.verifyUser().subscribe(
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
}
