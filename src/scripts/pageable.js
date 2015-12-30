import React, {Component} from 'react';
import rest from 'rest';
import assign from 'object-assign';
import numeral from 'numeral';

export default class PageableTable extends Component {
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
      }
    };
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
        <table className={'pageable-table ' + this.props.className}>
          <thead>{this.props.tableHeader()}</thead>
          <tbody>{data}</tbody>
        </table>
        <PageableTableStats stats={stats}/>
      </div>
    );
  }
}
PageableTable.defaultProps = {
  dataMapper: function() {},
  dataPath: '/',
  sort: [],
  tableHeader: function() {},
  onPageChange: function() {}
};

export class PaginationLinks extends Component {
  constructor(props) {
    super(props);

    this.onFirst = this.onFirst.bind(this);
    this.onPrevious = this.onPrevious.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onLast = this.onLast.bind(this);
  }

  onFirst(e) {
    e.preventDefault();
    this.props.onPageChange(0);
  }

  onPrevious(e) {
    e.preventDefault();
    let page = this.props.pageable.number > 0 ? this.props.pageable.number - 1 : 0;
    this.props.onPageChange(page);
  }

  onNext(e) {
    e.preventDefault();
    let page = this.props.pageable.number < (this.props.pageable.totalPages - 1) ? this.props.pageable.number + 1 : this.props.pageable.number;
    this.props.onPageChange(page);
  }

  onLast(e) {
    e.preventDefault();
    this.props.onPageChange(this.props.pageable.totalPages - 1);
  }

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
PaginationLinks.defaultProps = {
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

export class PageableTableStats extends Component {
  render() {
    let stats = this.props.stats.map(function(stat, idx) {
      return <li key={idx}>{stat}</li>;
    });
    return stats.length > 0 ? <div><ul className="pageable-table-stats">{stats}</ul></div> : null;
  }
}
PageableTableStats.defaultProps = {
  stats: []
};