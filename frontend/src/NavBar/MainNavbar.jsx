import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from '../NavBar/CategoryNavbar.module.css';
import { Link, useNavigate } from "react-router-dom";
import AnimatedCartCounter from "../components/AnimatedCartCounter";
import SearchDropdown from "../components/SearchDropdown";
import DirectionsRun from '@mui/icons-material/DirectionsRun';
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Badge
} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useWishlist } from "../context/WishlistContext";

const MainNavbar = ({ textColor: propTextColor }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  // Wishlist context might not exist yet, handle gracefully if needed.
  // Assuming useWishlist exists or we mock it. Using local state if not found?
  // Ideally we should have a context. I'll assume standard styling for now.
  const navigate = useNavigate();

  // Enforce Navy Blue theme elements
  const NAVY_BLUE = '#1a1a2e';
  const TEXT_WHITE = '#ffffff';

  // Account Menu State
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSignOut = () => {
    logout();
    setAnchorEl(null);
    navigate("/login", { replace: true });
  };

  const handleAccountClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAnchorEl(null);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (user?.roles?.includes("ROLE_ADMIN")) {
      navigate("/adminHome");
    } else if (user?.roles?.includes("ROLE_MODERATOR")) {
      navigate("/moderatorHome");
    } else {
      navigate("/");
    }
  };

  const renderMenu = (category) => {
    // Menu styles to match Navy Blue
    const menuColStyle = { minWidth: '180px' };
    const linkStyle = { textDecoration: 'none', color: NAVY_BLUE, display: 'block', marginBottom: '4px' };
    const titleStyle = { fontWeight: 'bold', marginBottom: '8px', color: '#e63946' };

    switch (category) {
      case "Men":
        return (
          <>
            <div style={menuColStyle}>
              <div style={titleStyle}>FOOT WEAR</div>
              <ul className="list-unstyled">
                <li><Link to="/cat/MEN/BOOTS" style={linkStyle}>Boots</Link></li>
                <li><Link to="/cat/MEN/CASUAL" style={linkStyle}>Casual</Link></li>
                <li><Link to="/cat/MEN/FORMALSHOES" style={linkStyle}>Formal Shoes</Link></li>
                <li><Link to="/cat/MEN/SLIDERS" style={linkStyle}>Sliders</Link></li>
                <li><Link to="/cat/MEN/SPORTSSHOES" style={linkStyle}>Sports Shoes</Link></li>
              </ul>
            </div>
            <div style={menuColStyle}>
              <div style={titleStyle}>TOP WEAR</div>
              <ul className="list-unstyled">
                <li><Link to="/cat/MEN/JACKETS" style={linkStyle}>Jackets</Link></li>
                <li><Link to="/cat/MEN/SHIRTS" style={linkStyle}>Shirts</Link></li>
                <li><Link to="/cat/MEN/SWEATSHIRTS" style={linkStyle}>Sweatshirts/Hoodies</Link></li>
                <li><Link to="/cat/MEN/TSHIRTS" style={linkStyle}>T-shirts</Link></li>
              </ul>
            </div>
            <div style={menuColStyle}>
              <div style={titleStyle}>BOTTOM WEAR</div>
              <ul className="list-unstyled">
                <li><Link to="/cat/MEN/JEANS" style={linkStyle}>Jeans</Link></li>
                <li><Link to="/cat/MEN/TROUSERS" style={linkStyle}>Trousers</Link></li>
                <li><Link to="/cat/MEN/SHORTS" style={linkStyle}>Shorts</Link></li>
              </ul>
            </div>
          </>
        );
      case "Women":
        return (
          <>
            <div style={menuColStyle}>
              <div style={titleStyle}>FOOT WEAR</div>
              <ul className="list-unstyled">
                <li><Link to="/cat/WOMEN/CASUAL" style={linkStyle}>Casual Shoes</Link></li>
                <li><Link to="/cat/WOMEN/SLIDERS" style={linkStyle}>Sliders/Flip Flops</Link></li>
                <li><Link to="/cat/WOMEN/SPORTSSHOES" style={linkStyle}>Sports Shoes</Link></li>
              </ul>
            </div>
            <div style={menuColStyle}>
              <div style={titleStyle}>TOP WEAR</div>
              <ul className="list-unstyled">
                <li><Link to="/cat/WOMEN/JACKETS" style={linkStyle}>Jackets</Link></li>
                <li><Link to="/cat/WOMEN/TOPS" style={linkStyle}>Tops/T-Shirts</Link></li>
                <li><Link to="/cat/WOMEN/DRESSES" style={linkStyle}>Dresses</Link></li>
              </ul>
            </div>
          </>
        );
      case "Kids":
        return (
          <>
            <div style={menuColStyle}>
              <div style={titleStyle}>BOYS</div>
              <ul className="list-unstyled">
                <li><Link to="/cat/KIDS/CASUAL" style={linkStyle}>Casual</Link></li>
                <li><Link to="/cat/KIDS/SPORTSSHOES" style={linkStyle}>Sports Shoes</Link></li>
              </ul>
            </div>
            <div style={menuColStyle}>
              <div style={titleStyle}>GIRLS</div>
              <ul className="list-unstyled">
                <li><Link to="/cat/KIDS/GIRLS_CASUAL" style={linkStyle}>Casual Shoes</Link></li>
                <li><Link to="/cat/KIDS/GIRLS_SCHOOL" style={linkStyle}>School Shoes</Link></li>
              </ul>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className={`navbar navbar-expand`} style={{ backgroundColor: NAVY_BLUE, padding: '0.5rem 1rem', transition: 'all 0.3s ease' }}>
      <div className="container-fluid justify-content-between align-items-center">

        {/* Logo */}
        <a
          className="navbar-brand d-flex align-items-center text-decoration-none me-4"
          href="/"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer', color: TEXT_WHITE }}
        >
          <DirectionsRun sx={{ fontSize: 32, color: '#e63946', mr: 1 }} />
          <span style={{ fontWeight: 800, letterSpacing: '2px', fontSize: '1.25rem', color: TEXT_WHITE }}>
            SnapCart
          </span>
        </a>

        {/* Category Navigation */}
        <div className="d-none d-lg-flex justify-content-center flex-grow-1 gap-5">
          {["Men", "Women", "Kids"].map((category) => (
            <div
              key={category}
              className={styles.navItem}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <span className="d-flex align-items-center gap-1" style={{ cursor: 'pointer', fontWeight: 500, color: TEXT_WHITE }}>
                {category}
                {hoveredCategory === category ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </span>

              {hoveredCategory === category && (
                <div className={styles.megaMenu} style={{ background: 'white', borderTop: '4px solid #e63946', borderRadius: '0 0 8px 8px' }}>
                  <div className="d-flex gap-5 flex-wrap">
                    {renderMenu(category)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Icons */}
        <div className="d-flex align-items-center gap-3">
          {/* Search */}
          <Box sx={{ width: 220, color: TEXT_WHITE, display: { xs: 'none', md: 'block' } }}>
            <SearchDropdown />
          </Box>

          {/* Theme Toggle */}
          <IconButton onClick={toggleTheme} sx={{ color: TEXT_WHITE }}>
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {/* Wishlist */}
          <IconButton onClick={() => navigate('/wishlist')} sx={{ color: TEXT_WHITE }}>
            <Badge badgeContent={0} color="error">
              <FavoriteBorderIcon />
            </Badge>
          </IconButton>

          {/* Cart */}
          <Box sx={{ color: TEXT_WHITE, cursor: 'pointer' }} onClick={() => navigate('/cart')}>
            <AnimatedCartCounter className={styles.cartIcon} />
          </Box>

          {/* Account Menu */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {user ? (
              <>
                <Button
                  id="account-button"
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleAccountClick}
                  variant="text"
                  endIcon={<KeyboardArrowDownIcon sx={{ color: TEXT_WHITE }} />}
                  sx={{ textTransform: 'none', fontWeight: 600, color: TEXT_WHITE, minWidth: 'auto', px: 1 }}
                >
                  {user.name?.split(' ')[0] || 'Account'}
                </Button>
                <Menu
                  id="account-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleAccountClose}
                  MenuListProps={{ 'aria-labelledby': 'account-button' }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  PaperProps={{
                    sx: {
                      bgcolor: isDarkMode ? '#1a1a2e' : 'white',
                      color: isDarkMode ? 'white' : 'black',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  {(user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ROLE_MODERATOR')) && (
                    <MenuItem onClick={() => { handleAccountClose(); navigate(user.roles.includes('ROLE_ADMIN') ? '/adminHome' : '/moderatorHome'); }}>
                      Dashboard
                    </MenuItem>
                  )}
                  <MenuItem component={Link} to={user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ROLE_MODERATOR') ? "/admin/profile" : "/my-profile"} onClick={handleAccountClose}>
                    My Profile
                  </MenuItem>
                  <MenuItem component={Link} to="/my-orders" onClick={handleAccountClose}>
                    My Orders
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  id="account-button-logged-out"
                  onClick={handleAccountClick}
                  variant="outlined"
                  startIcon={<AccountCircleIcon sx={{ color: TEXT_WHITE }} />}
                  sx={{
                    borderRadius: 20,
                    textTransform: 'none',
                    px: 2,
                    color: TEXT_WHITE,
                    borderColor: TEXT_WHITE,
                    '&:hover': { borderColor: TEXT_WHITE, bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                  size="small"
                >
                  Login
                </Button>
                <Menu
                  id="account-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleAccountClose}
                  MenuListProps={{
                    'aria-labelledby': 'account-button-logged-out',
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem component={Link} to="/login" onClick={handleAccountClose}>
                    Login
                  </MenuItem>
                  <MenuItem component={Link} to="/signup" onClick={handleAccountClose}>
                    Sign Up
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;
