import React from 'react';
import { Grid } from '@material-ui/core';

type UserProps = {
    name: string
};
const User = (props: UserProps) => {
    return (
        <Grid container>
            <Grid item xs={12}>
                <h1>{props.name}</h1>
            </Grid>
        </Grid>
    )
};

export default User;