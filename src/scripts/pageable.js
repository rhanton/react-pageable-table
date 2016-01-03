import React, {Component} from 'react';
import rest from 'rest';
import numeral from 'numeral';
import assign from 'object-assign';

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
      responsive: false
    };
  }

  updateTable() {
    this.setState({responsive: window.outerWidth < 767});
  }

  componentDidMount() {
    let path = this.props.dataPath;
    path += path.indexOf('?') > -1 ? '&' : '?';
    path += 'page=0' + (this.props.sort.length > 0 ? '&sort=' + this.props.sort.join('&sort=') : '');
    rest(path).then(data => {
      let pageable = assign({}, JSON.parse(data.entity));
      delete pageable.content;
      this.setState({data: JSON.parse(data.entity).content, pageable: pageable});
      this.updateTable();
      window.addEventListener('resize', this.updateTable.bind(this));
    });
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
        this.updateTable();
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    let clearPinned = (p) => {
      while(p.firstChild) p.removeChild(p.firstChild);
    };

    if(nextState.responsive) {
      let copy = React.findDOMNode(this.refs.table).cloneNode(true);
      let columnsToHide = copy.querySelectorAll('td:not(:first-child), th:not(:first-child)');
      for(let x=0; x<columnsToHide.length; x++) {
        columnsToHide[x].style.display = 'none';
      }

      let pinned = React.findDOMNode(this.refs.pinned);
      clearPinned(pinned);
      if(pinned.childNodes.length === 0)
        pinned.appendChild(copy);
    } else {
      clearPinned(React.findDOMNode(this.refs.pinned));
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
        <div className={this.state.responsive ? 'responsive' : ''}>
          <div className={this.state.responsive ? 'scrollable' : ''}>
            <table ref="table" className={'pageable-table ' + (typeof this.props.className !== 'undefined' ? this.props.className : '')}>
              <thead>{this.props.tableHeader()}</thead>
              <tbody>{data}</tbody>
            </table>
          </div>
          <div ref="pinned" className="pinned"></div>
        </div>
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