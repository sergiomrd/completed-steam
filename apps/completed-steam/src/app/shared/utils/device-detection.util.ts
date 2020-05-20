import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { WindowSize } from '../services/screen/screen.service';
import { DeviceConfigs } from '../models/device-config.const';

export class DeviceDetectionUtil {
  static readonly isMobile = new BehaviorSubject<boolean>(false);

  static screenChanged(size: WindowSize) {
    DeviceDetectionUtil.isMobile.next(size.width <= DeviceConfigs.MOBILE_DEVICE);
  }

  constructor() {}
}
