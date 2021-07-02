import React from 'react'
import { render, fireEvent, queryByText, findByText } from '@testing-library/react'
import UserPage from './UserPage'
import * as apiCalls from '../api/apiCalls'
import { Provider } from 'react-redux';
import configureStore from '../redux/configureStore';
import axios from 'axios'

const mockSuccessGetUser = {
   data: {
      id: 1,
      username: 'user1',
      displayName: 'display1',
      image: 'profile1.png'
   }
}

const mockSuccessUpdateUser = {
   data: {
      id: 1,
      username: 'user1',
      displayName: 'display1-update',
      image: 'profile1-update.png'
   }
}

const mockFailGetUser = {
   response: {
      data: {
         message: 'User not found'
      }
   }
}
const match = {
   params: {
      username: 'user1'
   }
}

beforeEach(()=>{
   localStorage.clear();
   delete axios.defaults.headers.common['Authorization'];
})

const setup = (props) =>{
   const store = configureStore(false);
    return render(
       <Provider store={store} >
          <UserPage {...props}/>
       </Provider>
    )
};

const setUserOneLoggedInStorage = () => {
     localStorage.setItem(
     'hoax-auth',
      JSON.stringify({
      id: 1,
      username: 'user1',
      displayName: 'display1',
      image: 'profile1.png',
      password: 'P4ssword',
      isLoggedIn: true,
    })
  );
};

 describe('UserPage', ()=>{

    describe('Layout',()=>{

        it('has root page div', ()=>{
           const {queryByTestId} = setup();
           const userPageDiv = queryByTestId('userpage');
           expect(userPageDiv).toBeInTheDocument();
        })
        it('displays the displayName@username when user data loaded', async ()=>{
           apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
           const { findByText } = setup({match});
           const text = await findByText('display1@user1');
           expect(text).toBeInTheDocument();
        })
        it('displays user not found alert when user is not found', async ()=>{
           apiCalls.getUser = jest.fn().mockRejectedValue(mockFailGetUser);
           const { findByText } = setup({match});
           const alert = await findByText('User not found');
           expect(alert).toBeInTheDocument();
        })
        it('displays spinner while loading userdata',  ()=>{
           const mockDelayedResponse = jest.fn().mockImplementation(() =>{
              return new Promise((resolve , reject) => {
                 setTimeout(() => {
                    resolve(mockSuccessGetUser)
                 }, 300)
              })
           })
           apiCalls.getUser = mockDelayedResponse;
           const { queryByText } = setup({match});
           const spinner = queryByText('Loading...')
           expect(spinner).toBeInTheDocument();
        })
        it('displays the edit buttonwhen loggedInUser matches to user in url', async ()=>{
           setUserOneLoggedInStorage();
           apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
           const { findByText, queryByText } = setup({match});
           await findByText('display1@user1');
           const editButton = queryByText('Edit')
           expect(editButton).toBeInTheDocument();
        })
    })

    describe('Lifecycle',()=>{

        it('calls get user when it is rendered', ()=>{
           apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
           setup({match});
           expect(apiCalls.getUser).toHaveBeenCalledTimes(1);
        })

        it('calls getUser for user1 when it is rendered with user1 in match', ()=>{
           apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
           setup({match});
           expect(apiCalls.getUser).toHaveBeenCalledWith('user1');
        })
    })

     describe('ProfileCard Interactions',()=>{

       const setupForEdit = async () => {
      setUserOneLoggedInStorage();
      apiCalls.getUser = jest.fn().mockResolvedValue(mockSuccessGetUser);
      const rendered = setup({ match });
      const editButton = await rendered.findByText('Edit');
      fireEvent.click(editButton);
      return rendered;
    };

    const mockDelayedUpdateSuccess = () => {
       return jest.fn().mockImplementation(() => {
         return new Promise((resolve, reject) => {
            resolve(mockSuccessUpdateUser)
         },300)
       })
    }

         it('displays edit layout when clicking on the edit button', async ()=>{
           const { queryByText } = await setupForEdit();
           expect(queryByText('Save')).toBeInTheDocument();
        })

        it('returns to non edit mode after clicking cancel', async ()=>{
           const { queryByText } = await setupForEdit();
           const cancelButton = queryByText('Cancel')
           fireEvent.click(cancelButton);
           expect(queryByText('Edit')).toBeInTheDocument();
        })

        it('calls updateUser api when clicking save', async ()=>{
           const { queryByText } = await setupForEdit();
           apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);
           const saveButton = queryByText('Save')
           fireEvent.click(saveButton);
           expect(apiCalls.updateUser).toHaveBeenCalledTimes(1);
        })

        it('calls updateUser api with user id', async ()=>{
           const { queryByText } = await setupForEdit();
           apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);
           const saveButton = queryByText('Save')
           fireEvent.click(saveButton);
           const userId = apiCalls.updateUser.mock.calls[0][0];
           expect(userId).toBe(1);
        })

        it('calls updateUser api with request body having changed displayName', async ()=>{
           const { queryByText, container } = await setupForEdit();
           apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);

           const displayInput = container.querySelector('input');
           fireEvent.change(displayInput, {target: {value: 'display1-update'}})
           const saveButton = queryByText('Save')
           fireEvent.click(saveButton);
           const requestBody = apiCalls.updateUser.mock.calls[0][1];
           expect(requestBody.displayName).toBe('display1-update');
        })

        it('returns to non edit mode after successfull api call', async ()=>{
           const { queryByText, findByText } = await setupForEdit();
           apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);
           const saveButton = queryByText('Save')
           fireEvent.click(saveButton);
           const editButtonAfterClickingSave = await findByText('Edit')
           expect(editButtonAfterClickingSave).toBeInTheDocument();
        })

        it('returns to original displayName after it is changed in edit mode but canceled', async ()=>{
         const { queryByText, container } = await setupForEdit();
         const displayInput = container.querySelector('input');
         fireEvent.change(displayInput, {target: {value: 'display1-update'}})
         const cancelButton = queryByText('Cancel')
         fireEvent.click(cancelButton);
         const originalDisplayName = queryByText('display1@user1')
         expect(originalDisplayName).toBeInTheDocument();
      })

      it('returns to last updated displayName when displayName is changed for another time but canceled', async ()=>{
         const { queryByText, container , findByText } = await setupForEdit();
         let displayInput = container.querySelector('input');
         fireEvent.change(displayInput, {target: {value: 'display1-update'}})

         apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);
           const saveButton = queryByText('Save')
           fireEvent.click(saveButton);
           const editButtonAfterClickingSave = await findByText('Edit');
           fireEvent.click(editButtonAfterClickingSave);
           displayInput = container.querySelector('input');
           fireEvent.change(displayInput, {target: {value: 'display1-update-second-time'}})
         const cancelButton = queryByText('Cancel')
         fireEvent.click(cancelButton);
         const lastSavedData = container.querySelector('h4')
         
         expect(lastSavedData).toHaveTextContent('display1-update@user1');
      })

      it('displays spinner when there is updateUser api call', async ()=>{
         const { queryByText, findByText } = await setupForEdit();
         apiCalls.updateUser = mockDelayedUpdateSuccess();
         const saveButton = queryByText('Save')
         fireEvent.click(saveButton);
         const spinner = queryByText('Loading...')
         expect(spinner).toBeInTheDocument();
      })

      it('disables save button when there is updateUser api call', async ()=>{
         const { queryByText } = await setupForEdit();
         apiCalls.updateUser = mockDelayedUpdateSuccess();
         const saveButton = queryByText('Save')
         fireEvent.click(saveButton);
         
         expect(saveButton).toBeDisabled();
      })

      it('disables cancel button when there is updateUser api call', async ()=>{
         const { queryByText } = await setupForEdit();
         apiCalls.updateUser = mockDelayedUpdateSuccess();
         const saveButton = queryByText('Save')
         fireEvent.click(saveButton);
         const cancelButton = queryByText('Cancel')
         expect(cancelButton).toBeDisabled();
      })

      it('returns to last updated displayName when displayName is changed for another time but canceled', async ()=>{
         const { queryByText, container , findByText } = await setupForEdit();
         let displayInput = container.querySelector('input');
         fireEvent.change(displayInput, {target: {value: 'display1-update'}})

         apiCalls.updateUser = jest.fn().mockResolvedValue(mockSuccessUpdateUser);
           const saveButton = queryByText('Save')
           fireEvent.click(saveButton);
           const editButtonAfterClickingSave = await findByText('Edit');
           fireEvent.click(editButtonAfterClickingSave);
           displayInput = container.querySelector('input');
           fireEvent.change(displayInput, {target: {value: 'display1-update-second-time'}})
         const cancelButton = queryByText('Cancel')
         fireEvent.click(cancelButton);
         const lastSavedData = container.querySelector('h4')
         
         expect(lastSavedData).toHaveTextContent('display1-update@user1');
      })

        
    })
 })

 console.error = () => {}