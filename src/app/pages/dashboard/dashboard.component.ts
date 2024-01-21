import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MaterialModule } from 'src/app/material/material.module';
import { MenuService } from 'src/app/service/menu.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [MaterialModule]
})
export class DashboardComponent implements OnInit {

  username: string;
  role: string;

  constructor(
    private menuService: MenuService
  ){}

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const decodeToken = helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME));
    //console.log(decodeToken);
    this.username = decodeToken.sub;
    this.role = decodeToken.role;

    this.menuService.getMenusByUser(this.username).subscribe(data => {
      this.menuService.setMenuChange(data);
    });
  }
}
