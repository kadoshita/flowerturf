import React from 'react';
import { Grid } from '@material-ui/core';

type UserProps = {
    name: string
};
const User = (props: UserProps) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <p style={{ fontSize: '130%' }}>{props.name}</p>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}>
                <img src='user.png' alt="user icon" style={{ width: '50%', height: 'auto' }}></img>
            </Grid>
            <Grid item xs={4}></Grid>
        </Grid>
    )
};

export default User;