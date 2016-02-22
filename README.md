# evolutility-server

Generic REST for CRUD (Create, Read, Update, Delete) and more. 

This project is still a work in progress. 
The goal is to make a generic RESTful API for Postgres, Node.js and Express. 
It will use the same metadata as [Evolutility UI](http://evoluteur.github.io/evolutility/index.html).


## Installation

1- Download Evolutility-server.

2- Create a PostgreSQL database.

3- In server/config.js set your PostgreSQL connection string to the new database.

4- In the command line type the following:

```bash
# Install dependencies
npm install

# Add Evolutility client:
bower install

# Copy Evolutility client to Node.js
grunt

# Create sample tables
node server/models/database.js

# Run node.js web server
npm start

```

5- In a web browser go to the url http://localhost:3000/


## API
Evolutility-server provides a generic RESTful API for CRUD (Create, Read, Update, Delete) and more.
It is a partial server-side Javascript implementation of [PostgREST](http://postgrest.com) using Node.js, Express, and Postgres.


### Requesting Information

#### Get Many
Every model is exposed. You can query lists of items by using the model ID.

```
GET /<object>

/todo
```


#### Get One
To get a specific item by ID, use /ID.

```
GET /<object>/<id>

GET /todo/12

```


#### Filtering
You can filter result rows by adding conditions on fields, each condition is a query string parameter. 

```
GET /<object>/<field.id>=<operator>.<value>

GET /todo?title=sw.a

GET /todo?priority=in.1,2,3

```
Adding multiple parameters conjoins the conditions:
```
todo?complete=0&duedate=lt.2016-01-01

```

These operators are available:

| Operator     |  Meaning                |
|--------------|:-----------------------:|
| eq           | equals                  |
| gt           | greater than            |
| lt           | less than               |
| gte          | less than or equal      |
| lte          | less than or equal      |
| ct           | contains                |
| sw           | start with              |
| fw           | finishes than           |
| in           | one of a list of values |
| 0            | is false                |
| 1            | is true                 |
| null         | is null                 |
| nn           | is not null             |


#### Ordering

The reserved word "order" reorders the response rows. It uses a comma-separated list of fields and directions:
```
GET /todo?order=complete.asc

GET /todo?order=priority.desc,title.asc
```
If no direction is specified it defaults to ascending order:
```
GET /todo?order=duedate
```

#### Limiting and Pagination


The reserved words "page" and "pageSize" limits the response rows.
```
GET /todo?page=1&pageSize=5

```

### Updating Data

#### Record Creation

To create a row in a database table post a JSON object whose keys are the names of the columns you would like to create. Missing keys will be set to default values when applicable.

```
POST /todo
{ field.id1: 'value1', field.id2: 'value2'}
```

#### Update

```
PATCH /todo
{ field.id1: 'value1', field.id2: 'value2'}
```

#### Deletion
Simply use the DELETE verb with the id of the record to remove. 

```
DELETE /todo/5
```

## License

Copyright (c) 2016 Olivier Giulieri.

Evolutility.js is released under the GNU Affero General Public License version 3 [GNU AGPLv3](http://www.gnu.org/licenses/agpl-3.0.html).
