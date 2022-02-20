import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState } from 'react';

export default function ColorTextFields2({ setNFTaddr2, ...props }) {
  const [value, setValue] = useState();
  const handleChange = (e) => {
    setValue(e.target.value);
    setNFTaddr2(e.target.value);
  };
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '35ch' }
      }}
      noValidate
      autoComplete="on"
    >
      <TextField
        label="NFT mint Address"
        color="secondary"
        value={value}
        onChange={handleChange}
        focused
      />
    </Box>
  );
}
