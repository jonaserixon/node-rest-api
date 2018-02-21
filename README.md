# 1dv527 - Web API Report

### How have you implemented the idea of HATEOAS in your API? Motivate your choices and how it support the idea of HATEOAS?

My implementation of HATEOAS in my API was to add an array containing different paths that the user might be interested in getting, like a smorgosbord of urls. It has the href, relation and method information of it. 

So my thought is that the user can get the links related to the active route which can help with the navigation of the API. 

I also provide some extra navigation urls when a user is requesting a specific catch with an id. There will be a previous and a next type of link to enable the user to navigate through all the catches.

### If your solution should implement multiple representations of the resources. How would you do it?



### Motivate and defend your authentication solution? Why did you choose the one you did? Pros/Cons.

I chose to use JSON Web Token for authenticating a user trying to request unsafe methods. 

The reason for choosing JWT was because I wanted to keep the RESTful API stateless, since that is one of the constraints of REST. So I used the JWT and send it in the header for every request that needs to be authenticated. 

### Explain how your webhook works.

The user wants to create a webhook so he sends a POST to the webhook route containing the URL to the website that he wants to receive the webhook. The webhook URLs are stored in the database.

When a new catch has been created, a POST request will be sent out to all the existing webhook URLs currently stored in the database. They will receive the request.body.

### Since this is your first own web API there are probably things you would solve in another way looking back at this assignment. Write your thoughts down.

### Did you do something extra besides the fundamental requirements? Explain them.

