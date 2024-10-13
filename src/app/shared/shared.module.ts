import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengUiControlsModule } from '../ui-controls/primeng-ui-controls.module';
import { MenuComponent } from '../features/pages/menu/menu.component';
import { HomeComponent } from '../features/pages/home/home.component';
import { CapitalizeFirstLetterPipe } from './pipes/capitalize-first-letter.pipe';

@NgModule({
  declarations: [MenuComponent, HomeComponent],
  exports: [
    CommonModule,
    PrimengUiControlsModule,
    MenuComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule, 
    PrimengUiControlsModule, 
    CapitalizeFirstLetterPipe
  ],
})
export class SharedModule {}
