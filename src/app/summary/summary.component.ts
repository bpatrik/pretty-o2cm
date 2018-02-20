import {Component} from "@angular/core";
import {DataService} from "../services/data.service";


@Component({
  selector: 'summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {

  constructor(public dataService: DataService) {
  }

}

