import { Component, OnInit } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.css"]
})
export class ResetPasswordComponent implements OnInit {
  public password: any;
  public confirm: any;
  public resetToken: any;

  constructor(
    private toastr: ToastrService,
    public userService: UserService,
    private router: Router,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.resetToken = this.route.snapshot.paramMap.get("resetToken");
  }

  onClickOnLink(event) {
    event.preventDefault();
  }

  gotoLogIn() {
    this.router.navigate(["/login"]);
  }

  gotoSignUp() {
    this.router.navigate(["/"]);
  }

  public resetUserPassword(): any {
    if (!this.password) {
      this.toastr.warning("PASSWORD RQUIRED");
    } else if (!this.confirm) {
      this.toastr.warning("CONFIRM PASSWORD REQUIRED");
    } else if (this.password !== this.confirm) {
      this.toastr.warning("PASSWORD DOES NOT MATCHES");
    } else if (
      !this.userService.validatePassword(this.password) ||
      !this.userService.validatePassword(this.confirm)
    ) {
      this.toastr.warning("PASSWORD LENGTH 8 REQUIRED");
    } else {
      let password = {
        password: this.password,
        confirm: this.confirm,
        resetToken: this.resetToken
      };

      this.userService.updatePassword(password).subscribe(
        response => {
          if (response.status === 200) {
            this.toastr.success("PASSWORD UPDATED SUCCESSFULL");
          } else {
            this.toastr.warning(`${response.message}`);
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
