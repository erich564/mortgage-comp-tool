import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Tooltip,
} from '@mui/material';
import copy from 'copy-to-clipboard';
import { useState } from 'react';
import { stateToQueryStringUrl } from './QueryStringUtil';

export default function ShareDialog({
  state,
  isShareDialogOpen,
  setIsShareDialogOpen,
}) {
  const handleClose = () => setIsShareDialogOpen(false);
  const initialText = 'Click to copy';
  const clickedText = 'Copied!';
  const [tooltip, setTooltip] = useState(initialText);
  const link = stateToQueryStringUrl(state);
  const handleClick = () => {
    copy(link, {
      format: 'text/plain',
      onCopy: () => setTooltip(clickedText),
    });
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isShareDialogOpen}
      onClose={handleClose}
    >
      <DialogTitle>Share</DialogTitle>
      <DialogContent>
        <Tooltip
          title={tooltip}
          onOpen={() => setTooltip(initialText)}
          disableInteractive
        >
          <Box onClick={handleClick}>
            <TextField
              fullWidth
              variant="filled"
              value={link}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <ContentCopyIcon
                    sx={{ pointerEvents: 'none' }}
                    onClick={handleClick}
                  />
                ),
                sx: {
                  '&:hover': {
                    cursor: 'pointer',
                  },
                },
                inputProps: {
                  sx: {
                    '&:hover': {
                      cursor: 'pointer',
                    },
                  },
                },
              }}
            />
          </Box>
        </Tooltip>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
