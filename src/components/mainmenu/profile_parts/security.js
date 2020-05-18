import React from 'react';

function ProfileSecurity(props) {
    return (
        <div className='col'>
            <div className='row'>
                <div className='col-sm-3'>
                    <label htmlFor="oppass">Old Password:</label>
                </div>
                <div className='col'>
                    <input type="password" id="oppass" name="oppass"/>
                </div>
            </div>
            <div className='row'>
                <div className='col-sm-3'>
                    <label htmlFor="nppass">New Password:</label>
                </div>
                <div className='col'>
                    <input type="password" id="nppass" name="nppass"/>
                </div>
            </div>
            <div className='row submit-row'>
                <div className='col'>
                    <button className="" id='profileBtn' type="button">Save</button>
                </div>
            </div>
        </div>
    );
}

export default ProfileSecurity;