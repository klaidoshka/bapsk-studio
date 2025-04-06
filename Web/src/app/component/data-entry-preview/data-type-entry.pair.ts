import DataType from '../../model/data-type.model';
import {DataEntryJoined} from '../../model/data-entry.model';

export default interface DataTypeEntryPair {
  dataType: DataType;
  dataEntry: DataEntryJoined;
}
