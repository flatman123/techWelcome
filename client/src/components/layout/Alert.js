import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { STATES } from 'mongoose';

const Alert = props => 
    props.alerts !== null && 
    props.alerts.length > 0 && 
    props.alerts.map(alert => (

            <div key={alert.id} className={`alert alert-${alert.alertType}`}>
                { alert.msg }
            </div>
));



Alert.propTypes = {
    alerts: PropTypes.array.isRequired
};

// Grab state for alerts from redux 
const mapStateToProps = state => {
    return {
        alerts: state.alert
    }
}

// Grab the current state from REdux and map it to props so other components can use is

export default connect(mapStateToProps)(Alert);