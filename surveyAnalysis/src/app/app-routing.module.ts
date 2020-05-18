import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { SurveyPageComponent } from './survey-page/survey-page.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login'},
  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomePageComponent},
  { path: 'surveys/:id', component: SurveyPageComponent},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponent, HomePageComponent, SurveyPageComponent, PageNotFoundComponent];
// export const routingComponents = RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'});
