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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
    submitted: boolean = false;
    departments = ['HR', 'Frontend', 'Backend', 'Audit', 'Bidding'];
    generatedCode: string | null = null;
    addEmployeeCodeForm!: FormGroup;
    dialogEmployee:any;
    isEmailAlreadyExist:boolean=false;
    userData:any;
    private _usersService = inject(UsersService)
  currentUserId:any;
    constructor(
      private formBuilder: FormBuilder, private snackBar: MatSnackBar, private router: Router,private route: ActivatedRoute
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
        })
      // form
      this.addEmployeeCodeForm = this.formBuilder.group({
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
    getUser(){
      this. _usersService. getUserById( this.currentUserId).subscribe(
        (data:any)=>{
          console.log('get request is successfull',data)
          this.userData=data;
          this.addEmployeeCodeForm.patchValue({
          name:this.userData.name,
          department:this.userData.department,
          dob:this.userData.dob,
          joiningDate:this.userData.joiningDate,
          email:this.userData.email,
          })

        }
      )
    }
    // approve
    approve() {
      this.router.navigate(['/admin/generate-emp-code']);
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
        this. dialogEmployee = ""     
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
      const dialogRef = this.dialog.open(this.dialogTemplate, {
        width: '1200px',
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
      });
    }
  
    // Call the openDialog method conditionally
    submitForm(): void {
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