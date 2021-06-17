import React from 'react';
import logo from '../../public/logo192.png'
import {Link} from 'react-router-dom'

class TopBar extends React.Component {
    render() {
        return (
            <div className='bg-white shadow-sm mb-2'>
              <div className='bcontainer'>
                <nav className='navbar navbar-light navbar-expand'>
                  <Link to='/' className='navbar-brand' >
                   <img src={logo} width='60' alt='Hoaxify'/> Hoaxify
                  </Link>
                  <ul className ='nav navbar-nav ml-auto'>
                      <li className= 'nav-item'>
                         <Link to='/signup' className='nav-link'>
                             Sign Up
                         </Link>

                         <Link to='/login' className='nav-link'>
                             Login
                         </Link>
                      </li>
                  </ul>
                </nav> 
              </div>  
            </div>
        );
    }
}

export default TopBar;
