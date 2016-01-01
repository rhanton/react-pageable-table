'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageableTableStats = exports.PaginationLinks = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _rest = require('rest');

var _rest2 = _interopRequireDefault(_rest);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function splitTable(original) {
  var tableWrapper = document.createElement('div');
  tableWrapper.setAttribute('class', 'table-wrapper');

  var copy = original.clone();
  copy.querySelectorAll('td:not(:first-child), th:not(:first-child').style.display = 'none';

  tableWrapper.appendChild(copy);
  var pinned = document.createElement('div');
  pinned.setAttribute('class', 'pinned');
  pinned.appendChild(copy);

  var scrollable = document.createElement('div');
  scrollable.setAttribute('class', 'scrollable');
  scrollable.appendChild(original);

  setCellHeights(original, copy);
}

function unsplitTable(original) {
  document.querySelector('.table-wrapper').removeChild(document.querySelector('.pinned'));
  //original.unwrap();
  //original.unwrap();
}

function setCellHeights(original, copy) {
  var _this = this;

  var tr = original.querySelectorAll('tr'),
      tr_copy = copy.querySelectorAll('tr'),
      heights = [];

  tr.forEach(function (index) {
    var tx = _this.querySelectorAll('th, td');

    tx.forEach(function () {
      var height = _react2.default.findDOMNode(_this).offsetHeight;
      heights[index] = heights[index] || 0;
      if (height > heights[index]) heights[index] = height;
    });
  });

  tr_copy.forEach(function (index) {
    _react2.default.findDOMNode(_this).offsetHeight = heights[index];
  });
}

var PageableTable = (function (_Component) {
  _inherits(PageableTable, _Component);

  function PageableTable(props) {
    _classCallCheck(this, PageableTable);

    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(PageableTable).call(this, props));

    _this2.state = {
      data: [],
      pageable: {
        first: true,
        last: true,
        number: 0,
        numberOfElements: 0,
        totalElements: 0,
        totalPages: 0
      },
      switched: false
    };
    return _this2;
  }

  _createClass(PageableTable, [{
    key: 'updateTable',
    value: function updateTable() {
      var el = _react2.default.findDOMNode(this.refs.table);
      if (window.outerWidth < 767 && !this.state.switched) {
        this.setState({ switched: true });
        splitTable(el);
      } else {
        this.setState({ switched: false });
        unsplitTable(el);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      var path = this.props.dataPath;
      path += path.indexOf('?') > -1 ? '&' : '?';
      path += 'page=0' + (this.props.sort.length > 0 ? '&sort=' + this.props.sort.join('&sort=') : '');
      (0, _rest2.default)(path).then(function (data) {
        var pageable = (0, _objectAssign2.default)({}, JSON.parse(data.entity));
        delete pageable.content;
        _this3.setState({ data: JSON.parse(data.entity).content, pageable: pageable });
      });

      this.updateTable();
      window.addEventListener('resize', this.updateTable);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.updateTable);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this4 = this;

      if (nextProps.dataPath !== this.props.dataPath) {
        var path = nextProps.dataPath;
        path += path.indexOf('?') > -1 ? '&' : '?';
        path += nextProps.sort.length > 0 ? '&sort=' + nextProps.sort.join('&sort=') : '';
        (0, _rest2.default)(path).then(function (data) {
          var pageable = (0, _objectAssign2.default)({}, JSON.parse(data.entity));
          delete pageable.content;
          _this4.setState({ data: JSON.parse(data.entity).content, pageable: pageable });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var data = this.state.data.map(this.props.dataMapper);

      var stats = ['Page ' + (this.state.pageable.totalPages > 0 ? (0, _numeral2.default)(this.state.pageable.number + 1).format('0,0') : 0) + ' of ' + (0, _numeral2.default)(this.state.pageable.totalPages).format('0,0'), '# of records: ' + (0, _numeral2.default)(this.state.pageable.numberOfElements).format('0,0'), 'Total # of records: ' + (0, _numeral2.default)(this.state.pageable.totalElements).format('0,0')];

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(PaginationLinks, { onPageChange: this.props.onPageChange, pageable: this.state.pageable }),
        _react2.default.createElement(
          'table',
          { ref: 'table', className: 'pageable-table ' + this.props.className },
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
        ),
        _react2.default.createElement(PageableTableStats, { stats: stats })
      );
    }
  }]);

  return PageableTable;
})(_react.Component);

PageableTable.defaultProps = {
  dataMapper: function dataMapper() {},
  dataPath: '/',
  sort: [],
  tableHeader: function tableHeader() {},
  onPageChange: function onPageChange() {}
};
exports.default = PageableTable;

var PaginationLinks = exports.PaginationLinks = (function (_Component2) {
  _inherits(PaginationLinks, _Component2);

  function PaginationLinks() {
    var _Object$getPrototypeO;

    var _temp, _this5, _ret;

    _classCallCheck(this, PaginationLinks);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this5 = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(PaginationLinks)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this5), _this5.onFirst = function (e) {
      e.preventDefault();
      _this5.props.onPageChange(0);
    }, _this5.onPrevious = function (e) {
      e.preventDefault();
      var page = _this5.props.pageable.number > 0 ? _this5.props.pageable.number - 1 : 0;
      _this5.props.onPageChange(page);
    }, _this5.onNext = function (e) {
      e.preventDefault();
      var page = _this5.props.pageable.number < _this5.props.pageable.totalPages - 1 ? _this5.props.pageable.number + 1 : _this5.props.pageable.number;
      _this5.props.onPageChange(page);
    }, _this5.onLast = function (e) {
      e.preventDefault();
      _this5.props.onPageChange(_this5.props.pageable.totalPages - 1);
    }, _temp), _possibleConstructorReturn(_this5, _ret);
  }

  _createClass(PaginationLinks, [{
    key: 'render',
    value: function render() {
      return this.props.pageable.first && this.props.pageable.last ? null : _react2.default.createElement(
        'div',
        { className: 'pagination-links-container' },
        _react2.default.createElement(
          'ul',
          { className: 'pagination-links' },
          _react2.default.createElement(
            'li',
            { className: 'pagination-link ' + (this.props.pageable.first ? 'disabled' : ''), onClick: this.onFirst },
            _react2.default.createElement(
              'span',
              null,
              'First'
            )
          ),
          _react2.default.createElement(
            'li',
            { className: 'pagination-link ' + (this.props.pageable.first ? 'disabled' : ''), onClick: this.onPrevious },
            _react2.default.createElement(
              'span',
              null,
              'Previous'
            )
          ),
          _react2.default.createElement(
            'li',
            { className: 'pagination-link ' + (this.props.pageable.last ? 'disabled' : ''), onClick: this.onNext },
            _react2.default.createElement(
              'span',
              null,
              'Next'
            )
          ),
          _react2.default.createElement(
            'li',
            { className: 'pagination-link ' + (this.props.pageable.last ? 'disabled' : ''), onClick: this.onLast },
            _react2.default.createElement(
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
})(_react.Component);

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

var PageableTableStats = exports.PageableTableStats = (function (_Component3) {
  _inherits(PageableTableStats, _Component3);

  function PageableTableStats() {
    _classCallCheck(this, PageableTableStats);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(PageableTableStats).apply(this, arguments));
  }

  _createClass(PageableTableStats, [{
    key: 'render',
    value: function render() {
      var stats = this.props.stats.map(function (stat, idx) {
        return _react2.default.createElement(
          'li',
          { key: idx },
          stat
        );
      });
      return stats.length > 0 ? _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'ul',
          { className: 'pageable-table-stats' },
          stats
        )
      ) : null;
    }
  }]);

  return PageableTableStats;
})(_react.Component);

PageableTableStats.defaultProps = {
  stats: []
};