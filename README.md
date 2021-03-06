### Redux Handler Middleware [![CircleCI](https://circleci.com/gh/ZachPerkitny/redux-handler-middleware.svg?style=svg)](https://circleci.com/gh/ZachPerkitny/redux-handler-middleware)

Middleware that executes custom handlers before and after state updates.

This can be especially useful when:
- [Handling navigation redirects](https://medium.com/trisfera/navigation-redirects-through-redux-middleware-1d2518695fd1)
- [Triggering async operations from synchronous actions](https://medium.com/@kjellmorten/a-simpler-way-to-handle-async-in-redux-bc2a4b952f67)

#### Install
`npm install redux-handler-middleware --save`

#### Quick Example
`middleware/handlerMiddleware.js`
```javascript
import browserHistory from 'react-router/lib/browserHistory';
import createHandlerMiddleware from 'redux-handler-middleware';
import {FETCH_POST_FAILURE, FETCH_POSTS_FAILURE} from 'constants/blog';

const handlerMiddleware = createHandlerMiddleware([{
    actions: [FETCH_POSTS_FAILURE, FETCH_POST_FAILURE],
    afterHandler: (store, action) => {
        if(action.payload.status === 404){
            browserHistory.push('/404');
        }
    }
}]);

export default handlerMiddleware;
```
`store/createStore.js`
```javascript
import { createStore, applyMiddleware, combineReducers } from 'redux';
import handlerMiddleware from 'middleware/handlerMiddleware';
import rootReducer from 'reducers';

export default createStore(
    rootReducer,
    {},
    applyMiddleware(handlerMiddleware)
);
```
So now when a `FETCH_POSTS_FAILURE` or a `FETCH_POST_FAILURE` action is dispatched, the afterHandler will be invoked after the state updates and it will redirect you to `/404`. This provides a simple and intuitive solution to navigating in response to actions.

#### Usage
`createHandlerMiddleware` - Function

Must be passed an array of plain objects.
##### Defining Handlers
`action` -  String

The type of the action. This is used when determining which handlers to fire.

`actions` - Array of actions

This is useful when multiple action types use the same handler.

`beforeHandler` - Function

Handler to be called before the state is updated.

`afterHandler` - Function

Handler to be called after the state is updated.


##### Special Thanks
to [Diego Castillo](https://github.com/diegocasmo) who came up with the original idea in his [blog post](https://medium.com/trisfera/navigation-redirects-through-redux-middleware-1d2518695fd1).
