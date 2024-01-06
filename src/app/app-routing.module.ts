import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LayoutComponent } from './pages/layout/layout.component';

import { UserComponent } from './pages/user/user.component';
import { BooksComponent } from './books/books.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'sign-up', component: SignupComponent },
  { path: '', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'book', component: BooksComponent, canActivate: [AuthGuard] },
  // { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
