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
import { ActivatedRoute, Params, Router, RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { trigger, style, animate, transition } from '@angular/animations';
import {
  AfterViewInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-edit-emp-code',
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
    ClipboardModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-emp-code.component.html',
  styleUrl: './edit-emp-code.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-5px)' }),
        animate('200ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(-5px)' }))
      ])
    ])
  ]
})
export class EditEmpCodeComponent {
  @ViewChild('content') dialogTemplate!: TemplateRef<any>;
  readonly dialog = inject(MatDialog);
  dialogRef: MatDialogRef<any> | null = null;
  submitted: boolean = false;
  departments = ['HR', 'Frontend', 'Backend', 'Audit', 'Bidding'];
  generatedCode: string | null = null;
  editEmployeeCodeForm!: FormGroup;
  dialogEmployee: any;
  userData: any;
  private _usersService = inject(UsersService)
  currentUserId: any;
  constructor(
    private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute
  ) { }
  // ngAfterViewInit(): void {
  //   throw new Error('Method not implemented.');
  // }

  // ngOnInIt  
  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        console.log(params['id']);
        this.currentUserId = params['id']
        console.log("@@@@@@@@@@@@@@@",typeof(this.currentUserId))
      })
    // form
    this.editEmployeeCodeForm = this.formBuilder.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      dob: ['', Validators.required],
      joiningDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    // calling getUser method
    this.getUser()
  }
  // get user
  getUser() {
    this._usersService.getUserById(this.currentUserId).subscribe(
      (data: any) => {
        console.log('get request is successfull', data)
        this.userData = data;
        this.editEmployeeCodeForm.patchValue({
          name: this.userData.name,
          department: this.userData.department,
          dob: this.userData.dob,
          joiningDate: this.userData.joiningDate,
          email: this.userData.email,
        })
        console.log("Patched department value:", this.editEmployeeCodeForm.value.department);
      }
    )
  }
  // approve
  approve() {
    this.router.navigate(['/admin/generate-emp-code']);
    // success snackbar
    this.snackBar.open('You have successfully updated the employee code!.', 'close', {
      duration: 5000,
      panelClass: ['snackbar-success'],
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }
  // decline button
  decline() {
    if (this.editEmployeeCodeForm.valid) {
      this.dialogEmployee = ""
      // error snackbar
      this.snackBar.open('You can now generate new employee code!.', 'close', {
        duration: 5000,
        panelClass: ['snackbar-error'],
        horizontalPosition: "center",
        verticalPosition: "top",
      });
    }
  }
  // openDialog(): void {
  //   this.dialogRef = this.dialog.open(this.dialogTemplate, {
  //     width: '1200px',
  //     disableClose: true, // Prevents clicking outside the dialog
  //     autoFocus: true, // Ensures focus moves inside the dialog
  //     restoreFocus: true, // Returns focus to the trigger element after closing
  //   });
  
    // this.dialogRef.afterOpened().subscribe(() => {
    //   const dialogContainer = document.querySelector('.cdk-overlay-container');
    //   if (dialogContainer) {
    //     // dialogContainer.removeAttribute('aria-hidden'); // Ensure the dialog is not hidden
    //   }
    // });
  
    // this.dialogRef.afterClosed().subscribe(() => {
    //   console.log(`Dialog closed`);
    //   this.dialogRef = null; // Reset reference
    // });
  // }

  // dialog box
  openDialog(): void {    
    // Use the TemplateRef for the dialog
    const dialogRef = this.dialog.open(this.dialogTemplate,{
      width: '1200px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  
  
  
  // Call the openDialog method conditionally
  submitForm(): void {
    if (this.editEmployeeCodeForm.valid) {
      const postData = {
        name: this.editEmployeeCodeForm.value.name,
        department: this.editEmployeeCodeForm.value.department
      };
      console.log(this.currentUserId)
      console.log(postData)
      this._usersService.updateUser(this.currentUserId,postData).subscribe(
        (response) => {
          console.log('Post updated:', response);
          this.dialogEmployee = response.updatedUser;
          console.log(this.dialogEmployee)
          this.openDialog();
        },
        (error) => {
          let errorMessage = error.error.error;
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