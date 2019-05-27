import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Cookie } from "ng2-cookies";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  public email: any;
  public userName: any;
  public password: any;
  fullName: string;

  constructor(
    private toastr: ToastrService,
    public userService: UserService,
    private router: Router
  ) {
    console.log("login called");
  }

  ngOnInit() {}

  public onClickOnLogo(event): any {
    event.preventDefault();
  }

  public gotoSignUp(): any {
    setTimeout(() => {
      this.router.navigate(["/"]);
    }, 500);
  }

  gotoForgotPassword(): any {
    setTimeout(() => {
      this.router.navigate(["/forgot"]);
    }, 500);
  }

  public logInUser(): any {
    let user = {};
    if (!this.email) {
      this.toastr.warning("PLEASE ENTER YOUR EMAIL OR USERNAME");
    } else if (!this.password) {
      this.toastr.warning("PLEASE ENTER YOUR PASSWORD");
    } else if (!this.userService.validatePassword(this.password)) {
      this.toastr.warning("PASSWORD LENGTH 8 REQUIRED");
    } else {
      this.userService.validateEmail(this.email)
        ? (user["email"] = this.email)
        : (user["userName"] = this.email);
      user["password"] = this.password;

      this.userService.logIn(user).subscribe(
        response => {
          if (response.status === 200) {
            this.fullName = `${response.data.userDetails.firstName} ${
              response.data.userDetails.lastName
            }`;
            this.userService.userType = response.data.userDetails.userType;
            this.userService.setUserInfoInLocalStorage(
              response.data.userDetails
            );
            Cookie.set("receiverId", response.data.userDetails.userId);
            Cookie.set("receiverName", this.fullName);
            Cookie.set("authToken", response.data.authToken);
            this.router.navigate(["/root/user/list"]);
          } else {
            this.router.navigate(["/login"]);
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
}
