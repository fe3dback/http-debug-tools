```text




                  HTTP web application debug protocol

Abstract

   Union debug protocol for any modern web application.  Scheme can be
   easy implemented on any programming language and framework.

   Also any client can implement debug support and give more helpful
   information to developers.  HTTP(s) Response traditionally contains:

   o  response body
   o  response headers

   This protocol working over HTTP(s), and allows to add more
   information about what is going on during request, for example:

   o  sql queries
   o  events
   o  profiling (timings, flamegraph)
   o  matched routes
   o  checked acl
   o  used cache (hits, reads, writes, etc..)
   o  logs
   o  user information
   o  .. and many more (also custom data)

   Client is any application for making and debugging HTTP request, for
   example:

   o  any browser with dev tools, like "chromium"
   o  api test tools, like "postman"
   o  console utilities, like "curl"
   o  etc..

1.  How it works

   HTTP Client make real request to application server:

       /api/my-url/?hello-world

   Server return real response with 3 debug headers:

       X-Http-Debug-Id: 5b67d5...e09
       X-Http-Debug-Version: 1.0
       X-Http-Debug-Api: /_profile/?id=

   HTTP Client make request to debug/profile server url:

       /_profile/?id=5b67d5...e09

   Server return all debug information for initial request:

       {
           "id": "5b67d5...e09",
           "request_in": 1547058561177,
           "response_out": 1547058622423,
           "controller": "MyController",
           "cache_hits_count": 14,
           ...
       }

   See on flow-graph:

   | HTTP CLIENT                                                      |
   +------------------------------------------------------------------+
   |  |1| REAL                             |3| DEBUG                  |
   |  +++ REQUEST           ^              +++ REQUEST            ^   |
   |   |                    |               |                     |   |
   |   |                    |               |                     |   |
   |   v              REAL +++              v              DEBUG +++  |
   |              RESPONSE |2|                          RESPONSE |4|  |
   +------------------------------------------------------------------+
   | APP.BACKEND                                                      |

2.  Schema

   +---------------------+---------------+-----------------------------+
   | key                 | type          | description                 |
   +---------------------+---------------+-----------------------------+
   | id                  | guid          | unique request id           |
   | version             | int           | schema version              |
   | request_in          | ts_mili       | request in time             |
   | response_out        | ts_mili       | response out time           |
   | method              | method        | HTTP method                 |
   | uri                 | uri           | full request uri            |
   | headers             | param[]       | list of request headers     |
   | controller          | string        | custom controller name      |
   | query_data          | param[]       | parsed query (GET) data     |
   | post_data           | param[]       | parsed body (POST) data     |
   | session             | param[]       | user session data           |
   | user                | user          | current auth user           |
   | response_code       | int           | HTTP response code          |
   | memory_usage_bytes  | int           | max/peak memory usage (in   |
   |                     |               | bytes) during request       |
   | queries             | db_query[]    | database queries during     |
   |                     |               | request                     |
   | cache_total_count   | int           | cache read requests count   |
   | cache_hits_count    | int           | cache hit requests count    |
   | cache_writes_count  | int           | cache write requests count  |
   | cache_deletes_count | int           | cache delete requests count |
   | cache_duration      | duration_mili | total cache io duration in  |
   |                     |               | ms                          |
   | timeline            | todo          | n/a                         |
   | logs                | todo          | n/a                         |
   | events              | todo          | n/a                         |
   | routes              | todo          | n/a                         |
   | emails              | todo          | n/a                         |
   | views               | todo          | n/a                         |
   | async_requests      | todo          | n/a                         |
   | sub_requests        | todo          | n/a                         |
   +---------------------+---------------+-----------------------------+

3.  Types

3.1.  guid

   rfc4122 (UUID v4)

   Example:
   +------------------------------------+
   5b67d5ef-b9cc-4a3e-896d-93e5f4500e09
   +------------------------------------+

3.2.  ts_mili

   unixtime (GMT) with miliseconds

   Example:
   +------------------------------------+
   1547058561177
   +------------------------------------+

3.3.  duration_mili

   time duration in miliseconds

   Example:
   +------------------------------------+
   140
   +------------------------------------+

3.4.  method

   HTTP Method (uppercase)

   Example:
   +------------------------------------+
   POST
   +------------------------------------+

   Allowed:

   o  GET
   o  HEAD
   o  POST
   o  PUT
   o  PATCH
   o  DELETE
   o  OPTIONS

3.5.  uri

   https://en.wikipedia.org/wiki/Uniform_Resource_Identifier

   Example:
   +------------------------------------+
   https://example.com/api/hello?foo=bar
   +------------------------------------+

3.6.  param

   Example:
   +------------------------------------+
   {
       "key": "paramName",
       "value": "paramValue"
   }
   +------------------------------------+

   Schema:
   +------------------------------------+
   - *string*:key
   - *string*:value
   +------------------------------------+

3.7.  user

   Example:
   +------------------------------------+
   {
       "id": "12345",
       "name": "admin",
       "groups": [
           {
               "id": "42",
               "title": "editors",
               "perms": [
                   {
                       "key": "view",
                       "value": "articles"
                   }
               ]
           }
       ]
   }
   +------------------------------------+

   Schema:
   +------------------------------------+
   - *string*:id
   - ?*string*:name
   - ?*string*:email
   - ?*user_group*[]:groups
   +------------------------------------+

3.8.  user_group

   Example:
   +------------------------------------+
   {
       "id": "42",
       "title": "editors",
       "perms": [
           {
               "key": "view",
               "value": "articles"
           }
       ]
   }
   +------------------------------------+

   Schema:
   +------------------------------------+
   - *string*:id
   - ?*string*:title
   - ?*param*[]:perms
   +------------------------------------+

3.9.  db_query

   Example:
   +------------------------------------+
   {
       "query": "SELECT * FROM articles WHERE ID = ?id",
       "parsed": "SELECT * FROM articles WHERE ID = 1;",
       "duration": 15,
       "bindings": [
           {
               "key": "id",
               "value": "2"
           }
       ]
   }
   +------------------------------------+

   Schema:
   +------------------------------------+
   - *string*:query
   - ?*string*:parsed
   - ?*duration_mili*:duration
   - ?*param*[]:bindings
   +------------------------------------+

```
