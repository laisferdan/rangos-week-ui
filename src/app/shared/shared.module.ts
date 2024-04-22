import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengUiControlsModule } from '../ui-controls/primeng-ui-controls/primeng-ui-controls.module';
import { MenuComponent } from '../features/pages/menu/menu.component';



@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    PrimengUiControlsModule,
  ],
  exports: [
    PrimengUiControlsModule,
    MenuComponent
  ]
})
export class SharedModule { }
