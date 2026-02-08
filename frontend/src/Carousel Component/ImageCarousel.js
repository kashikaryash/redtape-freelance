import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./ImageCarousel.module.css";

const carouselImages = [
  {
    src: "https://redtape.com/cdn/shop/files/1600x900_1700x.jpg?v=1743666355",
    alt: "Slide 1",
  },
  {
    src: "https://redtape.com/cdn/shop/files/APPAREL-1600x900_1700x_7bde42c0-69fb-460c-a0ea-0474f204dec5_1700x.webp?v=1741691113",
    alt: "Slide 2",
  },
  {
    src: "https://redtape.com/cdn/shop/files/PERFUME.CAP-1600x900_1700x_9b1fc2b3-fdfc-4e3d-81e4-458cb5e16808_1700x.webp?v=1741691256",
    alt: "Slide 3",
  },
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    position: "absolute",
  }),
  center: {
    x: 0,
    opacity: 1,
    position: "absolute",
  },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    position: "absolute",
  }),
};

const ImageCarousel = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const imageIndex = ((page % carouselImages.length) + carouselImages.length) % carouselImages.length;

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPage(([prevPage]) => [prevPage + 1, 1]);
      setIsFirstRender(false); // Disable first render flag after first interval
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setPage(([prev]) => [prev + 1, 1]);
    setIsFirstRender(false);
  };

  const handlePrev = () => {
    setPage(([prev]) => [prev - 1, -1]);
    setIsFirstRender(false);
  };

  return (
    <div className={styles.carouselContainer}>
      <AnimatePresence initial={false} custom={direction} mode="sync">
        {isFirstRender && page === 0 ? (
          <motion.img
            key="first-load"
            src={carouselImages[0].src}
            alt={carouselImages[0].alt}
            className={styles.carouselImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            draggable={false}
          />
        ) : (
          <motion.img
            key={page}
            src={carouselImages[imageIndex].src}
            alt={carouselImages[imageIndex].alt}
            className={styles.carouselImage}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 80, damping: 30 },
              opacity: { duration: 0.4 },
            }}
            draggable={false}
          />
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        aria-label="Previous Slide"
        className={`${styles.control} ${styles.prev}`}
        onClick={handlePrev}
      >
        ‹
      </button>
      <button
        aria-label="Next Slide"
        className={`${styles.control} ${styles.next}`}
        onClick={handleNext}
      >
        ›
      </button>
    </div>
  );
};

export default ImageCarousel;
