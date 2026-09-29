import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeviceDetectionUtil } from './shared/utils/device-detection.util';
import { ScreenService, WindowSize } from './shared/services/screen/screen.service';

@Component({
  selector: 'completed-steam-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private readonly screenService = inject(ScreenService);

  constructor() {
    this.handleWindowSize();
  }

  handleWindowSize(): void {
    this.screenService.windowSizeChange.subscribe((size: WindowSize) => {
      DeviceDetectionUtil.screenChanged(size);
    });
  }

  ngOnInit(): void {}
}
