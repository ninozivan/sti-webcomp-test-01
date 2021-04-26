import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'sti-icon',
  styleUrl: 'sti-icon.css',
  shadow: true,
})
export class StiIcon {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
