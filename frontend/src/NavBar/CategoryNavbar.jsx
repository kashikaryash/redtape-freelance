import React, { useState } from "react";
import { FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from '../NavBar/CategoryNavbar.module.css';
import { Link } from "react-router-dom";
import AnimatedCartCounter from "../components/AnimatedCartCounter";

const CategoryNavbar = () => {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const renderMenu = (category) => {
    switch (category) {
      case "MEN":
        return (
          <>
            <div className={styles.menuCol}>
              <div className={styles.menuTitle}>FOOT WEAR</div>
              <ul className="list-unstyled">
                <li><Link to="cat/MEN/BOOTS" className="list-unstyled text-decoration-none text-dark">Boots</Link></li>
                <li><Link to="cat/MEN/Casual" className="list-unstyled text-decoration-none text-dark">Casual</Link></li>
                <li><Link to="cat/MEN/Formal Shoes" className="list-unstyled text-decoration-none text-dark">Formal Shoes</Link></li>
                <li><Link to="cat/MEN/Sliders" className="list-unstyled text-decoration-none text-dark">Sliders</Link></li>
                <li><Link to="cat/MEN/Sports Shoes" className="list-unstyled text-decoration-none text-dark">Sports Shoes</Link></li>
              </ul>
            </div>
            {/* Add top wear and bottom wear if needed */}
          </>
        );
      case "Women":
        return (
          <>
            <div className={styles.menuCol}>
              <div className={styles.menuTitle}>FOOT WEAR</div>
              <ul className="list-unstyled">
                <li><Link to="cat/WOMEN/BOOTS" >Boots</Link></li>
                <li><Link to="cat/WOMEN/Heels">Heels</Link></li>
                <li><Link to="cat/WOMEN/SLIDERS">Sliders</Link></li>
                <li><Link to="cat/WOMEN/SPORTSSHOES">Sports Shoes</Link></li>
              </ul>
            </div>
            {/* Add top wear and bottom wear if needed */}
          </>
        );
      case "Kids":
        return (
          <>
            <div className={styles.menuCol}>
              <div className={styles.menuTitle}>BOYS</div>
              <ul className="list-unstyled">
                <li>T-Shirts</li>
              </ul>
            </div>
            <div className={styles.menuCol}>
              <div className={styles.menuTitle}>GIRLS</div>
              <ul className="list-unstyled">
                <li>T-Shirts</li>
                <li>Trackpant/Joggers</li>
              </ul>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className={`navbar navbar-expand ${styles.navbar}`}>
      <div className="container-fluid justify-content-between">
        <div className="d-flex justify-content-center w-100 gap-5">
          {["MEN", "WOMEN", "KIDS"].map((category) => (
            <div
              key={category}
              className={styles.navItem}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <span className="text-dark d-flex align-items-center gap-1">
                {category}
                {hoveredCategory === category ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
              </span>
              {hoveredCategory === category && (
                <div className={styles.megaMenu}>
                  <div className="d-flex gap-5 flex-wrap">
                    {renderMenu(category)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="d-flex align-items-center gap-4">
          <FaSearch size={20} className="cursor-pointer" />
          <AnimatedCartCounter className={styles.cartIcon} />
        </div>
      </div>
    </nav>
  );
};

export default CategoryNavbar;
