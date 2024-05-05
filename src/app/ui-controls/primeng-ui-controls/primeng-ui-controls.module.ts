import { NgModule } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
  declarations: [],
  imports: [
    MenubarModule,
    TableModule,
    ButtonModule,
    TagModule,
    RatingModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    RippleModule,
    ConfirmDialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
  ],
  exports: [
    MenubarModule,
    TableModule,
    ButtonModule,
    TagModule,
    RatingModule,
    ToastModule,
    ToolbarModule,
    DialogModule,
    RippleModule,
    ConfirmDialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    InputTextModule,
    FormsModule,
    InputNumberModule,
  ],
})
export class PrimengUiControlsModule {}
