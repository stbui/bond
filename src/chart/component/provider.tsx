import React from 'react';
import ReactDom from 'react-dom';
import chartlayout from '../model/chartlayout';

export default class Provider extends React.Component {
  constructor(props) {
    super(props);
    this.chartLayout = props.chartLayout;
  }

  getChildContext() {
    return { chartLayout: this.chartLayout };
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

// var PropTypes = __webpack_require__('../../node_modules/prop-types/index.js');
// var chartlayout_1 = __webpack_require__('./model/chartlayout.ts');
// var Provider = /** @class */ (function (_super) {
//   __extends(Provider, _super);
//   function Provider(props, context) {
//     var _this = _super.call(this, props, context) || this;
//     _this.chartLayout = props.chartLayout;
//     return _this;
//   }
//   Provider.prototype.getChildContext = function () {
//     return { chartLayout: this.chartLayout };
//   };
//   Provider.prototype.render = function () {
//     return React.Children.only(this.props.children);
//   };
//   Provider.childContextTypes = {
//     chartLayout: PropTypes.instanceOf(chartlayout_1.default),
//   };
//   return Provider;
// })(React.Component);
