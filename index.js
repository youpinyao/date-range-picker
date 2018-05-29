import Picker from './src';

// eslint-disable-next-line
(function(global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    // eslint-disable-next-line
    global.YDateRangePicker = factory();
  }
})(this, () => Picker);

export default Picker;
