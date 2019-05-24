import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstCharComponent } from './first-char/first-char.component';
import { NavComponent } from './nav/nav.component';
import { MyNavComponent } from './my-nav/my-nav.component';

@NgModule({
  declarations: [FirstCharComponent , NavComponent, MyNavComponent],
  imports: [
    CommonModule
  ],
  exports:[
    FirstCharComponent,
    NavComponent,
    MyNavComponent
  ]
})
export class SharedModule { }
