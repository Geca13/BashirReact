import React, { Component } from 'react';
import * as apiCalls from '../api/apiCalls'
import Spinner from './Spinner';
import HoaxView from './HoaxView';
import Modal from './Modal';

class HoaxFeed extends Component {

    state = {
        page: {
            content: []
        },
        isLoadingHoaxes: false,
        newHoaxCount: 0,
        isLoadingOldHoaxes: false,
        isLoadingNewHoaxes: false,
        isDeletingHoax: false
    }

    componentDidMount(){
        this.setState({isLoadingHoaxes: true})
        apiCalls.loadHoaxes(this.props.user).then(response => {
            this.setState({page: response.data, isLoadingHoaxes: false}, 
               () =>{
                this.counter = setInterval(this.checkCount, 3000);
               } 
                );
        });
    }

    componentWillUnmount(){
        clearInterval(this.counter);
    }

    onClickLoadMore = () =>{
        const hoaxes = this.state.page.content;
        if(hoaxes.length === 0){
return;
        }
        const hoaxAtBottom = hoaxes[hoaxes.length - 1];
        this.setState({isLoadingOldHoaxes: true})
        apiCalls.loadOldHoaxes(hoaxAtBottom.id, this.props.user)
        .then(response =>{
            const page = {...this.state.page}
            page.content = [...page.content, ...response.data.content];
            page.last = response.data.last;
            this.setState({ page , isLoadingOldHoaxes: false})
        }).catch(error =>{
            this.setState({ isLoadingHoaxes: false})
        });
    }

    checkCount = () =>{
        const hoaxes = this.state.page.content;
        let topHoaxId = 0;
        if(hoaxes.length > 0){
          topHoaxId= hoaxes[0].id;
         }
         const topHoax = hoaxes[0];
         apiCalls.loadNewHoaxCount(topHoaxId, this.props.user)
         .then(response =>{
             this.setState({ newHoaxCount: response.data.count})
         });
    };
    onClickLoadNew = () =>{
        const hoaxes = this.state.page.content;
        let topHoaxId = 0;
        if(hoaxes.length > 0){
          topHoaxId= hoaxes[0].id;
         }
         this.setState({isLoadingNewHoaxes: true})
        apiCalls.loadNewHoaxes(topHoaxId, this.props.user)
        .then(response => {
            const page = {...this.state.page}
            page.content = {...response.data, ...page.content}
            this.setState({ page , newHoaxCount: 0, isLoadingNewHoaxes:false});
        }).catch(error => {
            this.setState({ isLoadingNewHoaxes: false})
        });
    }

    onClickDeleteHoax = (hoax) => {
        this.setState({ hoaxToBeDeleted: hoax})
    }

    onClickModalCancel = () => {
        this.setState({hoaxToBeDeleted: undefined})
    }
    onClickModalOk = () => {
        this.setState({isDeletingHoax: true})
        apiCalls.deleteHoax(this.state.onClickDeleteHoax.id).then((response)=>{
            const page = { ...this.state.page}
            page.content = page.content.filter(hoax => hoax.id !== this.state.hoaxToBeDeleted.id)
            this.setState({hoaxToBeDeleted: undefined, page})
        })
    }

    render() {
        
        if(this.state.isLoadingHoaxes) {
            return (
                <Spinner/>
            )
        }
        if(this.state.page.content.length === 0 && this.state.newHoaxCount === 0) {
            return (
                <div className='card card-header text-center'>
                    There are no hoaxes
                </div>
            );
        }
        const newHoaxCountMessage = this.state.newHoaxCount === 1 ? 'There is 1 new hoax' : `There are ${this.state.newHoaxCount} new hoaxes`
        return (
            <div className='card card-header text-center'>
                {this.state.newHoaxCount > 0 && (
                    <div className="car card-header text-center" onClick={!this.state.isLoadingNewHoaxes && this.onClickLoadNew}
                     style={{cursor: this.state.isLoadingNewHoaxes ? '' : 'pointer'}}>
                        {this.state.isLoadingNewHoaxes ? <Spinner/> : newHoaxCountMessage}
                    </div>)
                }
                {this.state.page.content.map((hoax) => {
                    return <HoaxView key={hoax.id} hoax = {hoax} onClickDelete={() => this.onClickDeleteHoax(hoax)} />
                })}
                {this.state.page.last === false && (
                    <div className='card card-header text-center'
                    onClick={!this.isLoadingOldHoaxes && this.onClickLoadMore}
                    style={{cursor: this.isLoadingOldHoaxes ? 'not-allowed' : 'pointer'}}>
                       { this.state.isLoadingHoaxes ? <Spinner/> : 'Load More' }
                    </div>
                )}
                <Modal visible = {this.state.modalVisible && true}
                 onClickCancel={this.onClickModalCancel}
                 body={this.state.hoaxToBeDeleted && `Are you sure to delete '${this.state.hoaxToBeDeleted.content}'`}
                 title='Delete!'
                 okButton='Delete Hoax'
                 onClickOk={this.onClickModalOk}
                 pendingApiCall={this.state.isDeletingHoax} />
            </div>
        );
    }
}

export default HoaxFeed;