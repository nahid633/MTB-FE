import {Component, inject} from '@angular/core';
import {StepComponent} from "../../components/step/step.component";
import {MatInputModule} from "@angular/material/input";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {BookingPhasesEnum} from "../../models/booking-phases.enum";
import {Router} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {ProcessTypesEnum} from "../../models/test-types.enum";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatStepperModule} from "@angular/material/stepper";
import {ToastrService} from "ngx-toastr";
import {BookingService} from "../../services/booking.service";
import {Booking} from "../../models/booking.model";
import {NavComponent} from "../../components/nav/nav.component";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {dateTimeOptions, TestTypeOptions, vehiclesMakesOptions, vehiclesModelsOptions} from "./constants";

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    StepComponent,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatStepperModule,
    NavComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent{
  currentPhaseSubject: BehaviorSubject<BookingPhasesEnum> = new BehaviorSubject<BookingPhasesEnum>(BookingPhasesEnum.TEST_TYPE);
  protected readonly bookingPhases = BookingPhasesEnum;
  protected readonly processTypes = ProcessTypesEnum;
  private router = inject(Router);
  private toastr =  inject(ToastrService);
  private bookingService =  inject(BookingService);

  timeOptions = dateTimeOptions;
  typeOptions = TestTypeOptions;
  vehiclesMakes = vehiclesMakesOptions
  vehiclesModels: Record<string, { model: string }[]> = vehiclesModelsOptions;
  selectedStepIndex = 0;
  formGroup = new FormGroup({
    userDetails: new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      contactNumber: new FormControl('', [Validators.required]),
    }),
    vehicleInfo: new FormGroup({
      make: new FormControl('', [Validators.required]),
      model: new FormControl('', [Validators.required]),
      registrationNumber: new FormControl('', [Validators.required]),
    }),
    testDetails: new FormGroup({
      testType:new FormControl('', [Validators.required]),
      preferredDate:new FormControl('', []),
      timeSlot:new FormControl('', []),
      specialRequirements:new FormControl('', []),
    })
  })
  destroy$: Subject<void> = new Subject();
  successMessage = '';
  today = new Date();
  loading = false;
  disabledDates!: string[];
  get currentPhase(){
    return this.currentPhaseSubject.value;
  }

  set currentPhase(newPhase: BookingPhasesEnum){
    this.currentPhaseSubject.next(newPhase);
  }

  get selectedTestType() {
    return this.formGroup?.controls?.testDetails?.controls?.testType?.value ?? '';
  }

  get selectedVehicleMake(){
    return this.formGroup?.controls?.vehicleInfo?.controls?.make?.value
  }

  get selectedPrice(){
    return this.typeOptions.filter(t => t.name === this.formGroup.controls.testDetails.controls.testType.value)?.[0].price ?? 0
  }

  onNext(newPhase: BookingPhasesEnum){
  this.currentPhase = newPhase;
  }
  onBack(newPhase: BookingPhasesEnum){
    this.currentPhase = newPhase;
  }
  onBackMainPage(){
      this.router.navigate(['/'])
  }
  onPlaySimulation(){
    this.router.navigate(['/play-simulation'])
  }

  getBookedTimes(){
    this.bookingService.getBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe(bookings=>{
        this.disabledDates = bookings;
      })
    ;
  }
  onSave(): void {
    if (this.formGroup.valid) {
      this.loading = true;
      const payload = this.formGroup.getRawValue() as Booking;
      this.bookingService.createBooking(payload).pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.successMessage = 'Booking is successful';
          this.toastr.success(this.successMessage, 'Success');
          this.currentPhase = BookingPhasesEnum.PAYMENT_SUCCESS;
          this.loading = false;
        });
    }
  }

}
