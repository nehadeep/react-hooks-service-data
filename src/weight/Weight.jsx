import Card from '../ui/Card';
import {useEffect, useState} from 'react';
import axios from 'axios';
import * as moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Table from '../ui/table';
import Modal from '../ui/modal';
import {Reducer} from '../store/reducer';
const urlPrefix = 'http://localhost:9000/weights';

const Weight = () => {
    const [regularWData, setRWeightData] = useState([]);
    const [irrRData, setIrrRWeightData] = useState([]);
    const [isOn, toggleIsOn] = useState(false);
    const your_goal = 175;
    const [toaster, setToaster] = useState(false);

    const {state, dispatch} = Reducer();

    const postWeight =  (data) => axios.post(urlPrefix, data);

    const showHideModal = () =>{
        toggleIsOn(!isOn)
    };

    const handleIncomingSubmit = async (weight) =>{

        let isRegular = Math.abs(+weight - your_goal)>50? true: false;
        let postData = {
            value: +weight,
            dateTime: new Date().toISOString(),
            isIrregular: isRegular
        };

        const {data} = await postWeight(postData);

        if(data.isIrregular){
            let updatedData = [data, ...state.irrRegularData, ];
            setIrrRWeightData(updatedData);
            dispatch({type: 'SAVE_IRR_REGULAR_DATA', payload: updatedData});
        } else{
            let updatedData = [data, ...state.regularData];
            setRWeightData(updatedData);
            dispatch({type: 'SAVE_REGULAR_DATA', payload: updatedData});
        }
       setToaster(true);
       setTimeout(()=>setToaster(false), 3000);
    };

    useEffect( ()=>{
        let cancelRequest = false;
        const fetchData = async() => {
            try {
                const {data} = await axios.get(urlPrefix);

                const sortedDates =  data.sort((a, b)=> new Date(b.dateTime.split('T')[0]) - new Date(a.dateTime.split('T')[0]));

                const regularData = sortedDates.filter(d=>!(Math.abs(Math.round(d.value * 10) / 10-your_goal)>50));

                const irrData = sortedDates.filter(d=>Math.abs(Math.round(d.value * 10) / 10-your_goal)>50);

                if (cancelRequest) return;
                setRWeightData(regularData);
                dispatch({type: 'SAVE_REGULAR_DATA', payload: regularData});


                setIrrRWeightData(irrData);

                dispatch({type: 'SAVE_IRR_REGULAR_DATA', payload: irrData});

            } catch (e) {

            }
        };
        fetchData();

        return function cleanUp() {
            cancelRequest = true;

        };

    },[dispatch]);
    return(
        <>
            <h2>Weight <span style={{float:'right'}}><a onClick={showHideModal}>+Add Reading</a></span></h2>
            {toaster && <h3 style={{color:'green'}}>A new Weight reading is added for you.</h3>}
            {isOn && <Modal show={isOn} modalClosed={showHideModal} handleFSubmit={e=>handleIncomingSubmit(e)}/> }
            <Grid container spacing={3}>
            <Grid item xs={9}>
            <Card>
                <h3>Your Weight Readings</h3>
                <div>These are weight readings that have been recorded for you</div>
                {regularWData &&  <Table weightData={regularWData} goalData={your_goal}/>}
            </Card>
            </Grid>
            <Grid item xs={3}>
            <Card>
                <h3>Latest Reading</h3>
                {regularWData && regularWData.length &&  <span>{regularWData[0].value} on {moment(regularWData[0].dateTime).format('MMM D, hh:mm A')}</span>}
                <h3 style={{marginTop: '20px'}}>Your Goal</h3>
                <span>{your_goal}lb</span>

            </Card>
            </Grid>

                <Grid item xs={9}>
                    <Card>
                        <h3>Other Weight Readings</h3>
                        <div>Your scale is just for your.Readings that are +/-50 lbs from your goal weight appear as irregular.</div>

                        {irrRData && <Table weightData={irrRData} goalData={your_goal}/>}


                    </Card>
                </Grid>
            </Grid>

        </>
    )
};

export default Weight;
