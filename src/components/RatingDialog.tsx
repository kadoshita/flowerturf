import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, TextField } from '@material-ui/core';
import { Rating } from '@material-ui/lab';

type RatingDialogProps = {
    isOpen: boolean,
    toggleOpen: Function
};
const RatingDialog = (props: RatingDialogProps) => {
    const [ratingValue, setRatingValue] = useState<number | null>(0);
    const [message, setMessage] = useState('');

    const handleClick = async (isSubmit: boolean) => {
        if (isSubmit) {
            const submitData = {
                rating: ratingValue,
                session_duration: 0,
                message: message
            }
            await fetch(process.env.REACT_APP_RATING_API_URL || '', {
                body: JSON.stringify(submitData),
                mode: 'no-cors',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                }
            });
        }
        props.toggleOpen();
    }
    return (
        <Dialog open={props.isOpen} fullWidth>
            <DialogTitle>品質向上のため、サービスの評価をお願いします。</DialogTitle>
            <DialogContent>
                <Rating onChange={(e, v) => setRatingValue(v)} name='rating'></Rating>
                <TextField label="コメント" color="primary" multiline rows={3} fullWidth onChange={e => setMessage(e.target.value)}></TextField>
            </DialogContent>
            <DialogActions>
                <Button color='secondary' onClick={() => handleClick(false)}>スキップ</Button>
                <Button color='primary' onClick={() => handleClick(true)}>送信</Button>
            </DialogActions>
        </Dialog>
    )
};

export default RatingDialog;