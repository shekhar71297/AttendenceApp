import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const DialogBox = ({ open, onClose, onConfirm, message,title,content, submitLabel,disable }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white', fontSize: '28px' }}>{title}</DialogTitle>
      <DialogContent>
        {content}
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="primary" disabled={disable}>
        {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBox;
