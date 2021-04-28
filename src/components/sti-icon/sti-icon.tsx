import { Component, Host, h, State, Watch, Prop } from '@stencil/core';
import { fetchIcon } from '../../utils/utils';

@Component({
  tag: 'sti-icon',
  styleUrl: 'sti-icon.css',
  shadow: true,
})
export class StiIcon {
  @Prop() icon: string = null;

  @State() private svgContent?: string;

  @Watch('icon') private async loadIconPathData(): Promise<void> {
    const { icon } = this;
    this.svgContent = await fetchIcon({ icon });
  }

  async componentWillLoad(): Promise<void> {
    this.loadIconPathData();
  }

  render() {
    return <Host role="img">{this.svgContent ? <div class="icon-wrapper" innerHTML={this.svgContent}></div> : <div class="icon-wrapper"></div>}</Host>;
  }
}
