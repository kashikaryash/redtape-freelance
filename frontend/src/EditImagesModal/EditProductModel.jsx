import React, { useState, useEffect } from "react";

const EditProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    modelNo: "",
    name: "",
    category: "",
    subCategory: "",
    price: "",
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    img5: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        modelNo: product.modelNo || "",
        name: product.name || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        price: product.price || "",
        img1: product.img1 || "",
        img2: product.img2 || "",
        img3: product.img3 || "",
        img4: product.img4 || "",
        img5: product.img5 || "",
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || "" : value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Product Model No: {formData.modelNo}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Model No</label>
                <input
                  type="text"
                  className="form-control"
                  name="modelNo"
                  value={formData.modelNo}
                  disabled
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  <option value="MEN">Men</option>
                  <option value="WOMEN">Women</option>
                  <option value="KIDS">Kids</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">SubCategory</label>
                <select
                  className="form-select"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                >
                  <option value="">Select SubCategory</option>
                  <option value="BOOTS">Boots</option>
                  <option value="CASUAL">Casual</option>
                  <option value="FORMALSHOES">Formal Shoes</option>
                  <option value="SLIDERS">Sliders</option>
                  <option value="SPORTSSHOES">Sports Shoes</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              {[1, 2, 3, 4, 5].map((num) => (
                <div className="col-md-6" key={num}>
                  <label className="form-label">Image {num} URL</label>
                  <input
                    type="text"
                    className="form-control"
                    name={`img${num}`}
                    value={formData[`img${num}`]}
                    onChange={handleChange}
                    placeholder={`Enter Image ${num} URL`}
                  />
                  {formData[`img${num}`] && (
                    <img
                      src={formData[`img${num}`]}
                      alt={`Preview ${num}`}
                      style={{ maxWidth: "100%", maxHeight: "120px", marginTop: "5px" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
