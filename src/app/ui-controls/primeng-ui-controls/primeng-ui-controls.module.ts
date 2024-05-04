import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';


@NgModule({
  declarations: [],
  imports: [
    MenubarModule,
    TableModule,
    ButtonModule,
    TagModule,
    RatingModule,
    ToastModule,
    ToolbarModule
  ],
  exports: [
    MenubarModule,
    TableModule,
    ButtonModule,
    TagModule,
    RatingModule,
    ToastModule,
    ToolbarModule
  ] 
})
export class PrimengUiControlsModule { }
