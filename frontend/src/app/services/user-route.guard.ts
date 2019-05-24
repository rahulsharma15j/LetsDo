import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, Router } from "@angular/router";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root"
})
export class UserRouteGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.userService.userType === "normal") {
      return true;
    } else {
      this.router.navigate(["/user"]);
      return false;
    }
  }
}
