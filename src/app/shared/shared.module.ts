import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengUiControlsModule } from '../ui-controls/primeng-ui-controls.module';
import { MenuComponent } from '../features/pages/menu/menu.component';
import { HomeComponent } from '../features/pages/home/home.component';
import { CapitalizeFirstLetterPipe } from './pipes/capitalize-first-letter.pipe';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from '../features/pages/profile/profile.component';
import { AboutUsComponent } from '../features/pages/about-us/about-us.component';

@NgModule({
  declarations: [MenuComponent, HomeComponent, ProfileComponent, AboutUsComponent],
  exports: [
    CommonModule,
    PrimengUiControlsModule,
    MenuComponent,
    HomeComponent,
    FormsModule
  ],
  imports: [
    CommonModule, 
    PrimengUiControlsModule, 
    CapitalizeFirstLetterPipe,
    FormsModule
  ],
})
export class SharedModule {}
