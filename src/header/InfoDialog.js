import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export default function InfoDialog({ isInfoDialogOpen, setIsInfoDialogOpen }) {
  const handleClose = () => setIsInfoDialogOpen(false);

  return (
    <Dialog maxWidth="md" open={isInfoDialogOpen} onClose={handleClose}>
      <DialogTitle>Information</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
          blandit turpis cursus in hac habitasse. Aliquam eleifend mi in nulla
          posuere sollicitudin aliquam ultrices sagittis. Et tortor consequat id
          porta nibh. Elit duis tristique sollicitudin nibh sit amet commodo.
          Pulvinar sapien et ligula ullamcorper malesuada proin libero nunc
          consequat. Eget magna fermentum iaculis eu non diam phasellus
          vestibulum. Lacus vel facilisis volutpat est velit. Mauris augue neque
          gravida in fermentum et sollicitudin. Enim ut tellus elementum
          sagittis vitae et leo duis.
          <br />
          <br />
          Id consectetur purus ut faucibus pulvinar elementum integer enim
          neque. Tincidunt id aliquet risus feugiat in ante metus dictum. Quis
          hendrerit dolor magna eget est lorem ipsum. Convallis posuere morbi
          leo urna molestie at elementum eu facilisis. Id faucibus nisl
          tincidunt eget nullam. Varius vel pharetra vel turpis nunc eget lorem.
          Suscipit tellus mauris a diam maecenas sed enim ut. Nunc lobortis
          mattis aliquam faucibus purus in massa tempor nec. In hendrerit
          gravida rutrum quisque non. Adipiscing diam donec adipiscing tristique
          risus. Eleifend donec pretium vulputate sapien nec sagittis aliquam
          malesuada bibendum. Habitasse platea dictumst vestibulum rhoncus est
          pellentesque elit. Bibendum ut tristique et egestas quis ipsum
          suspendisse. Morbi tempus iaculis urna id volutpat lacus laoreet.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
