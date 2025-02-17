import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { Color, LegendPosition, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule,MatIconModule,MatTabsModule,NgxChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
 private _usersService = inject(UsersService)
 totalEmployees:any;
  ngOnInit() {
    // this._usersService.getUsers().subscribe(
    //   (employees) => {
    //     this.totalEmployees = employees.length; // Set data here
    //     console.log(this.totalEmployees)        
    //   },
    //   (error) => {
    //     console.error('Error fetching employees', error);
    //   }
    // );
  }
  // pie chart
  view: [number, number] = [700, 400];  

  pieChartData = [
    {
      "name": "Germany",
      "value": 8940000
    },
    {
      "name": "USA",
      "value": 5000000
    },
    {
      "name": "France",
      "value": 7200000
    },
      {
      "name": "UK",
      "value": 6200000
    }
  ];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: LegendPosition = LegendPosition.Right; 

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group:ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor() {
    Object.assign(this, { pieChartData: this.pieChartData});
  }

  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}
