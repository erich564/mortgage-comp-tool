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
import { createRef, useState } from 'react';

export default function ShareDialog({
  link,
  isShareDialogOpen,
  setIsShareDialogOpen,
}) {
  const initialText = 'Click to copy';
  const clickedText = 'Copied!';
  const [tooltip, setTooltip] = useState(initialText);
  const handleClose = () => setIsShareDialogOpen(false);
  const textField = createRef();

  const handleClick = () => {
    textField.current.select();

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
                  ref: textField,
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
