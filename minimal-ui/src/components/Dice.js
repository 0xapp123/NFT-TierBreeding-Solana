import * as React from 'react';
import { Typography } from '@mui/material';

export default function Dice({ mintFirst, ...props }) {
  return (
    <div className="box">
      <h3>Tier1</h3>
      {mintFirst.length !== 0 &&
        mintFirst.map((item, key) => (
          <Typography key={key} component="h5">
            {item.mint}
          </Typography>
        ))}
    </div>
  );
}
