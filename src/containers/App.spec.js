import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import configureStore from '../redux/configureStore';
import App from './App';
import axios from 'axios';

const setup = (path) =>{
   const store = configureStore(false);
    return render(
       <Provider store={store} >
       <MemoryRouter initialEntries={[path]}>
            <App/>
        </MemoryRouter>
        </Provider>
    )
};

const changeEvent=(content) =>{
            return {
                target: {
                    value: content
                }
            };
        };

describe('App' , () =>{

   it('displays homepage when url is /',() => {
     
      const { queryByTestId } = setup('/');
      expect(queryByTestId('homepage')).toBeInTheDocument();
   });

   it('displays LoginPage when url is /login',()=>{
     
      const { container } = setup('/login');
      const header = container.querySelector('h1');
      expect(header).toHaveTextContent('Login');
   });

   it('displays only LoginPage when url is /login',()=>{
     
      const { queryByTestId } = setup('/login');
      expect(queryByTestId('homepage')).not.toBeInTheDocument(); 
   })

   it('displays UserSignUpPage when url is /signup',()=>{
     
      const { container } = setup('/signup');
      const header = container.querySelector('h1');
      expect(header).toHaveTextContent('Sign Up');
   });

   it('displays userpage when url is other then / , /login or /signup',() => {
     
      const { queryByTestId } = setup('/user1');
      expect(queryByTestId('userpage')).toBeInTheDocument();
   });

   it('displays topBar when url is /', () => {
      const { container } = setup('/');
      const navigation = container.querySelector('nav');
      expect(navigation).toBeInTheDocument();
    });

   it('displays topbar when url is /login',()=>{

      const { container } = setup('/login');
      const navigation = container.querySelector('nav');
      expect(navigation).toBeInTheDocument();

   });

   it('displays topbar when url is /signup',()=>{

      const { container } = setup('/signup');
      const navigation = container.querySelector('nav');
      expect(navigation).toBeInTheDocument();

   });

   it('displays topbar when url is /user1',()=>{

      const { container } = setup('/user1');
      const navigation = container.querySelector('nav');
      expect(navigation).toBeInTheDocument();

   });

   it('shows the UserSignUpPage when clicking Sign up',()=>{

      const { queryByText,  container } = setup('/user1');
      const signupLink = queryByText('Sign Up');
      fireEvent.click(signupLink);
      const header = container.querySelector('h1');
      expect(header).toHaveTextContent('Sign Up');

   });

   it('shows the LoginPage when clicking Login',()=>{

      const { queryByText,  container } = setup('/user1');
      const loginLink = queryByText('Login');
      fireEvent.click(loginLink);
      const header = container.querySelector('h1');
      expect(header).toHaveTextContent('Login');

   });

    it('shows the HomePage when clicking logo',()=>{

      const { queryByTestId,  container } = setup('/login');
      const logo = container.querySelector('img')
      fireEvent.click(logo);
      expect(queryByTestId('homepage')).toBeInTheDocument();

   });

   it('displeys My Profile on TopBar afetr login success', async ()=>{

      const { queryByPlaceholderText,  container , findByText } = setup('/login');

      const  usernameInput = queryByPlaceholderText('Your username');
        fireEvent.change(usernameInput, changeEvent('user1'));
      const  passwordInput = queryByPlaceholderText('Your password');
        fireEvent.change(passwordInput, changeEvent('P4ssword'));
      const  button = container.querySelector('button');

      axios.post = jest.fn().mockResolvedValue({
         data: {
            id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png',
       }
      })
      fireEvent.click(button)
      const myProfileLink = await findByText('My Profile');
      
      expect(myProfileLink).toBeInTheDocument();

   });

   it('displeys My Profile on TopBar afetr signup success', async ()=>{

      const { queryByPlaceholderText,  container , findByText } = setup('/signup');

          const displayNameInput = queryByPlaceholderText('Your display name');
          const usernameInput = queryByPlaceholderText('Your username');
          const passwordInput = queryByPlaceholderText('Your password');
          const passwordRepeat = queryByPlaceholderText('Repeat your password');
           
            fireEvent.change(displayNameInput,changeEvent('display1'));
            fireEvent.change(usernameInput,changeEvent('user1'));
            fireEvent.change(passwordInput,changeEvent('P4ssword'));
            fireEvent.change(passwordRepeat,changeEvent('P4ssword'));
    
            const button = container.querySelector('button');

      axios.post = jest.fn().mockResolvedValueOnce({
         data: {
            message: 'User saved'
       }
      }).mockResolvedValueOnce({
         id: 1,
        username: 'user1',
        displayName: 'display1',
        image: 'profile1.png'
      })
      fireEvent.click(button)
      const myProfileLink = await findByText('My Profile');
      
      expect(myProfileLink).toBeInTheDocument();

   });


});