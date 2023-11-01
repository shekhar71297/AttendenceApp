import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const isValidFullName = (name) => /^[a-zA-Z ]{2,40}$/.test(name);
export const isValidQue = (que) => /^[a-zA-Z0-9., ]{5,100}$/.test(que);
export const isValidName = (name) => /^[a-zA-Z]{2,10}$/.test(name);
export const isValidContact = (contact) => /^[6789]\d{9}$/.test(contact);
export const isValidEmail=(email)=> /^[a-z0-9](\.?[a-z0-9]){5,}@g(oogle)?mail\.com$/.test(email);
export const isValidPnr =(pnr)=> /^[A-Za-z0-9-]+$/.test(pnr);
export const isValidPassword=(Password)=>/^(?=.*[!@#$%^&*,.?])(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(Password);

export const errorText = (message) => {
    return (<span style={{'display':'flex','alignItems':'center'}}>
      <ErrorOutlineIcon /> <span style={{'paddingLeft':'5px'}}>{message}</span>
    </span>)
  }
  
