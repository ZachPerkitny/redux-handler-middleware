import createHandlerMiddleware from '../src';
import chai from 'chai';


describe('redux-handler-middleware', () => {
    const store = {
        getState: () => {},
        dispatch: () => {}
    };
    /* error handling */
    it('should throw an error if argument passed is not an array', () => {
        const errorMessage = 'Expected handlers to be an array.';
        chai.expect(() => createHandlerMiddleware(55)).to.throw(errorMessage);
    });

    it('should throw an error if no actions are passed for a handler', () => {
        const errorMessage = 'Expected action or actions to be defined.';
        chai.expect(() => createHandlerMiddleware([{}])).to.throw(errorMessage);
    });

    it('should throw an error if action is not a string or undefined', () => {
        const errorMessage = 'Expected action to be of type string.';
        chai.expect(() => createHandlerMiddleware([{
            action: []
        }])).to.throw(errorMessage);
    });

    it('should throw an error if actions is not an array', () => {
        const errorMessage = 'Expected actions to be an array';
        chai.expect(() => createHandlerMiddleware([{
            actions: {}
        }])).to.throw(errorMessage);
    });

    it('should throw an error if actions is an empty array', () => {
        const errorMessage = 'Expected actions array to have at least 1 action type.';
        chai.expect(() => createHandlerMiddleware([{
            actions: []
        }])).to.throw(errorMessage);
    });

    it('should throw an error if one of the actions passed is not a string', () => {
        const errorMessage = 'Expected all actions to be of type string.';
        chai.expect(() => createHandlerMiddleware([{
            actions: ['ACTION', 55]
        }])).to.throw(errorMessage);
    });

    it('should throw an error if the beforeHandler is not a function', () => {
        const errorMessage = 'Before handler must be either undefined or a function.';
        chai.expect(() => createHandlerMiddleware([{
            action: 'ACTION',
            beforeHandler: 55
        }])).to.throw(errorMessage);
    });

    it('should throw an error if the afterHandler is not a function', () => {
        const errorMessage = 'After handler must be either undefined or a function.';
        chai.expect(() => createHandlerMiddleware([{
            action: 'ACTION',
            afterHandler: 55
        }])).to.throw(errorMessage);
    });

    it('should call handlers with store action when some action is dispatched', () => {
        const type1 = 'ACTION1';
        const type2 = 'ACTION2';
        const type3 = 'ACTION3';
        const action1 = {type: type1, payload: {message: 'some content'}};
        const action2 = {type: type2, payload: {data: ['some data']}};
        const action3 = {type: type3};
        const dispatch = createHandlerMiddleware(
            [{
                actions: [type1, type2],
                beforeHandler: (store, action) => {
                    chai.expect(store).to.be.a('object');
                    chai.expect(store.getState).to.be.a('function');
                    chai.expect(store.dispatch).to.be.a('function');
                    if(action.type === type1){
                        chai.expect(action).to.deep.equal(action1);
                    } else {
                        chai.expect(action).to.deep.equal(action2);
                    }
                },
                afterHandler: (store, action) => {
                    chai.expect(store).to.be.a('object');
                    chai.expect(store.getState).to.be.a('function');
                    chai.expect(store.dispatch).to.be.a('function');
                    if(action.type === type1){
                        chai.expect(action).to.deep.equal(action1);
                    } else {
                        chai.expect(action).to.deep.equal(action2);
                    }
                }
            },{
                action: type3,
                beforeHandler: (store, action) => {
                    chai.expect(store).to.be.a('object');
                    chai.expect(store.getState).to.be.a('function');
                    chai.expect(store.dispatch).to.be.a('function');
                    chai.expect(action).to.equal(action3);
                },
                afterHandler: (store, action) => {
                    chai.expect(store).to.be.a('object');
                    chai.expect(store.getState).to.be.a('function');
                    chai.expect(store.dispatch).to.be.a('function');
                    chai.expect(action).to.equal(action3);
                }
            }]
        )(store)(store.dispatch);
        chai.expect(dispatch).to.be.a('function');
        dispatch(action1);
        dispatch(action2);
        dispatch(action3);
    });
});