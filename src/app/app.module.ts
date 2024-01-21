import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './material/material.module';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.development';
import { ServerErrorsInterceptor } from './interceptor/server-errors.interceptor';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
// import { VitalSignComponent } from './pages/vital-sign/vital-sign.component';
// import { VitalSignEditComponent } from './pages/vital-sign/vital-sign-edit/vital-sign-edit.component';

export function tokenGetter() {
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

@NgModule({
  declarations: [
    AppComponent,
    // VitalSignEditComponent,
    // VitalSignComponent,
    //PatientComponent, lo comento porque ahora es standalone
    //MedicComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:8080"],
        disallowedRoutes: ["http://localhost:8080/login/forget"]
      },
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true,
    },
    {
      provide: LocationStrategy, useClass: HashLocationStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
