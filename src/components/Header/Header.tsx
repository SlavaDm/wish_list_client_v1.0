import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => {
  return (
    <>
      <AppBar style={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar style={{ justifyContent: 'space-between' }}>
          <img src='/logo.svg' />
          <Typography variant='h1' style={{ fontSize: 26, marginLeft: 10 }}>
            WISH LIST
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
