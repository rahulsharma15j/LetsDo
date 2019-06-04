import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Cookie } from "ng2-cookies";
import { UserService } from "src/app/services/user.service";
import { SocketService } from "src/app/services/socket.service";
import { ToastrService } from "ngx-toastr";
import { ListService } from "src/app/services/list.service";
import { Router } from "@angular/router";
import { FilterPipe } from "ngx-filter-pipe";

declare var $;

@Component({
  selector: "app-single-user",
  templateUrl: "./single-user.component.html",
  styleUrls: ["./single-user.component.css"]
})
export class SingleUserComponent implements OnInit {
  @ViewChild("closeModal") closeModal: ElementRef;

  public createList: boolean = false;
  public authToken: string;
  public userId: string;
  public userName: string;
  public userInfo: any;
  public term: any;
  public listName: string;
  public taskName: string;
  public subTaskName: string;
  public updateSubTaskName: string;
  public updateTaskName: string;
  public updateListName: string;
  public listDetails: any;
  public name: string;
  public dropDown: boolean = false;
  public modal: boolean = false;
  public addTask: boolean = false;
  public addSubTask: boolean = false;
  public editSubTask: boolean = false;
  public showTask: boolean = false;
  public showList: boolean = false;
  public dropDownListType: boolean = false;
  public listId: string;
  public taskId: string;
  public subTaskId: string;

  public allLists: [] = [];
  public allTasks: [] = [];
  public showListType = ["All Lists", "Public", "Private"];
  public listMode = ["Public", "Private"];
  public selectedListMode: string = "";
  public listModeType: string = "";
  list: any;

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
    this.selectedListMode = this.listMode[1];
    this.listModeType = this.showListType[0];
    this.verifyUser();
    this.getAllList();
    this.userService.loadList.subscribe(val => {
      if (val == "load") {
        this.getAllList();
      }
    });
  }

  public onSelectListType(): any {
    this.dropDownListType = true;
  }

  public onSelectModeOfList(mode): any {
    this.listModeType = mode;
    this.dropDownListType = false;
    if (this.listModeType === "Public") {
      this.getAllPublicList();
    } else if (this.listModeType === "Private") {
      this.getAllPrivateList();
    } else {
      this.getAllList();
    }
  }

  public mobileNavHandler(): any {
    $(".backdrop").fadeIn();
    $(".mobile-nav").fadeIn(300);
  }

  public closeMobileNav(): any {
    $(".backdrop").fadeOut(100);
    $(".mobile-nav").fadeOut(300);
  }

  public onClickOnCreateList(): any {
    this.createList = true;
  }

  public onClickOnMode(): any {
    this.dropDown = true;
  }

  public onSelectMode(mode): any {
    this.selectedListMode = mode;
    this.dropDown = false;
  }
  public onClickOnCancel(): any {
    this.createList = false;
    this.addTask = false;
    this.addSubTask = false;
    this.listId = "";
  }

  public onClickOnClose(list): any {
    this.name = list.listName;
    this.listDetails = list;
    this.modal = true;
  }

  public onClickOnYes(): any {
    this.closeModal.nativeElement.click();
    this.deleteList(this.listDetails.listId);
  }

  public onClickOnNo(): any {
    this.closeModal.nativeElement.click();
  }

  public onClickOnAdd(list): any {
    this.list = list;
    this.listId = list.listId;
    this.addTask = true;
  }

  public onClickOnCloseTask(list, task): any {
    this.list = list;
    this.deleteTask(task);
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

  public onClickOnDeleteSubTask(list, task, subItem): any {
    this.list = list;
    this.deleteSubTask(task.itemId, subItem.subItemId);
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
    this.listService.getAllList(this.userId, this.authToken).subscribe(
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

  public getAllPublicList(): any {
    this.listService.getAllPublicList(this.userId, this.authToken).subscribe(
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

  public getAllPrivateList(): any {
    this.listService.getAllPrivateList(this.userId, this.authToken).subscribe(
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

  public createNewList(): any {
    if (!this.listName) {
      this.toastr.warning("PLEASE ENTER LIST NAME");
    } else {
      let newList = {
        listName: this.listName,
        creatorId: this.userId,
        creatorName: this.userName,
        modifierId: this.userId,
        modifierName: this.userName,
        mode: this.selectedListMode.toLowerCase()
      };

      this.listService.createList(newList, this.authToken).subscribe(
        response => {
          if (response.status === 200) {
            this.toastr.success(response.message);
            this.getAllList();
            this.selectedListMode = this.listMode[1];
            this.createList = false;
            this.listName = "";
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
  }

  public deleteList(listId): any {
    this.listService.deleteList(listId, this.authToken).subscribe(
      response => {
        if (response.status === 200) {
          this.toastr.success(response.message);
          this.getAllList();
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

  public createNewTask(): any {
    if (!this.taskName) {
      this.toastr.warning("PLEASE ENTER TASK NAME");
    } else {
      let newTask = {
        listId: this.listId,
        itemName: this.taskName,
        itemCreatorId: this.userId,
        itemCreatorName: this.userName,
        itemModifierId: this.userId,
        itemModifierName: this.userName
      };

      this.listService.createTask(newTask, this.authToken).subscribe(
        response => {
          if (response.status === 200) {
            this.toastr.success(response.message);
            this.taskName = "";
            this.addTask = false;
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

  public deleteTask(task): any {
    this.listService.deleteTask(task.itemId, this.authToken).subscribe(
      response => {
        if (response.status === 200) {
          this.toastr.success(response.message);
          //this.getAllList();
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

  public createNewSubTask(task, list): any {
    if (!this.subTaskName) {
      this.toastr.warning("PLEASE ENTER SUB TASK NAME");
    } else {
      let newSubTask = {
        itemId: task.itemId,
        subItemName: this.subTaskName,
        creatorId: this.userId,
        creatorName: this.userName,
        modifierId: this.userId,
        modifierName: this.userName
      };

      this.listService.createSubTask(newSubTask, this.authToken).subscribe(
        response => {
          if (response.status === 200) {
            this.toastr.success(response.message);
            this.getAllTask(list);
            this.taskId = "";
            this.subTaskName = "";
            this.addSubTask = false;
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
  }

  public deleteSubTask(itemId, subItemId): any {
    let obj = {
      authToken: this.authToken,
      subItemId: subItemId,
      subItemModifierId: this.userId,
      subItemModifierName: this.userName
    };
    this.listService.deleteSubTask(itemId, obj).subscribe(
      response => {
        if (response.status === 200) {
          this.toastr.success(response.message);
          //this.getAllList();
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

  public updateSubTask(subItem): any {
    console.log(subItem);
    let obj = {
      subItemId: subItem.subItemId,
      subItemName: this.updateSubTaskName,
      modifierId: this.userId,
      modifierName: this.userName,
      authToken: this.authToken
    };
    console.log(obj);
    this.listService.updateSubTask(obj, this.taskId).subscribe(
      response => {
        if (response.status === 200) {
          this.toastr.success(response.message);

          this.getAllTask(this.list);
          this.subTaskId = "";
          this.updateSubTaskName = "";
          //this.addSubTask = false;
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
      authToken: this.authToken
    };
    console.log(obj);
    this.listService.updateTask(obj).subscribe(
      response => {
        if (response.status === 200) {
          this.toastr.success(response.message);

          this.getAllTask(this.list);
          this.taskId = "";
          this.updateTaskName = "";
          //this.addSubTask = false;
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
      authToken: this.authToken
    };
    //console.log(obj);
    this.listService.updateList(obj).subscribe(
      response => {
        if (response.status === 200) {
          this.toastr.success(response.message);
          this.getAllList();
          this.listId = "";
          this.updateListName = "";
          //this.addSubTask = false;
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
}
