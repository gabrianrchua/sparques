import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
} from '@mui/material';
import {
  AccountCircle,
  Add,
  Home,
  LoginRounded,
  Menu,
  Search,
} from '@mui/icons-material';
import styles from './App.module.css';
import { useEffect, useState } from 'react';
import Feed from './pages/Feed';
import { BrowserRouter, Link, Route, Routes } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import NewPost from './pages/NewPost';
import CommunityFeed from './pages/CommunityFeed';
import { Community } from '@sparques/types';
import NetworkService from './services/Network';
import Canvas from './pages/Canvas';

const drawerWidth: number = 300;

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);

  useEffect(() => {
    NetworkService.getCommunities().then((result) => {
      setCommunities(result);
      console.log('Get community list', result);
    });
  }, []);

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
          <Link to='/' className={styles.navLink}>
            <ListItemButton>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary='Home' />
            </ListItemButton>
          </Link>
        </ListItem>
        <ListItem key={1} disablePadding>
          <Link to='/login' className={styles.navLink}>
            <ListItemButton>
              <ListItemIcon>
                <LoginRounded />
              </ListItemIcon>
              <ListItemText primary='Log in' />
            </ListItemButton>
          </Link>
        </ListItem>
        <Divider />
        {communities.length > 0 &&
          communities.map((community) => (
            <ListItem key={community.title} disablePadding>
              <Link to={`/c/${community.title}`} className={styles.navLink}>
                <ListItemButton>
                  <ListItemIcon>
                    {community.iconImage ? (
                      <img
                        src={`data:${community.iconImage.mime};base64,${community.iconImage.data}`}
                        style={{ width: '30px', borderRadius: '15px' }}
                        alt={`${community.title} community icon`}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '15px',
                          backgroundColor: '#808080',
                        }}
                      />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={`c/${community.title}`} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
      </List>
    </div>
  );

  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position='fixed'
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            marginLeft: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar sx={{ display: 'flex' }}>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              <IconButton
                size='large'
                edge='start'
                color='inherit'
                aria-label='menu'
                onClick={handleDrawerToggle}
                sx={{ display: { sm: 'none' } }}
              >
                <Menu />
              </IconButton>
              <Link to='/' style={{ height: '42px' }}>
                <img src='/banner.png' alt='Sparques banner' height={42} />
              </Link>
            </Box>
            <Link to='/newpost' style={{ marginRight: '12px' }}>
              <Button startIcon={<Add />} variant='outlined' color='info'>
                Create
              </Button>
            </Link>
            <TextField
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
              variant='outlined'
              sx={{ display: { xs: 'none', sm: 'block' } }}
              size='small'
            />
            <IconButton size='large'>
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          component='nav'
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            variant='temporary'
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant='permanent'
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Routes>
            <Route index element={<Feed />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/post/:postid' element={<PostDetail />} />
            <Route path='/newpost' element={<NewPost />} />
            <Route path='/c/:community' element={<CommunityFeed />} />
            <Route path='/c/:community/canvas' element={<Canvas />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  );
};

export default App;
