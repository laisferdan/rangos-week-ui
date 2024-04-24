import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';


@NgModule({
  declarations: [],
  imports: [
    MenubarModule,
    TableModule,
    ButtonModule,
    TagModule,
    RatingModule,
  ],
  exports: [
    MenubarModule,
    TableModule,
    ButtonModule,
    TagModule,
    RatingModule,
  ] 
})
export class PrimengUiControlsModule { }
