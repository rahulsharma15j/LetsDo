import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SingleUserComponent } from "./single-user/single-user.component";
import { FriendsComponent } from "./friends/friends.component";
import { NotificationsComponent } from "./notifications/notifications.component";
import { FormsModule } from "@angular/forms";
import { FilterPipeModule } from "ngx-filter-pipe";
import { ViewFriendListComponent } from "./view-friend-list/view-friend-list.component";
import { RootComponent } from "./root/root.component";
import { AppRoutingModule } from "../app-routing.module";
import { Ng2SearchPipeModule } from "ng2-search-filter";

@NgModule({
  declarations: [
    SingleUserComponent,
    FriendsComponent,
    NotificationsComponent,

    ViewFriendListComponent,

    RootComponent
  ],
  imports: [CommonModule, FormsModule, AppRoutingModule, Ng2SearchPipeModule]
})
export class TodoModule {}
