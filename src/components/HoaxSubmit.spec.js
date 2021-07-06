import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import HoaxSubmit from './HoaxSubmit'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import authReducer from '../redux/authReducer';
import * as apiCalls from '../api/apiCalls'


const defaultState = {
   id: 1,
   username: 'user1',
   displayName: 'display1',
   image: 'profile1.png',
   password:'P4ssword',
   isLoggedIn: true
};

let store;

const setup = (state = defaultState) =>{
   const store = createStore(authReducer, state);
    return render(
       <Provider store={store}>
         <HoaxSubmit/>
        </Provider>
    )
}


describe('HoaxSubmit' , () =>{
    describe('Layout' , () =>{
        it('has textarea' , () =>{
          const { container } = setup();
          const textarea = container.querySelector('textarea')
          expect(textarea).toBeInTheDocument();
        });
        it('has image' , () =>{
            const { container } = setup();
            const image = container.querySelector('img');
            expect(image).toBeInTheDocument();
          })
        
          it('displays textarea 1 line' , () =>{
            const { container } = setup();
            const textarea = container.querySelector('textarea')
            expect(textarea.rows).toBe(1);
          });  
          it('displays user image' , () =>{
            const { container } = setup();
            const image = container.querySelector('img');
            expect(image.src).toContain('/images/profile/' + defaultState.image);
          })
    })

    describe('Interactions' , () =>{
      it('display three rows when focused to textarea' , () =>{
        const { container } = setup();
        const textarea = container.querySelector('textarea');
        fireEvent.focus(textarea)
        expect(textarea.rows).toBe(3);
      });
      it('displays hoaxify button when focused to textarea' , () =>{
        const { container, queryByText } = setup();
        const textarea = container.querySelector('textarea');
        fireEvent.focus(textarea);
        const hoaxifyButton = queryByText('Hoaxify')
        expect(hoaxifyButton).toBeInTheDocument();
      });
      it('displays cancel button when focused to textarea' , () =>{
        const { container, queryByText } = setup();
        const textarea = container.querySelector('textarea');
        fireEvent.focus(textarea);
        const cancelButton = queryByText('Cancel')
        expect(cancelButton).toBeInTheDocument();
      });
      it('does not display hoaxify button when textarea is not focused' , () =>{
        const { queryByText } = setup();
        
        const hoaxifyButton = queryByText('Hoaxify')
        expect(hoaxifyButton).not.toBeInTheDocument();
      });

      it('does not display hoaxify button when textarea is not focused' , () =>{
        const { queryByText } = setup();
        
        const cancelButton = queryByText('Cancel')
        expect(cancelButton).not.toBeInTheDocument();
      });
      it('returns back to unfocused after clicking the cancel button' , () =>{
        const { container, queryByText } = setup();
        const textarea = container.querySelector('textarea');
        fireEvent.focus(textarea);
        const cancelButton = queryByText('Cancel')
        fireEvent.click(cancelButton);
        expect(queryByText('Cancel')).not.toBeInTheDocument();
      });
      
  })

})