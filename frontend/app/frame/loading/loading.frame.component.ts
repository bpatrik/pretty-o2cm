import {Component, Input} from '@angular/core';
import {ILoading} from '../../services/IData';


@Component({
  selector: 'app-loading-fame-component',
  templateUrl: './loading.frame.component.html',
  styleUrls: ['./loading.frame.component.scss'],
})
export class LoadingFrameComponent {

  @Input() loading: ILoading;

  percent(): number {
    return Math.round(this.loading.current / this.loading.maximum * 100);
  }
}

