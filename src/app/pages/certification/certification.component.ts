import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatStepperModule} from "@angular/material/stepper";
import {StepComponent} from "../../components/step/step.component";
import {CertificationPhases} from "../../models/certification-phases.enum";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {Router, RouterLink} from "@angular/router";
import {MatToolbarModule} from "@angular/material/toolbar";
import {NavComponent} from "../../components/nav/nav.component";
import {Booking} from "../../models/booking.model";
import {BookingPhasesEnum} from "../../models/booking-phases.enum";
import {CertificationService} from "../../services/certification.service";
import {ToastrService} from "ngx-toastr";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-certification',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatStepperModule,
    ReactiveFormsModule,
    StepComponent,
    MatNativeDateModule,
    NavComponent,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './certification.component.html',
  styleUrl: './certification.component.scss'
})
export class CertificationComponent {

  protected readonly certificationPhases = CertificationPhases;
  submissionForm = new FormGroup({
    name: new FormControl('', [Validators.maxLength(200), Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    companyName: new FormControl('', [Validators.maxLength(200), Validators.required]),
    updateTitle: new FormControl('', [Validators.maxLength(200), Validators.required]),
    versionNumber: new FormControl('', [Validators.maxLength(50)]),
    releaseDate: new FormControl('', [Validators.required]),
    changeLog: new FormControl('', [Validators.required]),
    technicalOverview: new FormControl('', [Validators.required]),
    installationGuide: new FormControl('', [Validators.required]),
    testCases: new FormControl('', [Validators.required]),
    sourceCode: new FormControl('', [Validators.required]),
    developerNotes: new FormControl(''),
    termsAndConditions: new FormControl(false),
  });
  currentPhaseSubject: BehaviorSubject<CertificationPhases> = new BehaviorSubject<CertificationPhases>(CertificationPhases.DEVELOPER);
  selectedStepIndex = 0;
  private router = inject(Router);
  private certificationService = inject(CertificationService);
  private toastr =  inject(ToastrService);
  destroy$: Subject<void> = new Subject();
  successMessage = ''
  loading = false;
  get currentPhase(){
    return this.currentPhaseSubject.value;
  }

  set currentPhase(newPhase: CertificationPhases){
    this.currentPhaseSubject.next(newPhase);
  }
  onNext(newPhase: CertificationPhases){
    this.currentPhase = newPhase;
  }
  onBack(newPhase: CertificationPhases){
    this.currentPhase = newPhase;
  }

  onFileUploaded(file:Event, controlFlow: string){
    const files = (file.target as HTMLInputElement)?.files;
    if(files?.length){
      // call upload files to aws
      const file = files.item(0);
      if(file){
        this.certificationService.uploadFile(file)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: any) => {
              res = JSON.parse(res);
              // @ts-ignore
              this.submissionForm.controls?.[controlFlow]?.patchValue(res.url);
              this.toastr.success('uploaded successfully', 'Success');
            }, error: () => {
              this.toastr.error('Something went wrong', 'Error');
            }
          })
      }
    }
  }
  onBackMainPage(){
    this.router.navigate(['/'])
  }

  onSave(): void {
    if (this.submissionForm.valid) {
      this.loading = true;
      const payload = this.submissionForm.getRawValue();
      this.certificationService.createCertification(payload).pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.successMessage = 'Booking is successful';
          this.toastr.success(this.successMessage, 'Success');
          this.currentPhase = CertificationPhases.PAYMENT;
          this.loading = false;
        });
    }
  }

}
