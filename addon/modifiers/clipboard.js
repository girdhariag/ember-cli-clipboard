import { modifier } from 'ember-modifier';
import { guidFor } from '@ember/object/internals';

const CLIPBOARD_EVENTS = ['success', 'error'];

/**
 * Get ClipboardJS trigger
 * @param {Object} element - element to modify
 * @param {Object} args - modifier arguments
 * @returns {Object|String} ClipboardJS trigger
 */
function getTrigger(element, args) {
  const { delegateClickEvent } = args;
  if (delegateClickEvent === false) {
    return element;
  } else {
    element.id = element.id || guidFor(element);
    return `#${element.id}`;
  }
}

/**
 * Creates new `ClipboardJS` instance
 * @param {Object} element - element to modify
 * @param {Object} args - modifier arguments
 * @returns {Object} newly created ClipboardJS object
 */
function createClipboard(element, args) {
  const text = typeof args.text === 'function' ? args.text : undefined
  const trigger = getTrigger(element, args)
  const clipboard = new window.ClipboardJS(trigger, { text });
  setAttributes(element, args);
  registerActions(clipboard, element, args);
  return clipboard;
}

/**
 * Set ClipboardJS attributes
 * @param {Object} element - element to modify
 * @param {Object} args - modifier arguments
 * @returns {Void}
 */
function setAttributes(element, args) {
  const { text, target, action } = args
  if (typeof text === 'string') {
    element.setAttribute('data-clipboard-text', text);
  }
  if (typeof target === 'string') {
    element.setAttribute('data-clipboard-target', target);
  }
  if (typeof action === 'string') {
    element.setAttribute('data-clipboard-action', action);
  }
}

/**
 * Registers Ember Actions with ClipboardJS events
 * @param {Object} clipboard - ClipboardJS object
 * @param {Object} element - element to modify
 * @returns {Void}
 */
function registerActions(clipboard, element, args) {
  CLIPBOARD_EVENTS.forEach(event => {
    clipboard.on(event, () => {

      if (!element.disabled) {
        const onEvent = `on${event[0].toUpperCase()}${event.slice(1)}`;
        const action = args[onEvent];
        if (typeof action === 'string') {
          // eslint-disable-next-line ember/closure-actions
          this.sendAction(action, ...arguments);
        } else {
          action && action(...arguments);
        }
      }
    });
  });
}

export default modifier(function clipboard(element, _, args) {
  const clipboard = createClipboard(element, args);
  return () => {
    clipboard.destroy();
  }
});
