import React from 'react'
import { cleanup, fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react'

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
            };
        };

        const mockAsyncDelay = () =>{
          return jest.fn().mockImplementation(() =>{
            return new Promise((resolve, reject) =>{
              setTimeout(() =>{
                resolve({})
              },300)
            })
          })
        }

        let button, displayNameInput, usernameInput, passwordInput, passwordRepeat;

        

        const setupForSubmit = (props) => {

          const rendered = render(
            <UserSignUpPage {...props}/>
            );
            const {container, queryByPlaceholderText} = rendered;
             displayNameInput = queryByPlaceholderText('Your display name');
             usernameInput = queryByPlaceholderText('Your username');
             passwordInput = queryByPlaceholderText('Your password');
             passwordRepeat = queryByPlaceholderText('Repeat your password');
           
            fireEvent.change(displayNameInput,changeEvent('my-display-name'));
            fireEvent.change(usernameInput,changeEvent('my-user-name'));
            fireEvent.change(passwordInput,changeEvent('P4ssword'));
            fireEvent.change(passwordRepeat,changeEvent('P4ssword'));
    
            button = container.querySelector('button');

            return rendered;
          
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
        const passwordRepeat = queryByPlaceholderText('Repeat your password');

        fireEvent.change(passwordRepeat, changeEvent('my-password'))

        expect(passwordRepeat).toHaveValue('my-password')
        })
        it('calls postSignup when the fields are valid and the actions are provided in the props', ()=>{
          const actions = {
            postSignup: jest.fn().mockResolvedValueOnce({})
          }
          setupForSubmit({actions})
        
        fireEvent.click(button);
        expect(actions.postSignup).toHaveBeenCalledTimes(1);
      
      })

      it('does not throw exception when clicking the button when actions are not provided in props', ()=>{
        
      setupForSubmit()
      
      expect(() =>fireEvent.click(button)).not.toThrow();
      })

      it('calls post with user body when the fields are valid ', ()=>{
        const actions = {
          postSignup: jest.fn().mockResolvedValueOnce({})
        }
        setupForSubmit({actions})
      
      fireEvent.click(button);
      const expectedUserObject = {

        username: 'my-user-name' ,
        displayName: 'my-display-name' ,
        password: 'P4ssword' ,


      }
      expect(actions.postSignup).toHaveBeenCalledWith(expectedUserObject);
    
    })

    it('does not allow user to click the sign up button when there is ongoing api call', ()=>{
      const actions = {
        postSignup: mockAsyncDelay()
      }
      setupForSubmit({actions})
    
    fireEvent.click(button);
    
    fireEvent.click(button);
    expect(actions.postSignup).toHaveBeenCalledTimes(1);
  
  })

  it('displeys spinner when there is ongoing api call', ()=>{
      const actions = {
        postSignup: mockAsyncDelay()
      }
      const {queryByText} = setupForSubmit({actions})
    
    fireEvent.click(button);
    
    const spinner = queryByText('Loading...')
    expect(spinner).toBeInTheDocument();
  
  })

  it('hide spinner after api call finishes succesfully', async ()=>{
      const actions = {
        postSignup: mockAsyncDelay(),
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      const spinner = queryByText('Loading...');
      await waitForElementToBeRemoved(spinner);

      expect(spinner).not.toBeInTheDocument();
  
  })

   it('hide spinner after api call finishes with error', async ()=>{
      const actions = {
        postSignup: jest.fn().mockImplementation(() => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              reject({
                response: { data: {} }
              });
            }, 300);
          });
        }),
      };
      const { queryByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      const spinner = queryByText('Loading...');
      await waitForElementToBeRemoved(spinner);
      expect(spinner).not.toBeInTheDocument();
  
  })

  it('displays validation error for displayName when error is received for the field', async () => {
    const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                displayName: 'Cannot be null',
              },
            },
          },
        }),
      };
      const { findByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      const errorMessage = await findByText('Cannot be null');

      expect(errorMessage).toBeInTheDocument();
   
  });
  
  it('enables the signup button when password and repeat password have the same value' , ()=>{

    setupForSubmit();
    expect(button).not.toBeDisabled();
  });

  it('disables the signup button when repeat password dont match the password' , ()=>{

    setupForSubmit();
    fireEvent.change(passwordRepeat, changeEvent('new-pass'));
    expect(button).toBeDisabled();
  });

  it('disables the signup button when password dont match the repeat password' , ()=>{

    setupForSubmit();
    fireEvent.change(passwordInput, changeEvent('new-pass'));
    expect(button).toBeDisabled();
  });

  it('displeys error style for repeat password when it is not a match to password' , ()=>{

    const { queryByText } = setupForSubmit();
    fireEvent.change(passwordRepeat, changeEvent('new-pass'));
    const mismatchWarning = queryByText('Does not match to password')
    expect(mismatchWarning).toBeInTheDocument();
  });

  it('displeys error style for password when it is not a match to password repeat' , ()=>{

    const { queryByText } = setupForSubmit();
    fireEvent.change(passwordInput, changeEvent('new-pass'));
    const mismatchWarning = queryByText('Does not match to password')
    expect(mismatchWarning).toBeInTheDocument();
  });

  it('hides the validation error when user changes the value of displayName ', async () => {
    const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                displayName: 'Cannot be null',
              },
            },
          },
        }),
      };
      const { findByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      const errorMessage = await findByText('Cannot be null');
      fireEvent.change(displayNameInput, changeEvent('name updated'));

      expect(errorMessage).not.toBeInTheDocument();
   
  });

  it('hides the validation error when user changes the value of username ', async () => {
    const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                username: 'Username cannot be null',
              },
            },
          },
        }),
      };
      const { findByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      const errorMessage = await findByText('Username cannot be null');
      fireEvent.change(usernameInput, changeEvent('name updated'));

      expect(errorMessage).not.toBeInTheDocument();
   
  });

  it('hides the validation error when user changes the value of password ', async () => {
     const actions = {
        postSignup: jest.fn().mockRejectedValue({
          response: {
            data: {
              validationErrors: {
                password: 'Cannot be null',
              },
            },
          },
        }),
      };
      const { findByText } = setupForSubmit({ actions });
      fireEvent.click(button);

      const errorMessage = await findByText('Cannot be null');
      fireEvent.change(passwordInput, changeEvent('updated-password'));

      expect(errorMessage).not.toBeInTheDocument();
   
  });

    })
})

console.error = () =>{}