import React, { Component } from 'react';
import * as apiCalls from '../api/apiCalls'
import Spinner from './Spinner';
import HoaxView from './HoaxView';

class HoaxFeed extends Component {

    state = {
        page: {
            content: []
        },
        isLoadingHoaxes: false
    }

    componentDidMount(){
        this.setState({isLoadingHoaxes: true})
        apiCalls.loadHoaxes(this.props.user).then(response => {
            this.setState({page: response.data, isLoadingHoaxes: false})
        });
    }

    onClickLoadMore = () =>{
        const hoaxes = this.state.page.content;
        if(hoaxes.length === 0){
return;
        }
        const hoaxAtBottom = hoaxes[hoaxes.length - 1];
        apiCalls.loadOldHoaxes(hoaxAtBottom);
    }
    render() {
        if(this.state.isLoadingHoaxes) {
            return (
                <Spinner/>
            )
        }
        if(this.state.page.content.length === 0) {
            return (
                <div className='card card-header text-center'>
                    There are no hoaxes
                </div>
            );
        }
        return (
            <div className='card card-header text-center'>
                {this.state.page.content.map((hoax) => {
                    return <HoaxView key={hoax.id} hoax = {hoax} />
                })}
                {this.state.page.last === false && (
                    <div className='card card-header text-center'>
                        Load More
                    </div>
                )}
            </div>
        );
    }
}

export default HoaxFeed;