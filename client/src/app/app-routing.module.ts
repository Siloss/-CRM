import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AuthGuard } from './shared/classes/auth.guard';
import { OverviewPageComponent } from './overview-page/overview-page.component';
import { AnalyticsPageComponent } from './analytics-page/analytics-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { AssortmentPageComponent } from './assortment-page/assortment-page.component';
import { HistoryPageComponent } from './history-page/history-page.component';
import { CategoriesFormComponent } from './assortment-page/categories-form/categories-form.component';
import { OrderCategoriesComponent } from './order-page/order-categories/order-categories.component';
import { OrderPositionsComponent } from './order-page/order-positions/order-positions.component';
const routes: Routes = [
  {
    path: '',component:AuthLayoutComponent,children:[
      {path:'',redirectTo:'/login',pathMatch:'full'},
      {path:'login',component:LoginPageComponent},
      {path:'register',component:RegisterPageComponent}
    ]
  },
  {
  
    path:'', component:SiteLayoutComponent,canActivate:[AuthGuard],children:[
      {path:'overview',component:OverviewPageComponent},
      {path:'analytics',component:AnalyticsPageComponent},
      {path:'history',component:HistoryPageComponent},
      {path:'order',component:OrderPageComponent, children:[
        {path:':id',component:OrderPositionsComponent},
        {path:'',component:OrderCategoriesComponent}
      ]},
      {path:'assortment',component:AssortmentPageComponent},
      {path:"assortment/new",component:CategoriesFormComponent},
      {path:"assortment/:id",component:CategoriesFormComponent}
    ]
  }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
