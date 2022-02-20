import * as React from 'react';
import { Typography } from '@mui/material';

export default function Dice2({ mintSecond, ...props }) {
  return (
    <div className="box">
      <h3>Tier2</h3>
      {mintSecond.length !== 0 &&
        mintSecond.map((item, key) => (
          <div>
            <Typography key={key} component="h5">
              {item.mint}
            </Typography>
          </div>
        ))}
    </div>
  );
}
