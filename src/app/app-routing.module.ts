import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageRolesComponent } from './manage-roles/manage-roles.component';
import { RefCatTaxComponent } from './ref-cat-tax/ref-cat-tax.component';
import { RefSubCatTaxComponent } from './ref-sub-cat-tax/ref-sub-cat-tax.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'manage-users', component: ManageUsersComponent, canActivate: [AuthGuard] },
  { path: 'manage-roles', component: ManageRolesComponent, canActivate: [AuthGuard] },
  { path: 'manage-ref/category-tax', component: RefCatTaxComponent, canActivate: [AuthGuard] },
  { path: 'manage-ref/sub-category-tax', component: RefSubCatTaxComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
