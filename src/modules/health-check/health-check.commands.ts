import {IsNotEmpty, IsObject, IsString} from 'class-validator';
import {PickType} from '../../commons/utils/class-extends';
type json = Record<string, any>;

export class PingDynamicCommand {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  t: string;
}

export class PingDynamicCommandPost extends PickType(PingDynamicCommand, ['id', 'name', 't']) {
  @IsObject()
  @IsNotEmpty()
  body: json;
}