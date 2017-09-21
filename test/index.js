import createHandlerMiddleware from '../src';
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

describe('redux-handler-middleware', () => {
    /* error handling */
    it('should throw an error if actions is not an array', () => {
        const errorMessage = 'Expected actions to be an array or undefined.';
        chai.expect(() => createHandlerMiddleware([{
            actions: {}
        }])).to.throw(errorMessage);
    });

    it('should throw an error if the beforeHandler is not a function', () => {
        const errorMessage = 'Expected beforeHandler to be a function or undefined.';
        chai.expect(() => createHandlerMiddleware([{
            action: 'ACTION',
            beforeHandler: 55
        }])).to.throw(errorMessage);
    });

    it('should throw an error if the afterHandler is not a function', () => {
        const errorMessage = 'Expected afterHandler to be a function or undefined.';
        chai.expect(() => createHandlerMiddleware([{
            action: 'ACTION',
            afterHandler: 55
        }])).to.throw(errorMessage);
    });

    it('should warn the client if both action and actions are defined', () => {
        const warningMessage = 'Both action and actions are defined, action key will be ignored.';
        sinon.spy(console, 'warn');
        createHandlerMiddleware([{
            action: 'ACTION',
            actions: [],
            beforeHandler: () => {},
            afterHandler: () => {}
        }]);
        chai.expect(console.warn).to.have.been.calledWith(warningMessage);
    });

    it('should call handlers with store action when some action is dispatched', () => {
        const store = {
            getState: () => {},
            dispatch: () => {}
        };
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