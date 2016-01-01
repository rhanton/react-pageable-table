import React, {Component} from 'react';
import rest from 'rest';
import assign from 'object-assign';
import numeral from 'numeral';

function splitTable(original) {
  let tableWrapper = document.createElement('div');
  tableWrapper.setAttribute('class', 'table-wrapper');

  let copy = original.clone();
  copy.querySelectorAll('td:not(:first-child), th:not(:first-child').style.display = 'none';

  tableWrapper.appendChild(copy);
  let pinned = document.createElement('div');
  pinned.setAttribute('class', 'pinned');
  pinned.appendChild(copy);

  let scrollable = document.createElement('div');
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
  var tr = original.querySelectorAll('tr'),
    tr_copy = copy.querySelectorAll('tr'),
    heights = [];

  tr.forEach(index => {
    let tx = this.querySelectorAll('th, td');

    tx.forEach(() => {
      let height = React.findDOMNode(this).offsetHeight;
      heights[index] = heights[index] || 0;
      if (height > heights[index]) heights[index] = height;
    });

  });

  tr_copy.forEach(index => {
    React.findDOMNode(this).offsetHeight = heights[index];
  });
}

export default class PageableTable extends Component {
  static defaultProps = {
    dataMapper: function() {},
    dataPath: '/',
    sort: [],
    tableHeader: function() {},
    onPageChange: function() {}
  };

  constructor(props) {
    super(props);

    this.state = {
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
  }

  updateTable() {
    let el = React.findDOMNode(this.refs.table);
    if(window.outerWidth < 767 && !this.state.switched) {
      this.setState({switched: true});
      splitTable(el);
    } else {
      this.setState({switched: false});
      unsplitTable(el);
    }
  }

  componentDidMount() {
    let path = this.props.dataPath;
    path += path.indexOf('?') > -1 ? '&' : '?';
    path += 'page=0' + (this.props.sort.length > 0 ? '&sort=' + this.props.sort.join('&sort=') : '');
    rest(path).then(data => {
      let pageable = assign({}, JSON.parse(data.entity));
      delete pageable.content;
      this.setState({data: JSON.parse(data.entity).content, pageable: pageable})
    });

    this.updateTable();
    window.addEventListener('resize', this.updateTable);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateTable);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.dataPath !== this.props.dataPath) {
      let path = nextProps.dataPath;
      path += path.indexOf('?') > -1 ? '&' : '?';
      path += nextProps.sort.length > 0 ? '&sort=' + nextProps.sort.join('&sort=') : '';
      rest(path).then(data => {
        let pageable = assign({}, JSON.parse(data.entity));
        delete pageable.content;
        this.setState({data: JSON.parse(data.entity).content, pageable: pageable})
      });
    }
  }

  render() {
    let data = this.state.data.map(this.props.dataMapper);

    let stats = [
      'Page ' + (this.state.pageable.totalPages > 0 ? numeral(this.state.pageable.number + 1).format('0,0') : 0) + ' of ' + numeral(this.state.pageable.totalPages).format('0,0'),
      '# of records: ' + numeral(this.state.pageable.numberOfElements).format('0,0'),
      'Total # of records: ' + numeral(this.state.pageable.totalElements).format('0,0')
    ];

    return (
      <div>
        <PaginationLinks onPageChange={this.props.onPageChange} pageable={this.state.pageable}/>
        <table ref="table" className={'pageable-table ' + this.props.className}>
          <thead>{this.props.tableHeader()}</thead>
          <tbody>{data}</tbody>
        </table>
        <PageableTableStats stats={stats}/>
      </div>
    );
  }
}

export class PaginationLinks extends Component {
  static defaultProps = {
    onPageChange: function() {},
    pageable: {
      first: true,
      last: true,
      number: 0,
      numberOfElements: 0,
      totalElements: 0,
      totalPages: 0
    }
  };

  onFirst = (e) => {
    e.preventDefault();
    this.props.onPageChange(0);
  };

  onPrevious = (e) => {
    e.preventDefault();
    let page = this.props.pageable.number > 0 ? this.props.pageable.number - 1 : 0;
    this.props.onPageChange(page);
  };

  onNext = (e) => {
    e.preventDefault();
    let page = this.props.pageable.number < (this.props.pageable.totalPages - 1) ? this.props.pageable.number + 1 : this.props.pageable.number;
    this.props.onPageChange(page);
  };

  onLast = (e) => {
    e.preventDefault();
    this.props.onPageChange(this.props.pageable.totalPages - 1);
  };

  render() {
    return (
      this.props.pageable.first && this.props.pageable.last ? null :
        <div className="pagination-links-container">
          <ul className="pagination-links">
            <li className={'pagination-link ' + (this.props.pageable.first ? 'disabled' : '')} onClick={this.onFirst}><span>First</span></li>
            <li className={'pagination-link ' + (this.props.pageable.first ? 'disabled' : '')} onClick={this.onPrevious}><span>Previous</span></li>
            <li className={'pagination-link ' + (this.props.pageable.last ? 'disabled' : '')} onClick={this.onNext}><span>Next</span></li>
            <li className={'pagination-link ' + (this.props.pageable.last ? 'disabled' : '')} onClick={this.onLast}><span>Last</span></li>
          </ul>
        </div>
    );
  }
}

export class PageableTableStats extends Component {
  static defaultProps = {
    stats: []
  };

  render() {
    let stats = this.props.stats.map(function(stat, idx) {
      return <li key={idx}>{stat}</li>;
    });
    return stats.length > 0 ? <div><ul className="pageable-table-stats">{stats}</ul></div> : null;
  }
}