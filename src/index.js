import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { UserSignUpPage} from './pages/UserSignUpPage'
import { LoginPage } from './pages/LoginPage'
import * as apiCalls from './api/apiCalls'
import { HashRouter } from 'react-router-dom';
import App from './containers/App'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import authReducer from './redux/authReducer';

const store = createStore(authReducer);

const actions = {
  postSignup: apiCalls.signup
}

ReactDOM.render(
  <Provider store={store}>
  <HashRouter>
    <App />
  </HashRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
