import React from 'react'
import { render } from '@testing-library/react'
import UserList from './UserList'

const setup = () =>{
    return render(<UserList/>)
}

describe('UserList', () => {
    describe('Layout', () => {
        it('has header of Users', () => {
           const { container } = setup();
           const header = container.querySelector('h3');
           expect(header).toHaveTextContent('Users');
        });
     
    });

});