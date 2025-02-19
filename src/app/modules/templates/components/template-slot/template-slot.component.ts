import { Component, inject, input, OnInit, output } from '@angular/core';
import { TemplateModel } from '../../../../models/template.model';
import { TemplateService } from '../../../../services/template/template.service';
import { SnackBarService } from '../../../../services/snack-bar/snack-bar.service';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../components/confirmation-dialog/confirmation-dialog.component';
import { TherapistService } from '../../../../services/therapist/therapist.service';
import { TherapistModel } from '../../../../models/therapist.model';

@Component({
	selector: 'app-template-slot',
	standalone: false,

	templateUrl: './template-slot.component.html',
	styleUrl: './template-slot.component.scss'
})
export class TemplateSlotComponent implements OnInit {
	template = input.required<TemplateModel>();
	refreshPageEmitter = output();

	private readonly _dialog = inject(MatDialog);
	private readonly _templateService = inject(TemplateService);
	private readonly _therapistService = inject(TherapistService);
	private readonly _snackBarService = inject(SnackBarService);

	therapistName = '';

	ngOnInit() {
		this.getTherapistData();
	}

	getTherapistData() {
		this._therapistService.getTherapistById(this.template().therapistId).subscribe({
			next: (therapist: TherapistModel) => {
				this.therapistName = therapist.name;
			},
			error: (error: HttpErrorResponse) => {
				console.error(error);
				this._snackBarService.openErrorSnackBar('Erro a pesquisar terapeuta');
			}
		});
	}

	openDeleteTemplateDialog() {
		const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
			data: {
				title: 'Eliminar template',
				message: 'Tem a certeza de que pretende eliminar este template?'
			}
		});
		dialogRef.afterClosed().subscribe((result: boolean) => {
			if (result) {
				this.deleteTemplate();
			}
		});
	}

	deleteTemplate() {
		this._templateService.deleteTemplate(this.template()._id).subscribe({
			complete: () => {
				this._snackBarService.openSuccessSnackBar('Template eliminado');
				this.refreshPageEmitter.emit();
			},
			error: (error: HttpErrorResponse) => {
				console.error(error);
				switch (error.status) {
					case HttpStatusCode.Forbidden:
						this._snackBarService.openErrorSnackBar('Sem permissões para eliminar template');
						break;
					case HttpStatusCode.NotFound:
						this._snackBarService.openErrorSnackBar('Sessão não encontrado');
						break;
					default:
						this._snackBarService.openErrorSnackBar('Erro ao eliminar template');
						break;
				}
			}
		});
	}

	computeEndTime(time: Date, duration: number) {
		return new Date(new Date(time).getTime() + duration * 60000);
	}
}
