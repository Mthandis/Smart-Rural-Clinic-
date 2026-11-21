
import { useEffect, useState } from "react";
import axios from "axios";
import WorkerNavbar from "../../components/WorkerNavbar";
import "../../styles/MedicineInventory.css";

function MedicineInventory() {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const clinicName = user?.clinic?.clinicName;

  useEffect(() => {
    if (clinicName) {
      fetchMedicines();
    } else {
      setError("Your clinic information could not be found.");
      setLoading(false);
    }
  }, [clinicName]);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:8080/api/medicines/clinic/${encodeURIComponent(
          clinicName
        )}`
      );

      setMedicines(response.data);
    } catch (error) {
      console.error("Error loading medicine inventory:", error);
      setError("Unable to load medicine inventory.");
    } finally {
      setLoading(false);
    }
  };

  // MEDICINE COUNTS
  const totalMedicines = medicines.length;

  const lowStockMedicines = medicines.filter(
    (medicine) => medicine.status === "LOW_STOCK"
  );

  const outOfStockMedicines = medicines.filter(
    (medicine) => Number(medicine.quantity) <= 0
  );

  // Available includes both AVAILABLE and LOW_STOCK medicines
  const availableMedicines = medicines.filter(
    (medicine) => Number(medicine.quantity) > 0
  );

  const availableCount = availableMedicines.length;

  // SUMMARY CARDS
  const summaryCards = [
    {
      title: "Total Medicines",
      count: totalMedicines,
      description: "Registered at this clinic",
      category: "ALL",
      className: "total",
    },
    {
      title: "Low Stock",
      count: lowStockMedicines.length,
      description: "Need restocking soon",
      category: "LOW_STOCK",
      className: "low",
    },
    {
      title: "Out of Stock",
      count: outOfStockMedicines.length,
      description: "Currently unavailable",
      category: "OUT_OF_STOCK",
      className: "out",
    },
    {
      title: "Available",
      count: availableCount,
      description: "Medicines with stock remaining",
      category: "AVAILABLE",
      className: "available",
    },
  ];

  // MEDICINES DISPLAYED IN CATEGORY MODAL
  const getCategoryMedicines = () => {
    let result = medicines;

    if (selectedCategory === "LOW_STOCK") {
      result = result.filter(
        (medicine) => medicine.status === "LOW_STOCK"
      );
    } else if (selectedCategory === "OUT_OF_STOCK") {
      result = result.filter(
        (medicine) => Number(medicine.quantity) <= 0
      );
    } else if (selectedCategory === "AVAILABLE") {
      result = result.filter(
        (medicine) => Number(medicine.quantity) > 0
      );
    }

    return result.filter((medicine) =>
      medicine.medicineName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  };

  // MAIN TABLE SEARCH
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.medicineName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // MEDICINE STATUS
  const getStatusClass = (status) => {
    if (status === "HIGH_STOCK") {
      return "medicine-status available";
    }

    if (status === "LOW_STOCK") {
      return "medicine-status low";
    }

    if (status === "OUT_OF_STOCK") {
      return "medicine-status out";
    }

    return "medicine-status";
  };

  const getStatusLabel = (status) => {
    return status?.replaceAll("_", " ") || "UNKNOWN";
  };

  const closeModal = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="medicine-inventory-page">

      <WorkerNavbar />

      <main className="medicine-inventory-content">

        {/* PAGE HEADER */}
        <div className="medicine-inventory-header">
          <div>
            <h1>Medicine Inventory</h1>
            <p>
              View medicine availability and stock levels at your clinic.
            </p>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        {!loading && !error && (
          <div className="medicine-summary-grid">

            {summaryCards.map((card) => (
              <button
                type="button"
                key={card.category}
                className={`medicine-summary-card ${card.className}`}
                onClick={() => setSelectedCategory(card.category)}
              >
                <span className="medicine-summary-title">
                  {card.title}
                </span>

                <strong className="medicine-summary-count">
                  {card.count}
                </strong>

                <span className="medicine-summary-description">
                  {card.description}
                </span>

                <span className="medicine-summary-link">
                  View medicines →
                </span>
              </button>
            ))}

          </div>
        )}

        {/* SEARCH */}
        <div className="medicine-inventory-search">

          <label htmlFor="medicineSearch">
            Search Medicine
          </label>

          <input
            id="medicineSearch"
            type="text"
            placeholder="Search by medicine name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

        {/* LOADING */}
        {loading && (
          <div className="medicine-inventory-message">
            Loading medicine inventory...
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="medicine-inventory-error">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          !error &&
          filteredMedicines.length === 0 && (
            <div className="medicine-inventory-empty">
              {searchTerm
                ? "No medicine matches your search."
                : "No medicine is currently available at this clinic."}
            </div>
          )}

        {/* MAIN MEDICINE TABLE */}
        {!loading &&
          !error &&
          filteredMedicines.length > 0 && (
            <div className="medicine-inventory-table-container">

              <table className="medicine-inventory-table">

                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Quantity</th>
                    <th>Clinic</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMedicines.map((medicine) => (
                    <tr key={medicine.id}>

                      <td>{medicine.medicineName}</td>

                      <td>{medicine.quantity}</td>

                      <td>{medicine.clinic}</td>

                      <td>
                        <span className={getStatusClass(medicine.status)}>
                          {getStatusLabel(medicine.status)}
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

      </main>

      {/* CATEGORY MODAL */}
      {selectedCategory && (
        <div
          className="medicine-modal-overlay"
          onClick={closeModal}
        >

          <div
            className="medicine-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* MODAL HEADER */}
            <div className="medicine-modal-header">

              <div>
                <h2>
                  {selectedCategory === "ALL"
                    ? "All Medicines"
                    : selectedCategory === "LOW_STOCK"
                    ? "Low Stock Medicines"
                    : selectedCategory === "OUT_OF_STOCK"
                    ? "Out of Stock Medicines"
                    : "Available Medicines"}
                </h2>

                <p>
                  Medicines registered at {clinicName}.
                </p>
              </div>

              <button
                type="button"
                className="medicine-modal-close"
                onClick={closeModal}
                aria-label="Close modal"
              >
                &times;
              </button>

            </div>

            {/* MEDICINE COUNT */}
            <div className="medicine-modal-count">
              {getCategoryMedicines().length} medicines found
            </div>

            {/* MODAL TABLE */}
            <div className="medicine-modal-table-container">

              {getCategoryMedicines().length === 0 ? (
                <div className="medicine-inventory-empty">
                  No medicines found in this category.
                </div>
              ) : (

                <table className="medicine-inventory-table">

                  <thead>
                    <tr>
                      <th>Medicine</th>
                      <th>Quantity</th>
                      <th>Clinic</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {getCategoryMedicines().map((medicine) => (
                      <tr key={medicine.id}>

                        <td>{medicine.medicineName}</td>

                        <td>{medicine.quantity}</td>

                        <td>{medicine.clinic}</td>

                        <td>
                          <span className={getStatusClass(medicine.status)}>
                            {getStatusLabel(medicine.status)}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              )}

            </div>

            {/* MODAL FOOTER */}
            <div className="medicine-modal-footer">

              <button
                type="button"
                onClick={closeModal}
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default MedicineInventory;
