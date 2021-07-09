import React from 'react'
import { render } from '@testing-library/react'
import HoaxView from './HoaxView'
import { MemoryRouter } from 'react-router-dom';

const setup = (hoax = hoaxWithoutAttachment, state = loggedInStateUser1) => {
    const oneMinute = 60 * 1000;
    const date = new Date(new Date() - oneMinute);
    hoax.date = date;
    const store = createStore(authReducer, state);
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <HoaxView hoax={hoax} />
        </MemoryRouter>
      </Provider>
    );
  };

describe('HoaxView', ()=>{
    describe('Layout', ()=>{
        it('displays hoax content', () => {
            const { queryByText } = setup();
            expect(queryByText('This is the first hoax')).toBeInTheDocument();
        });

        it('displays users image', () => {
            const { container } = setup();
            const image = container.querySelector('img');
            expect(image.src).toContain('/images/profile/profile1.png');
        });
        it('displays displayName@user', () => {
            const { queryByText } = setup();
            expect(queryByText('display1@user1')).toBeInTheDocument();
        });
        it('displays relative time', () => {
           const { queryByText } = setup();
           expect(queryByText('1 minute ago')).toBeInTheDocument();
         });
         it('has link to user page' ,()=>{
           const { container } = setup();
           const anchor = container.querySelector('a');
           expect(anchor.getAttribute('href')).toBe('/user1');
         });
    })
})