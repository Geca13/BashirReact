import React, { Component } from 'react'
import ProfileImageWithDefault from './ProfileImageWithDefault'
import { connect } from 'react-redux'
import * as apiCalls from '../api/apiCalls'
import ButtonWithProgress from './ButtonWithProgress'
import Input from './Input'

 class HoaxSubmit extends Component {

    state = {
        focused: false,
        content: undefined,
        pendingApiCall: false,
        errors:{},
        file: undefined, 
        image: undefined,
        attachment: undefined
    }

    onChangeContent = () =>{
        const value = event.target.value;
        this.setState({ content: value, errors:{}})
    }

    onClickHoaxify =()=>{
        const body = {
            content: this.state.content,
            attachment: this.state.attachment
        }
        this.setState({pendingApiCall: true})
        apiCalls.postHoax(body).then((response) =>{

            this.resetState()
        }).catch(error =>{
            let errors ={}
            if(errors.response.data && errors.response.data.validationErrors ) {
             errors = errors.response.data.validationErrors
            }
            this.setState({pendingApiCall: false, errors})
        });
    }

    onFocus = () =>{
        this.setState({
            focused: true
        })
    }

    
    resetState = () =>{
        this.setState({
            focused: false,
        content: undefined,
        pendingApiCall: false,
        errors:{},
        file: undefined, 
        image: undefined,
        attachment: undefined
        })
    }

    onFileSelection = (event) =>{
        if(event.target.files.length === 0) {
            return;
        }
        const file = event.target.files[0];
        let reader = new FileReader();
        reader.onloadend = () =>{
            this.setState({
                image: reader.result,
                file
            }, ()=>{
                this.uploadFile()
            })
        }
        reader.readAsDataURL(file);
    }

    uploadFile = () => {
        const body = new FormData()
        body.append('file', this.state.file)
        apiCalls.postHoaxFile(body).then(response =>{
            this.setState({attachment: response.data})
        })
    }
   
    render() {
        let textAreaClassName = 'form-control w-100';
        if(this.state.errors.content){
            textAreaClassName += ' is-invalid'
        }
        return (
            <div className='card d-flex flex-row p-1'>
                <ProfileImageWithDefault
                className='rounded-circle m-1'
                width='32' height='32'
                image={this.props.loggedInUser.image} />
                <div className='flex-fill'>
                <textarea value ={this.state.content} onChange={this.onChangeContent} onFocus={this.onFocus} className={textAreaClassName} rows={this.state.focused ? 3 :1}/>
                {this.state.errors.content && <span className='invalid-feedback'>{this.state.errors.content}</span>}

                {this.state.focused && (
                <div>
                    <div className='pt-1'>
                        <Input type='file' onChange={this.onFileSelection} />
                        {this.state.image &&
                         <img className='mt-1 img-thumbnail'
                             src={this.state.image} alt='upload' width='128' height='64' />}
                    </div>
                <div className='text-right mt-1'>
                <ButtonWithProgress text='Hoaxify'
                 onClick={this.onClickHoaxify}
                disabled={this.state.pendingApiCall}
                pendingApiCall={this.pendingApiCalls}
                 className= 'btn btn-success'/>
                <button onClick={this.resetState}
                disabled={this.state.pendingApiCall}
                 className= 'btn btn-light ml-1'><i className='fas fa-times'></i> Cancel</button>
                 </div>
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
