import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignupComponent } from "./user/signup/signup.component";
import { LoginComponent } from "./user/login/login.component";
import { ForgotPasswordComponent } from "./user/forgot-password/forgot-password.component";
import { ResetPasswordComponent } from "./user/reset-password/reset-password.component";
import { VerifyUserComponent } from "./user/verify-user/verify-user.component";
import { InternalErrorComponent } from "./internal-error/internal-error.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { SingleUserComponent } from "./todo/single-user/single-user.component";
import { FriendsComponent } from "./todo/friends/friends.component";
import { NotificationsComponent } from "./todo/notifications/notifications.component";
import { UserRouteGuard } from "./services/user-route.guard";
import { ViewFriendListComponent } from "./todo/view-friend-list/view-friend-list.component";
import { RootComponent } from "./todo/root/root.component";
import { AppRouteGuard } from "./services/app-route.guard";

const routes: Routes = [
  { path: "", component: SignupComponent },
  { path: "login", component: LoginComponent },
  { path: "forgot", component: ForgotPasswordComponent },
  { path: "reset-password/:authtoken", component: ResetPasswordComponent },
  { path: "verify/:userId", component: VerifyUserComponent },
  {
    path: "root",
    component: RootComponent,
    canActivate: [AppRouteGuard],
    children: [
      {
        path: "user/list",

        component: SingleUserComponent
      },
      {
        path: "friends",

        component: FriendsComponent
      },
      {
        path: "notifications",

        component: NotificationsComponent
      },
      {
        path: "view/friend/:friendId",

        component: ViewFriendListComponent
      }
    ]
  },
  { path: "error", component: InternalErrorComponent },
  { path: "", redirectTo: "/", pathMatch: "full" },
  { path: "*", component: NotFoundComponent },
  { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
