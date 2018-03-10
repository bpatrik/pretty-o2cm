import {IDanceEvent} from '../../../o2cm-parser/entities/DanceEvent';

export interface IDatedDanceEvent extends IDanceEvent {
  date: number;
}
