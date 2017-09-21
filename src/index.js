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
        if(typeof handler.action !== 'undefined' && typeof handler.actions !== 'undefined'){
            console.warn('Both action and actions are defined, action key will be ignored.');
        }
        if(typeof handler.actions !== 'undefined' && !Array.isArray(handler.actions)){
            throw new Error('Expected actions to be an array or undefined.');
        }
        if(typeof handler.beforeHandler !== 'undefined' && typeof handler.beforeHandler !== 'function'){
            throw new Error('Expected beforeHandler to be a function or undefined.');
        }
        if(typeof handler.afterHandler !== 'undefined' && typeof handler.afterHandler !== 'function'){
            throw new Error('Expected afterHandler to be a function or undefined.');
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