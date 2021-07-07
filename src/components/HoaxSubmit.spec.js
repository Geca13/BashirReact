import React from 'react'
import { render, fireEvent , waitFor,
  waitForElementToBeRemoved, } from '@testing-library/react'
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

      let textArea;
    const setupFocused = () => {
      const rendered = setup();
      textArea = rendered.container.querySelector('textarea');
      fireEvent.focus(textArea);
      return rendered;
    };

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
      it('calls postHoax with Hoax request when clicking Hoaxify' , () =>{
        const { container, queryByText } = setup();
        const textarea = container.querySelector('textarea');
        fireEvent.focus(textarea);
        
        fireEvent.change(textarea , {target: { value: 'Test hoax content'}});
        const hoaxifyButton = queryByText('Hoaxify')
        apiCalls.postHoax = jest.fn().mockResolvedValue({});
        fireEvent.click(hoaxifyButton);
        expect(apiCalls.postHoax).toHaveBeenLastCalledWith({
          content: 'Test hoax content'
        });
      });

      it('returns back to not focused state after successful postHoax action',async  () =>{
        const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

      const hoaxifyButton = queryByText('Hoaxify');

      apiCalls.postHoax = jest.fn().mockResolvedValue({});
      fireEvent.click(hoaxifyButton);

      await waitFor(() => {
        expect(queryByText('Hoaxify')).not.toBeInTheDocument();
      });
      });

      it('clears content after successful postHoax action',async  () =>{
        const { queryByText } = setupFocused();
      fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

      const hoaxifyButton = queryByText('Hoaxify');

      apiCalls.postHoax = jest.fn().mockResolvedValue({});
      fireEvent.click(hoaxifyButton);

      await waitFor(() => {
        expect(queryByText('Test hoax content')).not.toBeInTheDocument();
      });
      });

      it('clears content after sclicking the cancel Button', () =>{
        const { container ,queryByText } = setupFocused();
        const textArea = container.querySelector('textarea');
        fireEvent.focus(textArea)
      fireEvent.change(textArea, { target: { value: 'Test hoax content' } });

      const cancelButton = queryByText('Cancel');
      fireEvent.click(cancelButton);
      expect(queryByText('Test hoax content')).not.toBeInTheDocument();
      
      });
      
  })

})