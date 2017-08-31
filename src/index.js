import find from 'lodash.find';

export default function createHandlerMiddleware(handlers){
    /* validation */
    if(!Array.isArray(handlers)){
        throw new Error('Expected handlers to be an array.');
    }
    const l = handlers.length;
    let i;
    for(i = 0; i < l; i++){
        const handler = handlers[i];
        if(!handler.action && !handler.actions){
            throw new Error('Expected action or actions to be defined.');
        }
        if(typeof handler.action !== 'undefined' && typeof handler.action !== 'string'){
            throw new Error('Expected action to be of type string.');
        }
        if(typeof handler.actions !== 'undefined'){
            if(!Array.isArray(handler.actions)){
                throw new Error('Expected actions to be an array');
            } else if(!handler.actions.length) {
                throw new Error('Expected actions array to have at least 1 action type.')
            } else {
                const allStrings = handler.actions.every((action) => typeof action === 'string');
                if(!allStrings){
                    throw new Error('Expected all actions to be of type string.');
                }
            }
        }
        if(typeof handler.beforeHandler !== 'undefined' && typeof handler.beforeHandler !== 'function'){
            throw new Error('Before handler must be either undefined or a function.');
        }
        if(typeof handler.afterHandler !== 'undefined' && typeof handler.afterHandler !== 'function'){
            throw new Error('After handler must be either undefined or a function.');
        }
    }
    /* return middleware function */
    return store => next => action => {
        const handler = find(handlers, (handler) => {
            if(handler.actions){
                return ~handler.actions.indexOf(action.type);  // -1 [1111...1111]
            }
            return handler.action === action.type;
        });
        if(handler && handler.beforeHandler){
            handler.beforeHandler(store, action);
        }
        const result = next(action);
        if(handler && handler.afterHandler){
            handler.afterHandler(store, action);
        }
        return result;
    };
}