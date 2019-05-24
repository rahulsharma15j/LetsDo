import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'my-nav',
  templateUrl: './my-nav.component.html',
  styleUrls: ['./my-nav.component.css']
})
export class MyNavComponent implements OnInit {
  public authToken:string;
  constructor(public router:Router) { }

  ngOnInit() {
  }

  public gotoHome(){
   if(this.authToken){
    this.router.navigate(['/root/user/list']);
   }else{
    this.router.navigate(['/']);
   }
  
  }

}
