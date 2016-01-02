import React, {Component} from 'react';
import PageableTable from '../../../src/scripts/pageable';

export default class App extends Component {
  tableHeader() {
    return (
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Description</th>
      </tr>
    );
  }

  dataMapper(sw, idx) {
    return (
      <tr key={idx}>
        <td>{sw.id}</td>
        <td>{sw.name}</td>
        <td>{sw.description}</td>
      </tr>
    );
  }

  render() {
    return (
      <div className="row">
        <h1>Table Wars</h1>
        <PageableTable dataPath="data/data.json" dataMapper={this.dataMapper} tableHeader={this.tableHeader}/>
      </div>
    );
  }
}

React.render(<App/>, document.getElementById('app'));