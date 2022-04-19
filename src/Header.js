import ShareIcon from '@mui/icons-material/Share';
import { Button, Divider, Stack } from '@mui/material';
import { useState } from 'react';
import InfoDialog from './InfoDialog';
import ShareDialog from './ShareDialog';

export default function Header({ state, handleSampleData }) {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  return (
    <>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        spacing={1.25}
        justifyContent="center"
      >
        <Button onClick={() => setIsInfoDialogOpen(true)}>Information</Button>
        <Button onClick={() => handleSampleData(0)}>Sample Data 1</Button>
        <Button onClick={() => handleSampleData(1)}>Sample Data 2</Button>
        <Button onClick={() => handleSampleData(2)}>Sample Data 3</Button>
        <Button
          onClick={() => setIsShareDialogOpen(true)}
          startIcon={<ShareIcon />}
        >
          Share
        </Button>
      </Stack>

      <InfoDialog
        isInfoDialogOpen={isInfoDialogOpen}
        setIsInfoDialogOpen={setIsInfoDialogOpen}
      />

      <ShareDialog
        state={state}
        isShareDialogOpen={isShareDialogOpen}
        setIsShareDialogOpen={setIsShareDialogOpen}
      />
    </>
  );
}
