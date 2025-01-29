import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatCardModule, MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatPaginator, MatPaginatorModule,
    MatDialogModule,
    MatTableModule,
    RouterLink,
    CommonModule ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent{
  @ViewChild('content') dialogTemplate!: TemplateRef<any>;
  readonly dialog = inject(MatDialog);
  addAdminForm!: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) { }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    // form
    this.addAdminForm = this.formBuilder.group({
      adminName: ['', Validators.required],
      adminKey: [
        '',
        [Validators.required],
      ],
      adminCode: ['', Validators.required],

    });
  }

  openDialog(): void {
    // Use the TemplateRef for the dialog
    const dialogRef = this.dialog.open(this.dialogTemplate);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // this is for the filter the table data
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
    displayedColumns: string[] = [
      'position',      
      'productTitle',
      'department',      
      'joiningDate',
      'Action',
    ];
  
    dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  
    @ViewChild(MatPaginator)
    paginator!: MatPaginator;
}


export interface PeriodicElement {
  position: number;  
  productTitle: string;
  department: string;  
  joiningDate:string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,    
    productTitle: 'tile2345',
    department: 'Frontend',    
    joiningDate:'25/11/2021',
  },
  {
    position: 2,    
    productTitle: 'tile2345',
    department: 'Backend',    
    joiningDate:'26/12/2023',
  },
  {
    position: 3,   
    productTitle: 'tile2345',
    department: 'HR',   
    joiningDate:'28/12/2023',
  },
  {
    position: 4,   
    productTitle: 'tile2345',
    department: 'Audit',    
    joiningDate:'26/12/2023',
  },
  {
    position: 5,    
    productTitle: 'tile2345',
    department: 'Bidding',   
    joiningDate:'26/12/2023',
  },
]