import { Component, OnInit } from '@angular/core';
import { DeviceDetectionUtil } from './shared/utils/device-detection.util';
import { ScreenService, WindowSize } from './shared/services/screen/screen.service';


@Component({
  selector: 'completed-steam-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private screenService: ScreenService) {
    this.handleWindowSize();
  }

  handleWindowSize() {
    this.screenService.windowSizeChange.subscribe((size: WindowSize) => {
      DeviceDetectionUtil.screenChanged(size);
    });
  }

  async ngOnInit() {

  }
}
