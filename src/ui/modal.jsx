import classes from './modal.module.scss';
import Button from './Button';
import Card from './Card';
import {useState} from 'react';

const Modal = (props) =>{
    const [wtValue, setWtValue] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (event) => {

        let val = [event.target[0].value][0];
        if(!val){
            setError(true);
            event.preventDefault();
        } else{
            props.modalClosed();
            props.handleFSubmit(val);
        }

    };

    const valueChange = (e) =>{
        setError(false)
        setWtValue(e.target.value)
    };
    return(
        <>
            {props.show? <div className={classes.Backdrop} onClick={props.modalClosed}></div> : null}
            <div className={classes.Modal}
                 style={{
                     transform: props.show? 'translateY(0)': 'translateY(-100vh)',
                     opacity: props.show ? '1': '0'
                 }}>
                <Card>
                <h3>Add Weight Log</h3>
                <div style={{fontSize:'15px'}}>You can manually add your weight log using the form below</div>
                 <form onSubmit={handleSubmit} noValidate>
                     <label>Weight
                     <input type="number" name="weight" value={wtValue} style={{ border: error ? '1px solid red' : '1px solid #ccc' }}
                           onChange={e => valueChange(e)} required autoComplete="false"/>
                     </label>
                     {error && <span style={{color:'red'}}>Please enter your weight</span>}
                     <div className={classes.Button}>
                     <a style={{marginRight:'10px'}} onClick={props.modalClosed}>Cancel</a>
                     <Button classes="primary" type="submit" color="primary">Save</Button>
                     </div>
                 </form>
                </Card>
            </div>

            </>
    )
};

export default Modal;
