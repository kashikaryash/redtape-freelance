import React, { useEffect, useState } from "react";

const ProductImageGallery = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImg(images[0]);
    }
  }, [images]);

  const openModal = (img) => {
    setSelectedImg(img);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImg(null);
  };

  if (!images || images.length === 0) return <p>No images available</p>;

  return (
    <>
      {/* Thumbnails outside modal */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Thumbnail ${idx + 1}`}
            style={{ width: 60, height: 60, cursor: "pointer", objectFit: "cover", borderRadius: 4 }}
            onClick={() => openModal(img)}
          />
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          onClick={closeModal}
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: 20,
              display: "flex",
              maxWidth: "80vw",
              maxHeight: "80vh",
              borderRadius: 8,
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            }}
          >
            {/* Left thumbnails in modal */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                overflowY: "auto",
                maxHeight: "100%",
                marginRight: 20,
                width: 80,
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
            >
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Modal thumb ${idx + 1}`}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    cursor: "pointer",
                    border: img === selectedImg ? "3px solid #007bff" : "1px solid #ccc",
                    borderRadius: 3,
                  }}
                  onClick={() => setSelectedImg(img)}
                />
              ))}
            </div>

            {/* Full size selected image */}
            <div
              style={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxHeight: "100%",
              }}
            >
              <img
                src={selectedImg}
                alt="Selected"
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductImageGallery;
