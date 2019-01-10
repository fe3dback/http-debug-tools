HTTP Debug tools
=

This is HTTP GUI client (like postman), for debuging APIs using HTTP Debug protocol.

HTTP Debug protocol
=

```text


                     +-----------------------------------------------+
   +---------------+ |                                               | +---------------+
   |  HTTP CLIENT  | |            HOW HTTP DEBUG WORKS?              | | APP. BACKEND  |
   +---------------+ |                                               | +---------------+
                     +-----------------------------------------------+

   ----------------------------+   +             +   +----------------------------------
    Any HTTP Request           |   | REAL        |   | Response headers:
   ----------------------------+   | REQUEST     |   +----------------------------------
                               +-> | +---------> |   | X-Http-Debug-Version: 1.0
    /api/my-url/?hello-world   |   |             |   |
                               |   |        REAL |   | X-Http-Debug-Api: /_profile/?id=
   ----------------------------+   |    RESPONSE |   |
                                   | <---------+ | <-+ X-Http-Debug-Id: 5b67d5...e09
                                   |             |   +----------------------------------
                                   |             |
                                   |     ...     |   +----------------------------------
   ----------------------------+   |             |   | Json response with debug data:
    Request url:               |   |             |   +----------------------------------
   ----------------------------+   | DEBUG       |   | {
                               |   | REQUEST     |   |   "id": "5b67d5...e09",
    /_profile/?id=5b67d5...e09 +-> | +---------> |   |   "request_in": 1547058561177,
                               |   |             |   |   "response_out": 1547058622423,
   ----------------------------+   |       DEBUG |   |   "controller": "MyController",
                                   |    RESPONSE |   |   "cache_hits_count": 14,
                                   | <---------+ | <-+   ...
                                   |             |   | }
                                   +             +   +---------------------------------+


Steps:
1. HTTP Client make real request to application server
2. Server return real response, with 3 debug headers
3. HTTP Client make request to debug/profile server url
4. Server return all debug information for request #1
```

This schema can by implement on any programming language and backend.
Also any HTTP clients (like postman, insomnia, chrome dev tools, my custom client, etc..) can
implement debug information display.

Types
==

<table>
  <thead>
    <tr>
      <td>name</td>
      <td>example</td>
      <td>definition</td>
    </tr>
  <thead/>
  <tbody>
    <tr>
      <td>guid</td>
      <td>5b67d5ef-b9cc-4a3e-896d-93e5f4500e09</td>
      <td>rfc4122 (UUID v4)</td>
    </tr>
    <tr>
      <td>ts_mili</td>
      <td>1547058561177</td>
      <td>unixtime (GMT) with miliseconds</td>
    </tr>
    <tr>
      <td>duration_mili</td>
      <td>140</td>
      <td>time duration in miliseconds</td>
    </tr>
    <tr>
      <td>method</td>
      <td>POST</td>
      <td>HTTP Method (uppercase) [GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS]</td>
    </tr>
    <tr>
      <td>uri</td>
      <td>https://example.com/api/hello?foo=bar</td>
<td
  
  [wiki](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier)
</td>
    </tr>
    <tr>
      <td>header</td>
<td>

  ```json
  {
    "key": "headerName", 
    "value": "headerValue"
  }
  ```
</td>
<td>
  
  - *string*:key
  - *string*:value
</td>
    </tr>
    <tr>
      <td>param</td>
<td>

  ```json
  {
    "key": "paramName", 
    "value": "paramValue"
  }
  ```
</td>
<td>
  
  - *string*:key
  - *string*:value
</td>
    </tr>
    <tr>
      <td>user</td>
<td>
  
  ```json
  {
    "id": "12345", 
    "name": "admin",
    "groups": [{
      "id": "42",
      "title": "editors",
      "perms": [{
        "key": "view",
        "value": "articles"
      }]
    }]
  }
  ```
</td>
<td>

- *string*:id
- ?*string*:name
- ?*string*:email
- ?*user_group*[]:groups
</td>
    </tr>
    <tr>
      <td>user_group</td>
<td>
  
  ```json
  {
    "id": "42",
    "title": "editors",
    "perms": [{
      "key": "view",
      "value": "articles"
    }]
  }
  ```
</td>
<td>
  
  - *string*:id
  - ?*string*:title
  - ?*param*[]:perms
</td>
    </tr>
    <tr>
      <td>db_query</td>
<td>
  
  ```json
  {
    "query": "SELECT * FROM articles WHERE ID = ?id",
    "parsed": "SELECT * FROM articles WHERE ID = 1;",
    "duration": 15,
    "bindings": [{
      "key": "id",
      "value": "2"
    }]
  }
  ```
</td>
<td>
  
- *string*:query
- ?*string*:parsed
- ?*duration_mili*:duration
- ?*param*[]:bindings
</td>
    </tr>
  </tbody>
</table>

Schema (v1)
==

Required
====

| key | type | description |
| --- | ---- | ----------- |
| id | guid  | unique request id |
| version | int | schema version |
| request_in | ts_mili | request in time |
| response_out | ts_mili | response out time |

Optional
====

| key | type | description |
| --- | ---- | ----------- |
| method | method  | HTTP method |
| uri | uri | full request uri |
| headers | header[] | list of request headers |
| controller | string | custom controller name |
| query_data | param[] | parsed query (GET) data |
| post_data | param[] | parsed body (POST) data |
| session | param[] | user session data |
| user | user | current auth user |
| response_code | int | HTTP response code |
| memory_usage_bytes | int | max/peak memory usage (in bytes) during request |
| queries | db_query[] | database queries during request |
| cache_total_count | int | cache read requests count |
| cache_hits_count | int | cache hit requests count |
| cache_writes_count | int | cache write requests count |
| cache_deletes_count | int | cache delete requests count |
| cache_duration | duration_mili | total cache io duration in ms |

Todo
====

| key | type | description |
| --- | ---- | ----------- |
| timeline | todo | n/a |
| logs | todo | n/a |
| events | todo | n/a |
| routes | todo | n/a |
| emails | todo | n/a |
| views | todo | n/a |
| async_requests | todo | n/a |
| sub_requests | todo | n/a |
