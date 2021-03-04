import * as moment from 'moment';
import table from './table.module.scss';
import React from "react";

const Table = React.memo(({weightData, goalData})=>{

    return(
        <>
            <table>
                <thead>
                <tr>
                    <th>Date, Time</th>
                    <th>Weight(lb)</th>
                    <th>Goal Delta</th>
                </tr>
                </thead>
                <tbody>
                { weightData && weightData.map(item=>(
                    <tr key={item.id}>
                        <td>{moment(item.dateTime).format('MMM D, hh:mm A')}</td>
                        <td> {Math.round(item.value * 10) / 10}</td>
                        <td>
                            {item.value>goalData &&  <span style={{color:'red'}}> +  {(Math.round(item.value * 10) / 10-goalData).toFixed(1)}</span>}
                            {item.value==goalData &&  <span> --</span>}
                            {item.value<goalData &&  <span style={{color:'green'}}>  {(Math.round(item.value * 10) / 10-goalData).toFixed(1)}</span>}

                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </>
    )
});

export default Table;
