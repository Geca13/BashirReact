import React from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import { UserSignUpPage } from './UserSignUpPage'

beforeEach(cleanup);

describe('UserSignUpPage', ()=> {
    describe('Layout', () =>{

      it('has header of Sign Up', () => {

      const { container } = render(<UserSignUpPage/>);
      const header = container.querySelector('h1');
      expect(header).toHaveTextContent('Sign Up')
      });
      it('has input for display name', () =>{
        const {queryByPlaceholderText} =  render(<UserSignUpPage/>);
        const displayNameInput = queryByPlaceholderText('Your display name');
        expect(displayNameInput).toBeInTheDocument();
      });

      it('has input for username', () =>{
        const {queryByPlaceholderText} =  render(<UserSignUpPage/>);
        const usernameInput = queryByPlaceholderText('Your username');
        expect(usernameInput).toBeInTheDocument();
      });
      it('has input for password', () =>{
        const {queryByPlaceholderText} =  render(<UserSignUpPage/>);
        const passwordInput = queryByPlaceholderText('Your password');
        expect(passwordInput).toBeInTheDocument();
      });
      it('has password type for password input', () =>{
        const {queryByPlaceholderText} =  render(<UserSignUpPage/>);
        const passwordInput = queryByPlaceholderText('Your password');
        expect(passwordInput.type).toBe('password');
      });
      it('has input for password repeat', () =>{
        const {queryByPlaceholderText} =  render(<UserSignUpPage/>);
        const passwordRepeat = queryByPlaceholderText('Repeat your password');
        expect(passwordRepeat).toBeInTheDocument();
      });
      it('has password type for password repeat', () =>{
        const {queryByPlaceholderText} =  render(<UserSignUpPage/>);
        const passwordRepeat = queryByPlaceholderText('Repeat your password');
        expect(passwordRepeat.type).toBe('password');
      });
      it('has submit button', ()=>{
          const { container } = render(<UserSignUpPage/>);
          const button = container.querySelector('button');
          expect(button).toBeInTheDocument();
      })

    })

    describe('Interactions', ()=>{
 
        const changeEvent=(content) =>{
            return {
                target: {
                    value: content
                }
            }
        }


        it('sets the displayname value into state', ()=>{
        const {queryByPlaceholderText} =  render(<UserSignUpPage/>);
        const displayNameInput = queryByPlaceholderText('Your display name');

        fireEvent.change(displayNameInput, changeEvent('my-display-name'))

        expect(displayNameInput).toHaveValue('my-display-name')
        })

         it('sets the username value into state', ()=>{
        const {queryByPlaceholderText} =  render(<UserSignUpPage/>);
        const usernameInput = queryByPlaceholderText('Your username');

        fireEvent.change(usernameInput, changeEvent('my-user-name'))

        expect(usernameInput).toHaveValue('my-user-name')
        })

        it('sets the password value into state', ()=>{
        const {queryByPlaceholderText} =  render(<UserSignUpPage/>);
        const passwordInput = queryByPlaceholderText('Your password');

        fireEvent.change(passwordInput, changeEvent('my-password'))

        expect(passwordInput).toHaveValue('my-password')
        })

        it('sets the password repeat value into state', ()=>{
        const {queryByPlaceholderText} =  render(<UserSignUpPage/>);
        const passwordRepeatInput = queryByPlaceholderText('Repeat your password');

        fireEvent.change(passwordRepeatInput, changeEvent('my-password'))

        expect(passwordRepeatInput).toHaveValue('my-password')
        })
    })
})