'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Pagination = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rest = require('rest');

var _rest2 = _interopRequireDefault(_rest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PageableTable = (function (_Component) {
  _inherits(PageableTable, _Component);

  function PageableTable(props) {
    _classCallCheck(this, PageableTable);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PageableTable).call(this, props));

    _this.state = {
      data: []
    };
    return _this;
  }

  _createClass(PageableTable, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var path = this.props.dataPath;
      path += path.indexOf('?') > -1 ? '&' : '?';
      path += 'page=0' + (this.props.sort.length > 0 ? '&sort=' + this.props.sort.join('&sort=') : '');
      (0, _rest2.default)(path).then(function (data) {
        return _this2.setState({ data: JSON.parse(data.entity).content });
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this3 = this;

      if (nextProps.dataPath !== this.props.dataPath) {
        var path = nextProps.dataPath;
        path += path.indexOf('?') > -1 ? '&' : '?';
        path += 'page=0' + (nextProps.sort.length > 0 ? '&sort=' + nextProps.sort.join('&sort=') : '');
        (0, _rest2.default)(path).then(function (data) {
          return _this3.setState({ data: JSON.parse(data.entity).content });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var data = this.state.data.map(this.props.dataMapper);
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(Pagination, null),
        _react2.default.createElement(
          'table',
          { className: 'pageable-table ' + this.props.className },
          _react2.default.createElement(
            'thead',
            null,
            this.props.tableHeader()
          ),
          _react2.default.createElement(
            'tbody',
            null,
            data
          )
        )
      );
    }
  }]);

  return PageableTable;
})(_react.Component);

exports.default = PageableTable;

PageableTable.defaultProps = {
  dataMapper: function dataMapper() {},
  dataPath: '/',
  sort: [],
  tableHeader: function tableHeader() {}
};

var Pagination = exports.Pagination = (function (_Component2) {
  _inherits(Pagination, _Component2);

  function Pagination() {
    _classCallCheck(this, Pagination);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Pagination).apply(this, arguments));
  }

  _createClass(Pagination, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'ul',
        { className: 'pagination' },
        _react2.default.createElement(
          'li',
          { className: 'pagination-link' },
          'First'
        ),
        _react2.default.createElement(
          'li',
          { className: 'pagination-link' },
          'Previous'
        ),
        _react2.default.createElement(
          'li',
          { className: 'pagination-link' },
          'Next'
        ),
        _react2.default.createElement(
          'li',
          { className: 'pagination-link' },
          'Last'
        )
      );
    }
  }]);

  return Pagination;
})(_react.Component);