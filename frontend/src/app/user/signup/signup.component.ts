import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  public firstName: any;
  public lastName: any;
  public email: any;
  public userName: any;
  public mobile: any;
  public countryName: string;
  public password: any;

  public countryCode: string;
  public allCountriesPhones: any;
  public countriesList: any[] = [];

  constructor(
    public router: Router,
    private toastr: ToastrService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.getCountryPhones();
    this.createCountryList();
  }

  public onClickOnLogo(event): any {
    event.preventDefault();
  }

  public getCountryPhones(): any {
    this.userService.getCountryNumbers().subscribe(response => {
      this.allCountriesPhones = response;
    });
  }

  public createCountryList(): any {
    this.userService.getCountryNames().subscribe(response => {
      Object.keys(response).forEach(key => {
        this.countriesList.push({
          name: response[key],
          code: key,
          phone: this.allCountriesPhones[key]
        });
      });
      this.countriesList.sort((country1, country2) => {
        return country1.name.toLowerCase() > country2.name.toLowerCase()
          ? 1
          : -1;
      });
    });
  }

  public onSelectCountryName(code): any {
    this.countriesList.filter(obj =>
      obj["code"] == code ? (this.countryName = obj.name) : ""
    );
    this.countriesList.filter(obj =>
      obj["code"] == code ? (this.countryCode = obj.phone) : ""
    );
  }

  public createUser(): any {
    if (!this.firstName) {
      this.toastr.warning("PLEASE ENTER FIRST NAME");
    } else if (!this.lastName) {
      this.toastr.warning("PLEASE ENTER LAST NAME");
    } else if (!this.email) {
      this.toastr.warning("PLEASE ENTER YOUR EMAIL ");
    } else if (!this.userName) {
      this.toastr.warning("PLEASE ENTER USER NAME");
    } else if (!this.mobile) {
      this.toastr.warning("PLEASE ENTER MOBILE NUMBER");
    } else if (!this.countryName) {
      this.toastr.warning("PLEASE SELECT COUNTRY NAME");
    } else if (!this.password) {
      this.toastr.warning("PLEASE ENTER YOUR PASSWORD");
    } else if (!this.userService.validateEmail(this.email)) {
      this.toastr.warning("ENTERED EMAIL IS INVALID");
    } else if (!this.userService.validateUserName(this.userName)) {
      this.toastr.warning("USER NAME LENGTH 6 REQUIRED");
    } else if (!this.userService.validatePassword(this.password)) {
      this.toastr.warning("PASSWORD LENGTH 8 REQUIRED");
    } else {
      let newUserObj = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        userName: this.userName,
        countryName: this.countryName,
        mobile: this.countryCode + this.mobile,
        password: this.password
      };
      this.userService.signUp(newUserObj).subscribe(
        response => {
          if (response.status === 200) {
            this.toastr.success("Please check your email", "SUCCESS");
            this.router.navigate(["/login"]);
          } else {
            this.toastr.warning(`${response.message}`, "ERROR");
            this.router.navigate(["/"]);
          }
        },
        err => {
          this.toastr.warning("Error occurred", "ERROR");
          this.router.navigate(["/error"]);
        }
      );
    }
  }

  public onClickOnLogIn(): any {
    this.router.navigate(["/login"]);
  }
}
