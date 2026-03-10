import React from 'react';
import "bootstrap/dist/css/bootstrap.css";

function Loading(props) {

    return (
        <div class="d-flex align-items-center justify-content-center" style={{height:'80vh'}}>
            <img style={{width: '100px', height: '100px'}} className="spinner-border spinner-border-sm"/>
            {
                props.message ? <h2 className='row p-4'>{props.message}</h2> : null
            }
        </div>
    )
};

export default Loading;