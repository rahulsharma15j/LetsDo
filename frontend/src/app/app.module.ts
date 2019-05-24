import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { UserModule } from "./user/user.module";
import { SharedModule } from "./shared/shared.module";
import { NotFoundComponent } from "./not-found/not-found.component";
import { InternalErrorComponent } from "./internal-error/internal-error.component";
import { HttpClientModule } from "@angular/common/http";
import { TodoModule } from "./todo/todo.module";
import { FormsModule } from "@angular/forms";
import { Ng2SearchPipeModule } from "ng2-search-filter";

//import { AppRoutingModule } from './app-routing.module';
@NgModule({
  declarations: [AppComponent, NotFoundComponent, InternalErrorComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    TodoModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    Ng2SearchPipeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
