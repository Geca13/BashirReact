import React, { Component } from 'react'
import ProfileImageWithDefault from './ProfileImageWithDefault'
import { connect } from 'react-redux'

 class HoaxSubmit extends Component {

    state = {
        focused: false
    }

    onFocus = () =>{
        this.setState({
            focused: true
        })
    }

    onClickCancel = () =>{
        this.setState({
            focused: false
        })
    }
   
    render() {
        return (
            <div className='card d-flex flex-row p-1'>
                <ProfileImageWithDefault
                classname='rounded-circle m-1'
                width='32' height='32'
                image={this.props.loggedInUser.image} />
                <div className='flex-fill'>
                <textarea onFocus={this.onFocus} className='form-control w-100' rows={this.state.focused ? 3 :1}/>
                {this.state.focused && (<div className='text-right mt-1'>
                <button className= 'btn btn-success'>Hoaxify</button>
                <button onClick={this.onClickCancel} className= 'btn btn-light ml-1'><i className='fas fa-times'></i> Cancel</button>
                </div>)}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loggedInUser: state
    }
}

export default connect(mapStateToProps)(HoaxSubmit)
