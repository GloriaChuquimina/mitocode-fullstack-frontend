import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { Menu } from 'src/app/model/menu';
import { LoginService } from 'src/app/service/login.service';
import { MenuService } from 'src/app/service/menu.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [MaterialModule, RouterLink, RouterOutlet, RouterLinkActive, NgIf, NgFor ]
})
export class LayoutComponent implements OnInit{

  menus: Menu[];
  username: string;
  role: string;

  constructor(
    private loginService: LoginService,
    private menuService: MenuService
  ){}

  ngOnInit(): void {
    this.menuService.getMenuChange().subscribe(data => this.menus = data);
    const helper = new JwtHelperService();
    const decodeToken = helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME));
    this.username = decodeToken.sub;
    this.role = decodeToken.role;
  }

  logout(){
    this.loginService.logout();
  }



}
