import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Cookie } from 'ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class AppRouteGuard implements CanActivate {
  constructor(private router:Router){}
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if(Cookie.get('authToken') === undefined ||
        Cookie.get('authToken') ===  null ||
        Cookie.get('authToken') ===  ''){
        this.router.navigate(['/']);
        return false;
     }else{
      return true;
     }
     
   }
  
}
