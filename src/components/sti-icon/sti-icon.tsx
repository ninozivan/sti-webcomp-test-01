import { Build, Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';
import { fetchIcon } from '../../utils/utils';

@Component({
  tag: 'sti-icon',
  styleUrl: 'sti-icon.css',
  shadow: true,
})
export class StiIcon {
  @Element() el: HTMLElement;
  @Prop() icon: string = null;

  @State() private svgContent: string;
  @State() private visible = false;

  private intersectionObserver: IntersectionObserver;

  connectedCallback(): void {
    this.waitUntilVisible(() => {
      this.visible = true;
      this.loadIconPathData();
    });
  }

  disconnectedCallback(): void {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      this.intersectionObserver = null;
    }
  }

  async componentWillLoad(): Promise<void> {
    this.loadIconPathData();
  }

  render() {
    return <Host role="img">{this.svgContent ? <div class="icon-wrapper" innerHTML={this.svgContent}></div> : <div class="icon-wrapper"></div>}</Host>;
  }

  @Watch('icon') private async loadIconPathData(): Promise<void> {
    const { icon, visible } = this;

    if (!Build.isBrowser || !icon || !visible) {
      return;
    }

    this.svgContent = await fetchIcon({ icon });
  }

  private waitUntilVisible(callback: () => void): void {
    if (!Build.isBrowser || typeof window === 'undefined' || !(window as any).IntersectionObserver) {
      callback();
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.intersectionObserver.disconnect();
            this.intersectionObserver = null;
            callback();
          }
        });
      },
      { rootMargin: '50px' },
    );

    this.intersectionObserver.observe(this.el);
  }
}
