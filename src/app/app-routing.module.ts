import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawingComponent } from './drawing-component/drawing-component.component';

const routes: Routes = [
  {
    path: 'draw',
    component: DrawingComponent
  }
  {
    path: '',
    redirectTo: 'draw', // Default route
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
