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
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  AfterViewInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UsersService } from '../../../services/users.service';
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
    RouterLink
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-emp-code.component.html',
  styleUrl: './add-emp-code.component.css',
})
export class AddEmpCodeComponent {
  @ViewChild('content') dialogTemplate!: TemplateRef<any>;
  readonly dialog = inject(MatDialog);
  dialogRef: MatDialogRef<any> | null = null;
  submitted: boolean = false;
  departments = ['HR', 'Frontend', 'Backend', 'Audit', 'Bidding'];
  generatedCode: string | null = null;
  addEmployeeCodeForm!: FormGroup;
  dialogEmployee:any;
  isEmailAlreadyExist:boolean=false;
  private _usersService = inject(UsersService)
  constructor(
    private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router
  ) { }
  // ngAfterViewInit(): void {
  //   throw new Error('Method not implemented.');
  // }

  ngOnInit(): void {
    // form
    this.addEmployeeCodeForm = this.formBuilder.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      dob: ['', Validators.required],
      joiningDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }
  // approve
  approve() {
    debugger;
    if (this.dialogRef) {
      this.dialogRef.close(); // This closes the dialog
      this.router.navigate(['/admin/generate-emp-code']);
    }
    
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
    debugger;
    if (this.addEmployeeCodeForm.valid) {
      this. dialogEmployee = ""
      if (this.dialogRef) {
        this.dialogRef.close(); // This closes the dialog
        // error snackbar
      this.snackBar.open('You have successfully deleted the generated employee code!.', 'close', {
        duration: 5000,
        panelClass: ['snackbar-error'],
        horizontalPosition: "center",
        verticalPosition: "top",
      });
      }     
      
    }
  }

  // dialog
  openDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      width: '1200px',
    });

    this.dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // Call the openDialog method conditionally
  submitForm(): void {
    this.isEmailAlreadyExist=false;
    if (this.addEmployeeCodeForm.valid) {
      const newPost = this.addEmployeeCodeForm.value;
  
      this._usersService.createPost(newPost).subscribe(
        (response) => {
          console.log('Post created:', response);
          this.dialogEmployee=response.user;
          console.log(this.dialogEmployee)
          this.openDialog(); 
        },
        (error) => {         
            let errorMessage =error.error.error;
            if(errorMessage=="Email already exists"){
              this.isEmailAlreadyExist=true;
            }
            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
              panelClass: ['snackbar-error'],
              horizontalPosition: 'center',
              verticalPosition: 'top',
            }); 
        }
      );
    }
  }
  
}









