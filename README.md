# 1dv527 - Web API Report

### How have you implemented the idea of HATEOAS in your API? Motivate your choices and how it support the idea of HATEOAS?

My implementation of HATEOAS in my API was to add an array containing different paths that the user might be interested in getting, like a smorgosbord of URLs. It has the href, relation and method information of it. 

So my thought is that the user can get the links related to the active route which can help with the navigation of the API. 

I also provide some extra navigation urls when a user is requesting a specific catch with an id. There will be a previous and a next type of link to enable the user to navigate through all the catches.


### If your solution should implement multiple representations of the resources. How would you do it?

If I were to implement the option to represent the resource in another way, for example as XML, I would change the Content-Type in the header to not only accept application/json.

So if the client is requesting the resource represented in XML it would be shown in the HTTP header from the request. And judging on the type of header, the correct representation would be sent as a response to the client. 


**Example of a JSON object and also how it would be represented in XML:**
```json
{
  "id": "5a8cb40de35c7f0e4cd17fc9",
  "user": "ging",
  "specie": "VITHAJ",
  "timestamp": "2018-02-20T23:49:33.536Z",
  "links": [
    {
      "href": "/api/catches/5a8cb40de35c7f0e4cd17fc9",
      "rel": "self",
      "method": "GET"
    },
    {
      "href": "/api/catches/",
      "rel": "parent",
      "method": "GET"
    }
  ],
  "navigation": [
    {
      "previous": "http://localhost:8000/api/catches/5a8c9fd72a3da70b8c252e47",
      "next": "http://localhost:8000/api/catches/5a8cb40ee35c7f0e4cd17fca"
    }
  ]
}
```

```xml
<catch>
    <id>5a8cb40de35c7f0e4cd17fc9</id>
    <user>John</user>
    <specie>Haj</specie>
    <timestamp>2018-02-20T23:49:33.536Z</timestamp>
    <links>
        <value>
            <href>/api/catches/5a8cb40de35c7f0e4cd17fc9</href>
            <rel>self</rel>
            <method>GET</method>
        </value>
        <value>
            <href>/api/catches/</href>
            <rel>parent</rel>
            <method>GET</method>
        </value>
    </links>
    <navigation>
        <previous>http://localhost:8000/api/catches/5a8c9fd72a3da70b8c252e47</previous>
        <next>http://localhost:8000/api/catches/5a8cb40ee35c7f0e4cd17fca</next>
    </navigation>
</catch>
```



### Motivate and defend your authentication solution? Why did you choose the one you did? Pros/Cons.

I chose to use JSON Web Token for authenticating a user trying to request unsafe methods. 

The reason for choosing JSON Web Token was because I wanted to keep the RESTful API stateless since that is one of the constraints in REST. So instead of having a session, I just take the token and send it in the HTTP authorization header for every request that needs to be authenticated. 

**A Pro** with using the JWT solution is that I don't need to query a database for the tokens, which shortens the response time. 

**A Con** would be if the secret key somehow gets leaked and ends up in the wrong hands. But since I am not deploying this API I didn't make the key secret since it's only going to be used locally anyways. 


### Explain how your webhook works.

The user wants to create a webhook so he sends a POST to the webhook route containing the URL to the website that he wants to receive the webhook. The webhook URLs are stored in the database.

When a new catch has been created, a POST request will be sent out to all the existing webhook URLs currently stored in the database. They will receive the request.body.


### Since this is your first own web API there are probably things you would solve in another way looking back at this assignment. Write your thoughts down.

One thing that I would like to change, but it's not necessarily about the API, is that I would write everything in Promises in the routes to get a better control flow in some cases. 

I would also probably change the way I represent some of the resources and also the URL naming in some cases. I would like to enable the client to enter queries in the URL when making requests as well. 

Another thing I would do is to utilize some of the Postman functions more when developing the API. Such as using environment variables more efficiently. And writing some basic API-tests for the requests so I know if I accidentally broke something when making changes. 


### Did you do something extra besides the fundamental requirements? Explain them.

