import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"]
})
export class ForgotPasswordComponent implements OnInit {
  public email: any;

  constructor(
    private toastr: ToastrService,
    public userService: UserService,
    public router: Router
  ) {}

  ngOnInit() {}

  public onClickOnLogo(event): any {
    event.preventDefault();
  }

  public gotoLogIn(): any {
    this.router.navigate(["/login"]);
  }

  public gotoSignUp(): any {
    this.router.navigate(["/"]);
  }

  public sendRecoveryEmail(): any {
    if (!this.email) {
      this.toastr.warning("PLEASE ENTER YOUR EMAIL ");
    } else if (!this.userService.validateEmail(this.email)) {
      this.toastr.warning("PLEASE ENTER VALID EMAIL");
    } else {
      let reset = {
        email: this.email
      };
      this.userService.resetPassword(reset).subscribe(
        response => {
          if (response.status === 200) {
            this.toastr.success("PASSWORD RECOVERY EMAIL SENT");
            this.router.navigate(["/login"]);
          } else {
            this.toastr.error(`${response.message}`);
            this.router.navigate(["/login"]);
          }
        },
        err => {
          this.toastr.error("INTERNAL SERVER ERROR");
          this.router.navigate(["/error"]);
        }
      );
    }
  }
}
