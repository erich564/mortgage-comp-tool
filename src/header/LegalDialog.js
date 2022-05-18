import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  styled,
} from '@mui/material';

const Header = styled(({ children, ...props }) => (
  <Typography {...props} component="div">
    {children}
  </Typography>
))({ fontSize: '1.25rem', fontWeight: 500 });

export default function LegalDialog({
  isLegalDialogOpen,
  setIsLegalDialogOpen,
}) {
  const handleClose = () => setIsLegalDialogOpen(false);

  return (
    <Dialog
      fullWidth
      maxWidth="md"
      open={isLegalDialogOpen}
      onClose={handleClose}
    >
      <DialogContent>
        <Header>Privacy Policy</Header>
        <p>
          None of the information you provide is transmitted anywhere or shared.
        </p>
        <Header>Terms of Use</Header>
        <p>
          Erich Meier (&quot;Erich&quot;) provides this website (the
          &quot;Site&quot;) for informational purposes only. You should not
          construe any such information as legal, tax, investment, financial, or
          other advice. The Site and content are provided &quot;as is&quot; and
          without warranties of any kind. You bear all risks associated with the
          use of the Site and content, including without limitation, any
          reliance on the accuracy, completeness or usefulness of any content
          available on the Site. In exchange for using the Site, you agree not
          to hold Erich liable for any possible claim for damages arising from
          any decision you make based on information made available to you
          through the Site.
        </p>
        <Header>Contact</Header>
        <p style={{ marginBottom: 0 }}>
          If you have any questions or comments, feel free to message{' '}
          <a
            href="https://www.linkedin.com/in/erich564/"
            target="_blank"
            rel="noreferrer"
          >
            me on LinkedIn
          </a>
          .
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
