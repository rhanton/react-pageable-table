'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports.PageableTableStats = PageableTableStats;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rest = require('rest');

var _rest2 = _interopRequireDefault(_rest);

var _restInterceptorMime = require('rest/interceptor/mime');

var _restInterceptorMime2 = _interopRequireDefault(_restInterceptorMime);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var client = _rest2['default'].wrap(_restInterceptorMime2['default'], { mime: 'application/json' });

var PageableTable = (function (_React$Component) {
  function PageableTable(props) {
    _classCallCheck(this, PageableTable);

    _get(Object.getPrototypeOf(PageableTable.prototype), 'constructor', this).call(this, props);

    this.state = {
      data: [],
      pageable: {
        first: true,
        last: true,
        number: 0,
        numberOfElements: 0,
        totalElements: 0,
        totalPages: 0
      }
    };
  }

  _inherits(PageableTable, _React$Component);

  _createClass(PageableTable, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this = this;

      var path = this.props.dataPath;
      path += path.indexOf('?') > -1 ? '&' : '?';
      path += this.props.sort.length > 0 ? 'sort=' + this.props.sort.join('&sort=') : '';
      client(path).then(function (_ref) {
        var entity = _ref.entity;
        return _this.setState({ data: entity.content, pageable: entity });
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      if (nextProps.dataPath !== this.props.dataPath) {
        var path = nextProps.dataPath;
        path += path.indexOf('?') > -1 ? '&' : '?';
        path += nextProps.sort.length > 0 ? 'sort=' + nextProps.sort.join('&sort=') : '';
        client(path).then(function (_ref2) {
          var entity = _ref2.entity;
          return _this2.setState({ data: entity.content, pageable: entity });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var data = this.state.data.map(this.props.dataMapper);

      var stats = ['Page ' + (this.state.pageable.totalPages > 0 ? (0, _numeral2['default'])(this.state.pageable.number + 1).format('0,0') : 0) + ' of ' + (0, _numeral2['default'])(this.state.pageable.totalPages).format('0,0'), '# of records: ' + (0, _numeral2['default'])(this.state.pageable.numberOfElements).format('0,0'), 'Total # of records: ' + (0, _numeral2['default'])(this.state.pageable.totalElements).format('0,0')];

      return _react2['default'].createElement(
        'div',
        null,
        _react2['default'].createElement(PaginationLinks, { onPageChange: this.props.onPageChange, pageable: this.state.pageable }),
        _react2['default'].createElement(
          'div',
          { className: 'table-wrapper' },
          _react2['default'].createElement(
            'table',
            { ref: 'table', className: 'pageable-table ' + this.props.className },
            _react2['default'].createElement(
              'thead',
              null,
              this.props.tableHeader()
            ),
            _react2['default'].createElement(
              'tbody',
              null,
              data
            )
          )
        ),
        _react2['default'].createElement(PageableTableStats, { stats: stats })
      );
    }
  }]);

  return PageableTable;
})(_react2['default'].Component);

exports['default'] = PageableTable;

PageableTable.defaultProps = {
  dataMapper: function dataMapper() {},
  dataPath: '/',
  sort: [],
  tableHeader: function tableHeader() {},
  onPageChange: function onPageChange() {},
  className: ''
};

PageableTable.propTypes = {
  dataPath: _react2['default'].PropTypes.string,
  sort: _react2['default'].PropTypes.array,
  dataMapper: _react2['default'].PropTypes.func,
  onPageChange: _react2['default'].PropTypes.func,
  className: _react2['default'].PropTypes.string,
  tableHeader: _react2['default'].PropTypes.func
};

var PaginationLinks = (function (_React$Component2) {
  function PaginationLinks(props) {
    _classCallCheck(this, PaginationLinks);

    _get(Object.getPrototypeOf(PaginationLinks.prototype), 'constructor', this).call(this, props);
    this.onFirst = this.onFirst.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onLast = this.onLast.bind(this);
  }

  _inherits(PaginationLinks, _React$Component2);

  _createClass(PaginationLinks, [{
    key: 'onFirst',
    value: function onFirst(e) {
      e.preventDefault();
      this.props.onPageChange(0);
    }
  }, {
    key: 'onPrevious',
    value: function onPrevious(e) {
      e.preventDefault();
      var page = this.props.pageable.number > 0 ? this.props.pageable.number - 1 : 0;
      this.props.onPageChange(page);
    }
  }, {
    key: 'onNext',
    value: function onNext(e) {
      e.preventDefault();
      var page = this.props.pageable.number < this.props.pageable.totalPages - 1 ? this.props.pageable.number + 1 : this.props.pageable.number;
      this.props.onPageChange(page);
    }
  }, {
    key: 'onLast',
    value: function onLast(e) {
      e.preventDefault();
      this.props.onPageChange(this.props.pageable.totalPages - 1);
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.pageable.first && this.props.pageable.last ? null : _react2['default'].createElement(
        'div',
        { className: 'pagination-links-container' },
        _react2['default'].createElement(
          'ul',
          { className: 'pagination-links' },
          _react2['default'].createElement(
            'li',
            { className: 'pagination-link ' + (this.props.pageable.first ? 'disabled' : ''), onClick: this.onFirst },
            _react2['default'].createElement(
              'span',
              null,
              'First'
            )
          ),
          _react2['default'].createElement(
            'li',
            { className: 'pagination-link ' + (this.props.pageable.first ? 'disabled' : ''), onClick: this.onPrevious },
            _react2['default'].createElement(
              'span',
              null,
              'Previous'
            )
          ),
          _react2['default'].createElement(
            'li',
            { className: 'pagination-link ' + (this.props.pageable.last ? 'disabled' : ''), onClick: this.onNext },
            _react2['default'].createElement(
              'span',
              null,
              'Next'
            )
          ),
          _react2['default'].createElement(
            'li',
            { className: 'pagination-link ' + (this.props.pageable.last ? 'disabled' : ''), onClick: this.onLast },
            _react2['default'].createElement(
              'span',
              null,
              'Last'
            )
          )
        )
      );
    }
  }]);

  return PaginationLinks;
})(_react2['default'].Component);

exports.PaginationLinks = PaginationLinks;

PaginationLinks.defaultProps = {
  onPageChange: function onPageChange() {},
  pageable: {
    first: true,
    last: true,
    number: 0,
    numberOfElements: 0,
    totalElements: 0,
    totalPages: 0
  }
};

PaginationLinks.propTypes = {
  onPageChange: _react2['default'].PropTypes.func,
  pageable: _react2['default'].PropTypes.object
};

function PageableTableStats(_ref3) {
  var stats = _ref3.stats;

  return stats.length > 0 ? _react2['default'].createElement(
    'div',
    null,
    _react2['default'].createElement(
      'ul',
      { className: 'pageable-table-stats' },
      stats.map(function (stat, idx) {
        return _react2['default'].createElement(
          'li',
          { key: idx },
          stat
        );
      })
    )
  ) : null;
}

PageableTableStats.defaultProps = {
  stats: []
};

PageableTableStats.propTypes = {
  stats: _react2['default'].PropTypes.array
};
