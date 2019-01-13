```text




                                                                K. Perov
                                                        January 13, 2019


                  HTTP web application debug protocol
                             draft-hwad-01

Abstract

   Union debug protocol for any modern web application.  Scheme can be
   easy implemented on any programming language and framework.

   Also any client can implement debug support and give more helpful
   information to developers.  HTTP response traditionally contains:

   o  response body
   o  response headers

   This protocol working over HTTP, and allows to add more information
   about what is going on during request, for example:

   o  sql queries
   o  events
   o  profiling (timings, flamegraph)
   o  matched routes
   o  checked acl
   o  used cache (hits, reads, writes, etc..)
   o  logs
   o  user information
   o  .. and many more (also custom data)

Table of Contents

   1.  Introduction  . . . . . . . . . . . . . . . . . . . . . . . .   2
   2.  How it works {#how-it-works)  . . . . . . . . . . . . . . . .   2
   3.  Schema types {#schema-types)  . . . . . . . . . . . . . . . .   3
   4.  Types {#types)  . . . . . . . . . . . . . . . . . . . . . . .   4
     4.1.  guid (string) . . . . . . . . . . . . . . . . . . . . . .   4
     4.2.  ts_mili (int) . . . . . . . . . . . . . . . . . . . . . .   5
     4.3.  duration_mili (int) . . . . . . . . . . . . . . . . . . .   5
     4.4.  uri (string)  . . . . . . . . . . . . . . . . . . . . . .   5
     4.5.  method (string) . . . . . . . . . . . . . . . . . . . . .   5
     4.6.  param (object)  . . . . . . . . . . . . . . . . . . . . .   6
     4.7.  rel_path (string) . . . . . . . . . . . . . . . . . . . .   6
     4.8.  place (object)  . . . . . . . . . . . . . . . . . . . . .   6
     4.9.  user (object) . . . . . . . . . . . . . . . . . . . . . .   7
     4.10. user_group (object) . . . . . . . . . . . . . . . . . . .   8
     4.11. db_query (object) . . . . . . . . . . . . . . . . . . . .   9



Perov                     Expires July 17, 2019                 [Page 1]

                                  hwad                      January 2019


   5.  References  . . . . . . . . . . . . . . . . . . . . . . . . .  11
     5.1.  Normative References  . . . . . . . . . . . . . . . . . .  11
     5.2.  Informative References  . . . . . . . . . . . . . . . . .  11
   Author's Address  . . . . . . . . . . . . . . . . . . . . . . . .  11

1.  Introduction

   The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
   "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this
   document are to be interpreted as described in RFC 2119, BCP 14
   [RFC2119] and indicate requirement levels for compliant CoAP
   implementations.

   Terms:

   Server:  Any web server which can handle incoming HTTP requests.  For
      Client is testing web application backend.
   Client:  GUI/console application for making and debugging HTTP
      request to Server, for example:

      *  any browser with dev tools, like "chromium"
      *  api test tools, like "postman"
      *  console utilities, like "curl"
      *  etc..
   Request:  Any HTTP request.
   Response:  Any HTTP response.
   Debug-Request:  Request to specified application debug URL.
   Debug-Response:  Response with debug information about first Request.

2.  How it works {#how-it-works)

   Client make real Request to Server:

       /api/my-url/?hello-world

   Server return real Response with 3 debug headers:

       X-Http-Debug-Id: 5b67d5...e09
       X-Http-Debug-Version: 1.0
       X-Http-Debug-Api: /_profile/?id=

   Client make Debug-Request to Server:

       /_profile/?id=5b67d5...e09

   Server return Debug-Response:





Perov                     Expires July 17, 2019                 [Page 2]

                                  hwad                      January 2019


       {
           "id": "5b67d5...e09",
           "request_in": 1547058561177,
           "response_out": 1547058622423,
           "controller": "MyController",
           "cache_hits_count": 14,
           "queries": [
               {
                   "db_type": "mysql",
                   "query": "SELECT * FROM articles WHERE ID = ?id",
                   "parsed": "SELECT * FROM articles WHERE ID = 1;",
                   "duration": 15,
               }
           ]
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

3.  Schema types {#schema-types)




















Perov                     Expires July 17, 2019                 [Page 3]

                                  hwad                      January 2019


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

4.  Types {#types)

4.1.  guid (string)

   rfc4122 (UUID v4)

   Example:
   +-------------------------------------------------------------------+
   5b67d5ef-b9cc-4a3e-896d-93e5f4500e09
   +-------------------------------------------------------------------+





Perov                     Expires July 17, 2019                 [Page 4]

                                  hwad                      January 2019


4.2.  ts_mili (int)

   unixtime (GMT) with milliseconds

   +-------------------------------------------------------------------+
   Example:
   +-------------------------------------------------------------------+
   1547058561177
   +-------------------------------------------------------------------+

4.3.  duration_mili (int)

   time duration in milliseconds

   +-------------------------------------------------------------------+
   Example:
   +-------------------------------------------------------------------+
   140
   +-------------------------------------------------------------------+

4.4.  uri (string)

   Read more:
   https://en.wikipedia.org/wiki/Uniform_Resource_Identifier

   +-------------------------------------------------------------------+
   Example:
   +-------------------------------------------------------------------+
   https://example.com/api/hello?foo=bar
   +-------------------------------------------------------------------+

4.5.  method (string)

   HTTP Method (uppercase)

   +-------------------------------------------------------------------+
   Example:
   +-------------------------------------------------------------------+
   POST
   +-------------------------------------------------------------------+

   Allowed:

   o  GET
   o  HEAD
   o  POST
   o  PUT
   o  PATCH



Perov                     Expires July 17, 2019                 [Page 5]

                                  hwad                      January 2019


   o  DELETE
   o  OPTIONS

4.6.  param (object)

   +-------------------------------------------------------------------+
   Example:
   +-------------------------------------------------------------------+
   {
       "key": "42",
       "value": "hello world"
   }
   +-------------------------------------------------------------------+

           +-------+--------+----------+-----------------------+
           | key   | type   | required | description           |
           +-------+--------+----------+-----------------------+
           | key   | string |    Y     | param title/code/name |
           | value | string |    Y     | param value           |
           +-------+--------+----------+-----------------------+

4.7.  rel_path (string)

   +-------------------------------------------------------------------+
   Example:
   +-------------------------------------------------------------------+
   /src/renderer/main.js
   +-------------------------------------------------------------------+

   Rules:

   o  Relative to project directory
   o  file path SHOULD start with "/"
   o  Directory separator SHOULD BE "/" on all operation systems

   Client specification:

   o  Client SHOULD contain "project root" setting.  This "project root"
      SHOULD be used only for file content loading (code display
      purpose).
   o  All GUI sections should display only relative path as defined.

4.8.  place (object)








Perov                     Expires July 17, 2019                 [Page 6]

                                  hwad                      January 2019


   +-------------------------------------------------------------------+
   Example:
   +-------------------------------------------------------------------+
   {
       "file": "/src/renderer/main.js",
       "line": 123,
       "pos": 56
   }
   +-------------------------------------------------------------------+

   +---------+----------+----------+-----------------------------------+
   | key     | type     | required | description                       |
   +---------+----------+----------+-----------------------------------+
   | file    | rel_path |    Y     | relative path to project root     |
   | line    | int      |    N     | line in file                      |
   | pos     | int      |    N     | caret position in line (work only |
   |         |          |          | if "line" defined)                |
   | pos_end | int      |    N     | caret end position in line (work  |
   |         |          |          | only if "pos" defined)            |
   +---------+----------+----------+-----------------------------------+

   Note:

   o  If "pos" and "pos_end" defined, client application MUST highlight
      range between pos <= i && i <= pos_end.
   o  if "pos" defined without "pos_end", client application MUST
      highlight only caret position on line.

   Client specification:

   o  Client SHOULD contain "project root" setting, and display all
      debug sections with "place" property as "code preview editor".
   o  Client MAY load +-3 lines before and after specified code line.
   o  Client MAY use syntax highlight based on file extension

4.9.  user (object)















Perov                     Expires July 17, 2019                 [Page 7]

                                  hwad                      January 2019


   +-------------------------------------------------------------------+
   Example:
   +-------------------------------------------------------------------+
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
   +-------------------------------------------------------------------+

        +--------+--------------+----------+----------------------+
        | key    | type         | required | description          |
        +--------+--------------+----------+----------------------+
        | id     | string       |    Y     | user id              |
        | name   | string       |          | user name/code/title |
        | email  | string       |          | user email           |
        | groups | user_group[] |          | list of user groups  |
        +--------+--------------+----------+----------------------+

4.10.  user_group (object)




















Perov                     Expires July 17, 2019                 [Page 8]

                                  hwad                      January 2019


   +-------------------------------------------------------------------+
   Example:
   +-------------------------------------------------------------------+
   {
       "id": "42",
       "title": "editors",
       "perms": [
           {
               "key": "articles",
               "value": "view"
           },
           {
               "key": "articles",
               "value": "edit"
           }
       ],
        "props": [
            {
                "key": "custom_prop_name",
                "value": "hello_world"
            }
        ],
   }
   +-------------------------------------------------------------------+

       +-------+---------+----------+-----------------------------+
       | key   | type    | required | description                 |
       +-------+---------+----------+-----------------------------+
       | id    | string  |    Y     | group id                    |
       | title | string  |          | group name/code/title       |
       | perms | param[] |          | list of perms               |
       | props | param[] |          | any additional custom props |
       +-------+---------+----------+-----------------------------+

4.11.  db_query (object)
















Perov                     Expires July 17, 2019                 [Page 9]

                                  hwad                      January 2019


   +-------------------------------------------------------------------+
   Example:
   +-------------------------------------------------------------------+
   {
       "db_type": "mysql",
       "query": "SELECT * FROM articles WHERE ID = ?id",
       "parsed": "SELECT * FROM articles WHERE ID = 1;",
       "duration": 15,
       "bindings": [
           {
               "key": "id",
               "value": "2"
           }
       ],
       "place": {
           "file": "/src/renderer/main.js",
           "line": 123
       },
       "props": [
           {
               "key": "model",
               "value": "\App\Database\Models\Article.php"
           },
           {
               "key": "custom_prop_name",
               "value": "hello_world"
           }
       ],
   }
   +-------------------------------------------------------------------+

   +----------+---------------+----------+-----------------------------+
   | key      | type          | required | description                 |
   +----------+---------------+----------+-----------------------------+
   | query    | string        |    Y     | query as defined in code    |
   | parsed   | string        |          | parsed query                |
   | db_type  | string        |          | database type (mysql, pg,   |
   |          |               |          | etc..), useful only if      |
   |          |               |          | application use many        |
   |          |               |          | databased at once           |
   | duration | duration_mili |          | db request duration in      |
   |          |               |          | milliseconds                |
   | bindings | param[]       |          | ORM binding                 |
   | place    | place         |          | code place when this query  |
   |          |               |          | called                      |
   | props    | param[]       |          | any additional custom props |
   +----------+---------------+----------+-----------------------------+




Perov                     Expires July 17, 2019                [Page 10]

                                  hwad                      January 2019


5.  References

5.1.  Normative References

   [RFC2119]  Bradner, S., "Key words for use in RFCs to Indicate
              Requirement Levels", BCP 14, RFC 2119,
              DOI 10.17487/RFC2119, March 1997,
              <https://www.rfc-editor.org/info/rfc2119>.

5.2.  Informative References

   [RFC7159]  Bray, T., Ed., "The JavaScript Object Notation (JSON) Data
              Interchange Format", RFC 7159, DOI 10.17487/RFC7159, March
              2014, <https://www.rfc-editor.org/info/rfc7159>.

   [RFC7540]  Belshe, M., Peon, R., and M. Thomson, Ed., "Hypertext
              Transfer Protocol Version 2 (HTTP/2)", RFC 7540,
              DOI 10.17487/RFC7540, May 2015,
              <https://www.rfc-editor.org/info/rfc7540>.

Author's Address

   Konstantin Perov

   Email: fe3dback@yandex.ru


























Perov                     Expires July 17, 2019                [Page 11]

```
