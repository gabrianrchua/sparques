import { AppBar, Box, Divider, Drawer, IconButton, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField, Toolbar } from '@mui/material';
import { AccountCircle, Home, LoginRounded, Menu, Search } from '@mui/icons-material';
import styles from './App.module.css';
import { useState } from 'react';
import Feed from './pages/Feed';
import { BrowserRouter, Link, Route, Routes } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';

const drawerWidth: number = 300;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem key={0} disablePadding>
          <Link to="/" className={styles.navLink}>
            <ListItemButton>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem key={1} disablePadding>
          <Link to="/login" className={styles.navLink}>
            <ListItemButton>
              <ListItemIcon>
                <LoginRounded />
              </ListItemIcon>
              <ListItemText primary="Log in" />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
    </div>
  );

  return (
    <BrowserRouter>
    
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            marginLeft: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar sx={{ display: "flex" }}>
            <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ display: { sm: 'none' } }}
              >
                <Menu />
              </IconButton>
              <img src="/banner.png" alt="Sparques banner" height={42} />
            </Box>
            <TextField
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
              variant="outlined"
              sx={{ display: { xs: "none", sm: "block" } }}
            />
            <IconButton size="large">
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />
          <Routes>
            <Route index element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;