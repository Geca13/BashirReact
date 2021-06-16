import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

describe('displays homepage when url is /',()=>{
     
    render(
        <MemoryRouter initialEntries={['/']}>
            <App/>
        </MemoryRouter>
    )
})