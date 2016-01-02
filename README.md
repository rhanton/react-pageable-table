# React Pageable Table

## Usage
Simply add the `<PageableTable/>` component to your own components as follows.

```javascript
<PageableTable dataPath={dataPath} dataMapper={this.dataMapper} tableHeader={this.tableHeader}  onPageChange={this.handlePageChange}/>
```

## Properties

### Data Path
The `dataPath` is a simple URL where the pageable table can fetch data from.  In your own component, you should
update `dataPath` whenever you want `<PageableTable/>` to show new data.  For example when changing page via
the `onPageChange` handler [see below](#page-change-handler) or view the [example](example/app/scripts/app.js) for details).

Pageable table will expect the server response to look like the following in order to properly construct pagination links.
Notice the actual data is contained within the "contents" property.  Then we have pagination related properties.

```javascript
{
  "content": [
    {"id": "1000000", "name": "Darth Vader", "description": "Darth Vader, born Anakin Skywalker, is a fictional character in the Star Wars universe."},
    {"id": "1000001", "name": "Luke Skywalker", "description": "Luke Skywalker is a fictional character appearing as the central protagonist of the original film trilogy and as a minor character in the prequel trilogy of the Star Wars universe created by George Lucas."},
    {"id": "1000002", "name": "Han Solo", "description": "Han Solo is a fictional character in the Star Wars franchise, portrayed in films by Harrison Ford."}
  ],
  "first": true,
  "last": true,
  "number": 0,
  "numberOfElements": 3,
  "totalElements": 3,
  "totalPages" : 1
}
```

> If you're using the [Spring Framework](http://spring.io) and [Spring Data Rest](http://projects.spring.io/spring-data-rest/),
with `Page` collections and `Pageable` request mapping parameters, then you can expect `<PageableTable/>` to work with
your server response out of the box since that's what it was modeled on.

### Data Mapper
The `dataMapper` should tell `<PageableTable/>` how to construct a single data row.  It accepts 2 arguments, first
an object representing data for 1 row, and second an index that you should apply to the `<tr>` element.

```javascript
dataMapper(record, index) {
  return (
    <tr key={index}>
      <td>{record.id}</td>
      <td>{record.name}</td>
      <td>{record.description}</td>
    </tr>
  );
}
```

### Table Header
The `tableHeader` should construct a header row.

```javascript
tableHeader() {
  return (
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Description</th>
    </tr>
  );
}
```

### Page Change Handler
The page change handler should result in an updated `dataPath` that will cause your component to call it's `render()`
method, passing the new `dataPath` value to `<PageableTable/>`.
```javascript
handlePageChange: function(page) {
  // Do something with "page" that causes dataPath to update.
  this.setState({dataPath: this.state.dataPath + '?page=' + page});
},
```

```javascript
<PageableTable dataPath={this.state.dataPath} onPageChange={this.handlePageChange}/>
```

### Sort
The `sort` property can be used to pass an array of sorting arguments which will be concatenated with the `dataPath`.
Your backend will need to know how to accept these arguments as query parameters.

In

```javascript
<PageableTable sort={[date,desc], [number,asc]}/>
```

Out

```
http://www.example.com/api/orders?page=0&sort=data,desc&sort=number,asc
```

### Styling
Passing a `className` property to `<PageableTable/>` will append the value to the `className` property of the
underlying `<table>` element.

In

```javascript
<PageableTable className="my-class"/>
```

Out

```html
<table className="my-class">
```