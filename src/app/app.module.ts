import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar/navbar.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageRolesComponent } from './manage-roles/manage-roles.component';
import { RefCatTaxComponent } from './ref-cat-tax/ref-cat-tax.component';
import { RefSubCatTaxComponent } from './ref-sub-cat-tax/ref-sub-cat-tax.component';
import { DepositComponent } from './deposit/deposit.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    NavbarComponent,
    ManageUsersComponent,
    ManageRolesComponent,
    RefCatTaxComponent,
    RefSubCatTaxComponent,
    DepositComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
