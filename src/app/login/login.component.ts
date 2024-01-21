import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../material/material.module';
import { FormsModule } from '@angular/forms';
import '../../assets/login-animation.js';
import { NgIf } from '@angular/common';
import { LoginService } from '../service/login.service';
import { environment } from 'src/environments/environment.development';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [MaterialModule, FormsModule, NgIf, RouterLink]
})
export class LoginComponent{

  username: string;
  password: string;
  message: string;
  error: string;

  constructor(
    private loginService: LoginService,
    private router: Router
  ){}

  login(){
    this.loginService.login(this.username, this.password).subscribe(data => {
      sessionStorage.setItem(environment.TOKEN_NAME, data.jwtToken);
      this.router.navigate(['pages/dashboard']);
    });
  }

  ngAfterViewInit(){
    (window as any).initialize();
  }

}
