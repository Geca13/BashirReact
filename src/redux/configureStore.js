import { applyMiddleware, createStore } from 'redux';
import authReducer from './authReducer';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk'

const configureStore = (addLogger = true) =>{
    const middleware = addLogger ? applyMiddleware(thunk, createLogger) : applyMiddleware(thunk)
    return createStore(authReducer, middleware )
}

export default configureStore;