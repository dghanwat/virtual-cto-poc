import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HumanComponent } from './human/human.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { QnAComponent } from './training/qna/qna.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'training/qna', component: QnAComponent},
  { path: 'human', component: HumanComponent},
  // { path: 'account', component: AccountComponent, canActivate: [AuthGuardLogin] },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
}) 

export class RoutingModule {
}
