import React, { useState , useEffect , useReducer } from 'react';
import * as apiCalls from '../api/apiCalls'
import Spinner from './Spinner';
import HoaxView from './HoaxView';
import Modal from './Modal';

const HoaxFeed = (props) => {
    const [page, setPage] = useState({content: []});
    const [isLoadingHoaxes , setLoadingHoaxes] = useState(false);
    const [isLoadingOldHoaxes , setLoadingOldHoaxes] = useState(false);
    const [isLoadingNewHoaxes , setLoadingNewHoaxes] = useState(false);
    const [isDeletingHoax, setDeletingHoax] = useState(false);
    const [newHoaxCount , setNewHoaxCount] = useState(0);
    const [hoaxToBeDeleted , setHoaxToBeDeleted] = useState();
   /*
    

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
    */
    const onClickLoadMore = () =>{
        const hoaxes = page.content;
        if(hoaxes.length === 0){
return;
        }
        const hoaxAtBottom = hoaxes[hoaxes.length - 1];
        setLoadingOldHoaxes(true);
        apiCalls.loadOldHoaxes(hoaxAtBottom.id, props.user)
        .then(response =>{
            
            setPage(previousPage =>({
                ...previousPage,
                last: response.data.last,
                content: [...previousPage.content, ...response.data.content]
            }));
            setLoadingOldHoaxes(false);
            this.setState({ page , isLoadingOldHoaxes: false})
        }).catch(error =>{
            setLoadingHoaxes(false);
        });
    }

    const checkCount = () =>{
        const hoaxes = page.content;
        let topHoaxId = 0;
        if(hoaxes.length > 0){
          topHoaxId= hoaxes[0].id;
         }
         const topHoax = hoaxes[0];
         apiCalls.loadNewHoaxCount(topHoaxId, props.user)
         .then(response =>{
             setNewHoaxCount(response.data.count);
         });
    };
    const onClickLoadNew = () =>{
        const hoaxes = page.content;
        let topHoaxId = 0;
        if(hoaxes.length > 0){
          topHoaxId= hoaxes[0].id;
         }
         setLoadingNewHoaxes(true);
        apiCalls.loadNewHoaxes(topHoaxId, props.user)
        .then(response => {
            setPage(previousPage =>({
                ...previousPage,
                last: response.data.last,
                content: [...response.data , ...previousPage.content]
            }));
            setNewHoaxCount(0);
            setLoadingNewHoaxes(false);
        }).catch(error => {
            setLoadingNewHoaxes(false);
            this.setState({ isLoadingNewHoaxes: false})
        });
    }

    
    const onClickModalOk = () => {
        setDeletingHoax(true)
        apiCalls.deleteHoax(onClickDeleteHoax.id).then((response)=>{
            setPage(previousPage =>({
                ...previousPage,
                content: previousPage.content.filter(hoax => hoax.id !== hoaxToBeDeleted.id)
            }));
            setDeletingHoax(false);
            setHoaxToBeDeleted();
        })
    }

   
        
        if(isLoadingHoaxes) {
            return (
                <Spinner/>
            )
        }
        if(page.content.length === 0 && newHoaxCount === 0) {
            return (
                <div className='card card-header text-center'>
                    There are no hoaxes
                </div>
            );
        }
        const newHoaxCountMessage = newHoaxCount === 1 ? 'There is 1 new hoax' : `There are ${newHoaxCount} new hoaxes`
        return (
            <div className='card card-header text-center'>
                {newHoaxCount > 0 && (
                    <div className="car card-header text-center" onClick={!isLoadingNewHoaxes && onClickLoadNew}
                     style={{cursor: isLoadingNewHoaxes ? '' : 'pointer'}}>
                        {isLoadingNewHoaxes ? <Spinner/> : newHoaxCountMessage}
                    </div>)
                }
                {page.content.map((hoax) => {
                    return <HoaxView key={hoax.id} hoax = {hoax} onClickDelete={() => setHoaxToBeDeleted(hoax)} />
                })}
                {page.last === false && (
                    <div className='card card-header text-center'
                    onClick={!isLoadingOldHoaxes && onClickLoadMore}
                    style={{cursor: this.isLoadingOldHoaxes ? 'not-allowed' : 'pointer'}}>
                       { isLoadingHoaxes ? <Spinner/> : 'Load More' }
                    </div>
                )}
                <Modal visible = {modalVisible && true}
                 onClickCancel={()=> setHoaxToBeDeleted()}
                 body={hoaxToBeDeleted && `Are you sure to delete '${hoaxToBeDeleted.content}'`}
                 title='Delete!'
                 okButton='Delete Hoax'
                 onClickOk={onClickModalOk}
                 pendingApiCall={isDeletingHoax} />
            </div>
        );
    
}

export default HoaxFeed;