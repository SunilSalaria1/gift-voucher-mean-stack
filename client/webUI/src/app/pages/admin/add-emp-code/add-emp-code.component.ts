import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';
import {
  AfterViewInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
@Component({
  selector: 'app-add-emp-code',
  standalone: true,
  imports: [CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    RouterLink,
    MatDialogModule,
    ClipboardModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-emp-code.component.html',
  styleUrl: './add-emp-code.component.css'
})
export class AddEmpCodeComponent {
  @ViewChild('content') dialogTemplate!: TemplateRef<any>;
  readonly dialog = inject(MatDialog);
  submitted: boolean = false;
  departments = ['HR', 'Frontend', 'Backend', 'Audit', 'Bidding'];
  generatedCode: string | null = null;
  // Array to store all existing codes to avoid duplicates
  existingCodes: Set<string> = new Set();
  addEmployeeCodeForm!: FormGroup;
  dialogEmployeeName: string = "";
  constructor(
    private formBuilder: FormBuilder,private snackBar: MatSnackBar
  ) { }
  // ngAfterViewInit(): void {
  //   throw new Error('Method not implemented.');
  // }

  ngOnInit(): void {
    // form
    this.addEmployeeCodeForm = this.formBuilder.group({
      employeeName: ['', Validators.required],
      department: ['', Validators.required],
      dob: ['', Validators.required],
      joiningDate: ['', Validators.required],
    });
  }

  
  get employeeNameValue(): string {
    return this.addEmployeeCodeForm.get('employeeName')?.value || "";
  }

  generateCode() {
    if (!this.addEmployeeCodeForm.valid) {
      console.log("Fill out the fields.");      
      return;
    }else if(this.addEmployeeCodeForm.valid){
      this.dialogEmployeeName = this.employeeNameValue;
      console.log(this.dialogEmployeeName);
    }

    let newCode: string;
    const maxAttempts = 10; // Limit attempts to prevent infinite loops
    let attempts = 0;

    const employeeName = this.addEmployeeCodeForm.get('employeeName')?.value;
    const department = this.addEmployeeCodeForm.get('department')?.value;
    const dob = this.addEmployeeCodeForm.get('dob')?.value;
    const joiningDate = this.addEmployeeCodeForm.get('joiningDate')?.value;

    do {
      // Generate a new code
      const prefix = 'EMP'; // Hardcoded prefix
      const nameInitials = this.getInitials(employeeName);
      const departmentCode = this.getDepartmentCode(department);
      const datePart = this.getDatePart(joiningDate, dob);
      const randomDigit = Math.floor(Math.random() * 90) + 10; // Random 2-digit number

      // Combine parts to create the code
      newCode = `${prefix}${nameInitials}${departmentCode}${datePart}${randomDigit}`;
      attempts++;
    } while (this.existingCodes.has(newCode) && attempts < maxAttempts);

    // If a unique code is found, add it to the record
    if (!this.existingCodes.has(newCode)) {
      this.generatedCode = newCode;
      this.existingCodes.add(newCode);
    } else {
      alert('Could not generate a unique code. Please try again.');
    }
  }
  // Helper: Extract initials from name
  private getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word[0].toUpperCase())
      .join('')
      .slice(0, 2); // Ensure max 2 initials
  }
  // Helper: Map department to a short code
  private getDepartmentCode(department: string): string {
    const departmentMap: { [key: string]: string } = {
      HR: 'HR',
      Frontend: 'FR',
      Backend: 'BCK',
      bidding: 'BID',
      Audit: 'AUD',
    };
    return departmentMap[department] || 'GEN'; // Default to 'GEN' if department is unknown
  }
  // Helper: Combine year from join date and day from DOB
  private getDatePart(joinDate: string, dob: string): string {
    const joinYear = new Date(joinDate).getFullYear().toString().slice(-2); // Last 2 digits of year
    const dobDay = new Date(dob).getDate().toString().padStart(2, '0'); // Day as 2 digits
    return `${joinYear}${dobDay}`;
  }

  // approve
  approve(){
    // success snackbar
    this.snackBar.open('You have successfully generated the employee code!.', 'close', {
      duration: 5000,
      panelClass: ['snackbar-success'],
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }
  // decline button
  decline() {
    if (this.addEmployeeCodeForm.valid) {      
      this.generatedCode = ""
      this.dialogEmployeeName=""
      // error snackbar
      this.snackBar.open('You have successfully deleted the generated employee code!.', 'close', {
        duration: 5000,
        panelClass: ['snackbar-error'],
        horizontalPosition: "center",
        verticalPosition: "top",
      });
    }
  }

  // dialog
  openDialog(): void {
    // Use the TemplateRef for the dialog
    const dialogRef = this.dialog.open(this.dialogTemplate,{
      height: '800px',
      width: '1200px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });

  }

  
   
  
}









