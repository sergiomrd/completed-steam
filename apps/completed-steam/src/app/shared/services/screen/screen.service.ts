import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface WindowSize {
  height: number;
  width: number;
}

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

  private renderer: Renderer2;
  readonly windowSizeChange = new BehaviorSubject<WindowSize>({width: window.innerWidth, height: window.innerHeight});

  constructor(rendererFactory: RendererFactory2) {

    this.renderer = rendererFactory.createRenderer(null, null);
    this.renderer.listen(window, 'resize', (event: Event) => {
      this.setResponsive(event);
    });
  }

  setResponsive(event: any)  {
    const size: WindowSize = {
      height: event['currentTarget'].innerHeight,
      width: event['currentTarget'].innerWidth
    };

    this.updateResponsive(size);
  }

  updateResponsive(size: WindowSize) {
    this.windowSizeChange.next(size);
  }
}
