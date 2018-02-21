import {Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.css'],
  providers: [RouterLink],
  encapsulation: ViewEncapsulation.Emulated
})
export class FrameComponent {
  firstName = '';
  lastName = '';

  constructor(public dataService: DataService) {
    this.firstName = this.dataService.data.getValue().dancerName.firstName;
    this.lastName = this.dataService.data.getValue().dancerName.lastName;
  }

  load() {
    this.dataService.loadDancer(this.firstName, this.lastName);
  }

}

