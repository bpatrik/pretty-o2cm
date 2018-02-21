import {Component} from '@angular/core';
import {DataService} from '../services/data.service';


@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent {

  constructor(public dataService: DataService) {
  }

  showPercentage = false;

  onPointPresentatoinChange() {
    console.log('change', this.showPercentage);
    this.showPercentage = !this.showPercentage;
  }
}

