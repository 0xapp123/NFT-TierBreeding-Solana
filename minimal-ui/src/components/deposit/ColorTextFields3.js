import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

export default function ColorTextFields3({ address, ...props }) {
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '35ch' }
      }}
      noValidate
      autoComplete="on"
    >
      <TextField label="NFT mint Address" color="secondary" value={address} focused />
    </Box>
  );
}
