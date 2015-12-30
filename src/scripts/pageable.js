import React, {Component} from 'react';
import rest from 'rest';
import assign from 'object-assign';

export default class PageableTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      pageable: {
        totalElements: 0,
        numberOfElements: 0,
        number: 0,
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
      path += 'page=0' + (nextProps.sort.length > 0 ? '&sort=' + nextProps.sort.join('&sort=') : '');
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
      'Page ' + (this.state.pageable.totalPages > 0 ? this.state.pageable.number + 1 : 0) + ' of ' + this.state.pageable.totalPages,
      '# of records: ' + this.state.pageable.numberOfElements,
      'Total # of records: ' + this.state.pageable.totalElements
    ];

    return (
      <div>
        <PaginationLinks/>
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
  tableHeader: function() {}
};

export class PaginationLinks extends Component {
  render() {
    return (
      <ul className="pagination-links">
        <li className="pagination-link">First</li>
        <li className="pagination-link">Previous</li>
        <li className="pagination-link">Next</li>
        <li className="pagination-link">Last</li>
      </ul>
    );
  }
}

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