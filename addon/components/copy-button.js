import Component from '@ember/component';
import layout from '../templates/components/copy-button';
import { action } from '@ember/object';
import { guidFor } from '@ember/object/internals';

export default class CopyButtonComponent extends Component {
  layout = layout;
  tagName = "";

  /**
   * Assigns button element an id
   * @returns {Void}
   */
  @action
  setupElement(element) {
    element.id = guidFor(this);
  }
}
