import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { BadgeComponent, ButtonDirective, FormModule, TableDirective } from '@coreui/angular';
import { IconComponent } from '@coreui/icons-angular';

import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  RowComponent,
} from '@coreui/angular';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  templateUrl: 'Business.component.html',
  imports: [CardComponent, CardHeaderComponent, CardBodyComponent, RowComponent, RouterLink, RouterOutlet, 
     BadgeComponent, CommonModule, FormModule, IconComponent, TableDirective, ButtonDirective]
})
export class BusinessComponent {
  Businesses?: any[]
}
