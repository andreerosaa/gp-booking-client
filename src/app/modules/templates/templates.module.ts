import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './components/templates/templates.component';
import { TemplatesRoutingModule } from './templates-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TemplateSlotComponent } from './components/template-slot/template-slot.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CreateEditTemplateDialogComponent } from './components/create-edit-template-dialog/create-edit-template-dialog.component';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatChipsModule } from '@angular/material/chips';



@NgModule({
  declarations: [TemplatesComponent, TemplateSlotComponent, CreateEditTemplateDialogComponent,],
  imports: [
    CommonModule,
    TemplatesRoutingModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinner,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    MatAutocompleteModule,
    MatTimepickerModule,
    MatChipsModule
  ]
})
export class TemplatesModule { }
