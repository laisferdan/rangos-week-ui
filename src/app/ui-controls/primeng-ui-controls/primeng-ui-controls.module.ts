import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { SplitterModule  } from 'primeng/splitter';
import {ButtonModule} from 'primeng/button';


@NgModule({
  declarations: [],
  imports: [
    MenubarModule,
    SplitterModule ,
    ButtonModule
  ],
  exports: [
    MenubarModule,
    SplitterModule ,
    ButtonModule
  ] 
})
export class PrimengUiControlsModule { }
