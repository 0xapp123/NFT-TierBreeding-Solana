import * as React from 'react';
import { Typography } from '@mui/material';

export default function Dice3({ mintThird, ...props }) {
  return (
    <div className="box">
      <h3>Tier3</h3>
      {mintThird.length !== 0 &&
        mintThird.map((item, key) => (
          <div>
            <Typography key={key} component="h5">
              {item.mint}
            </Typography>
          </div>
        ))}
    </div>
  );
}
