import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import "../../styles/ManageMedicine.css";

function ManageMedicine() {

const [medicines, setMedicines] = useState([]);
const [clinics, setClinics] = useState([]);

const [searchTerm, setSearchTerm] = useState("");
const [selectedClinic, setSelectedClinic] = useState("");

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const [showForm, setShowForm] = useState(false);
const [editingMedicine, setEditingMedicine] = useState(null);

const [showConfirmModal, setShowConfirmModal] = useState(false);
const [confirmAction, setConfirmAction] = useState("");

const [medicineToDelete, setMedicineToDelete] = useState(null);

const [showDuplicateModal, setShowDuplicateModal] = useState(false);

const [duplicateMedicineName, setDuplicateMedicineName] = useState("");

const [formData, setFormData] = useState({
medicineName: "",
quantity: "",
clinic: ""
});

useEffect(() => {
fetchMedicines();
fetchClinics();
}, []);

const fetchMedicines = async () => {


try {

  setLoading(true);
  setError("");

  const response = await axios.get(
    "http://localhost:8080/api/medicines"
  );

  setMedicines(response.data);

} catch (error) {

  console.error("Error loading medicines:", error);

  setError("Unable to load medicine inventory.");

} finally {

  setLoading(false);

}


};

const fetchClinics = async () => {


try {

  const response = await axios.get(
    "http://localhost:8080/api/admin/clinics"
  );

  setClinics(response.data);

} catch (error) {

  console.error("Error loading clinics:", error);

}


};

const handleInputChange = (e) => {


const { name, value } = e.target;

setFormData({
  ...formData,
  [name]: value
});


};

const clearFilters = () => {


setSearchTerm("");
setSelectedClinic("");

};

const openAddForm = () => {


setEditingMedicine(null);

setFormData({
  medicineName: "",
  quantity: "",
  clinic: ""
});

setShowForm(true);


};

const openEditForm = (medicine) => {

setEditingMedicine(medicine);

setFormData({
  medicineName: medicine.medicineName,
  quantity: medicine.quantity,
  clinic: medicine.clinic
});

setShowForm(true);


};

const closeForm = () => {


setShowForm(false);
setEditingMedicine(null);

setFormData({
  medicineName: "",
  quantity: "",
  clinic: ""
});
};

const handleFormSubmit = (e) => {


e.preventDefault();

if (editingMedicine) {

  setConfirmAction("update");
  setShowConfirmModal(true);

} else {

  addMedicine();

}

};

const addMedicine = async () => {


try {

  const medicineData = {
    medicineName: formData.medicineName,
    quantity: Number(formData.quantity),
    clinic: formData.clinic
  };

  await axios.post(
    "http://localhost:8080/api/medicines",
    medicineData
  );

  closeForm();

  setShowConfirmModal(false);

  await fetchMedicines();

} catch (error) {

  console.error("Error adding medicine:", error);

  if (
    error.response?.data ===
    "This medicine already exists in this clinic."
  ) {

    setDuplicateMedicineName(
      formData.medicineName
    );

    setShowDuplicateModal(true);

    return;
  }

  alert(
    error.response?.data ||
    "Unable to add medicine."
  );
}


};

const updateMedicine = async () => {


try {

  const medicineData = {
    medicineName: editingMedicine.medicineName,
    quantity: Number(formData.quantity),
    clinic: formData.clinic
  };

  await axios.put(
    `http://localhost:8080/api/medicines/${editingMedicine.id}`,
    medicineData
  );

  closeForm();

  setShowConfirmModal(false);

  await fetchMedicines();

} catch (error) {

  console.error("Error updating medicine:", error);

  alert(
    error.response?.data ||
    "Unable to update medicine."
  );
}

};

const openDeleteConfirmation = (medicine) => {


setMedicineToDelete(medicine);

setConfirmAction("delete");

setShowConfirmModal(true);


};

const deleteMedicine = async () => {


if (!medicineToDelete) {
  return;
}

try {

  await axios.delete(
    `http://localhost:8080/api/medicines/${medicineToDelete.id}`
  );

  setShowConfirmModal(false);

  setMedicineToDelete(null);

  await fetchMedicines();

} catch (error) {

  console.error("Error deleting medicine:", error);

  alert("Unable to remove medicine.");
}

};

const handleConfirm = () => {

if (confirmAction === "update") {

  updateMedicine();

  return;
}

if (confirmAction === "delete") {

  deleteMedicine();
}
};

const handleCancelConfirmation = () => {

setShowConfirmModal(false);

setConfirmAction("");

setMedicineToDelete(null);

};

const closeDuplicateModal = () => {

setShowDuplicateModal(false);

setDuplicateMedicineName("");

};

const getStatusClass = (status) => {

if (status === "AVAILABLE") {
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

const filteredMedicines = medicines.filter((medicine) => {


const matchesSearch =
  medicine.medicineName
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase());

const matchesClinic =
  selectedClinic === "" ||
  medicine.clinic === selectedClinic;

return matchesSearch && matchesClinic;


});

return ( <div className="manage-medicine-page">


  <AdminSidebar />


  <main className="manage-medicine-content">

    <div className="manage-medicine-header">

      <div>

        <h1>
          Medicine Inventory
        </h1>

        <p>
          Manage medicine stock across all clinics.
        </p>

      </div>


      <button
        type="button"
        className="manage-medicine-add-button"
        onClick={openAddForm}
      >
        + Add Medicine
      </button>

    </div>


    {/* Search and Filters */}

    <div className="manage-medicine-filters">

      <div className="manage-medicine-search">

        <label htmlFor="medicineSearch">
          Search Medicine
        </label>

        <input
          id="medicineSearch"
          type="text"
          placeholder="Search by medicine name..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

      </div>


      <div className="manage-medicine-clinic-filter">

        <label htmlFor="clinicFilter">
          Filter by Clinic
        </label>

        <select
          id="clinicFilter"
          value={selectedClinic}
          onChange={(e) =>
            setSelectedClinic(e.target.value)
          }
        >

          <option value="">
            All Clinics
          </option>

          {clinics.map((clinic) => (

            <option
              key={clinic.id}
              value={clinic.clinicName}
            >
              {clinic.clinicName}
            </option>

          ))}

        </select>

      </div>


      <button
        type="button"
        className="manage-medicine-clear-button"
        onClick={clearFilters}
      >
        Clear Filters
      </button>

    </div>


    {loading && (
      <div className="manage-medicine-message">
        Loading medicine inventory...
      </div>
    )}


    {error && (
      <div className="manage-medicine-error">
        {error}
      </div>
    )}


    {!loading &&
      !error &&
      filteredMedicines.length === 0 && (

        <div className="manage-medicine-empty">

          {searchTerm || selectedClinic
            ? "No medicine matches the selected filters."
            : "No medicine has been added yet."}

        </div>
      )}


    {!loading &&
      !error &&
      filteredMedicines.length > 0 && (

        <div className="manage-medicine-table-container">

          <table className="manage-medicine-table">

            <thead>

              <tr>

                <th>Medicine</th>
                <th>Quantity</th>
                <th>Clinic</th>
                <th>Status</th>
                <th>Actions</th>

              </tr>

            </thead>


            <tbody>

              {filteredMedicines.map((medicine) => (

                <tr key={medicine.id}>

                  <td>
                    {medicine.medicineName}
                  </td>

                  <td>
                    {medicine.quantity}
                  </td>

                  <td>
                    {medicine.clinic}
                  </td>

                  <td>

                    <span
                      className={getStatusClass(
                        medicine.status
                      )}
                    >
                      {medicine.status?.replace(
                        "_",
                        " "
                      )}
                    </span>

                  </td>


                  <td>

                    <div className="manage-medicine-actions">

                      <button
                        type="button"
                        className="manage-medicine-edit-button"
                        onClick={() =>
                          openEditForm(medicine)
                        }
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        className="manage-medicine-delete-button"
                        onClick={() =>
                          openDeleteConfirmation(
                            medicine
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      )}

  </main>


  {/* Add / Edit Modal */}

  {showForm && (

    <div className="manage-medicine-modal-overlay">

      <div className="manage-medicine-modal">

        <div className="manage-medicine-modal-header">

          <div>

            <h2>
              {editingMedicine
                ? "Update Medicine"
                : "Add Medicine"}
            </h2>

            <p>
              {editingMedicine
                ? "Update the medicine stock information."
                : "Enter the medicine stock information."}
            </p>

          </div>


          <button
            type="button"
            className="manage-medicine-modal-close"
            onClick={closeForm}
          >
            ×
          </button>

        </div>


        <form
          className="manage-medicine-form"
          onSubmit={handleFormSubmit}
        >

          <div className="manage-medicine-form-group">

            <label htmlFor="medicineName">
              Medicine Name
            </label>

            <input
              id="medicineName"
              name="medicineName"
              type="text"
              value={formData.medicineName}
              onChange={handleInputChange}
              placeholder="Enter medicine name"
              required
              readOnly={!!editingMedicine}
            />

          </div>


          <div className="manage-medicine-form-group">

            <label htmlFor="quantity">
              Quantity
            </label>

            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              required
            />

          </div>


          <div className="manage-medicine-form-group">

            <label htmlFor="clinic">
              Clinic
            </label>

            <select
              id="clinic"
              name="clinic"
              value={formData.clinic}
              onChange={handleInputChange}
              required
            >

              <option value="">
                Select clinic
              </option>

              {clinics.map((clinic) => (

                <option
                  key={clinic.id}
                  value={clinic.clinicName}
                >
                  {clinic.clinicName}
                </option>

              ))}

            </select>

          </div>


          <div className="manage-medicine-form-actions">

            <button
              type="button"
              className="manage-medicine-cancel-button"
              onClick={closeForm}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="manage-medicine-save-button"
            >
              {editingMedicine
                ? "Update"
                : "Add Medicine"}
            </button>

          </div>

        </form>

      </div>

    </div>
  )}


  {/* Update / Delete Confirmation Modal */}

  {showConfirmModal && (

    <div className="manage-medicine-modal-overlay">

      <div className="manage-medicine-confirm-modal">

        <div className="manage-medicine-confirm-icon">
          ?
        </div>


        <h2>

          {confirmAction === "delete"
            ? "Confirm Delete"
            : "Confirm Update"}

        </h2>


        <p>

          {confirmAction === "delete"
            ? `Are you sure you want to delete ${medicineToDelete?.medicineName}?`
            : "Are you sure you want to update this medicine?"}

        </p>


        <div className="manage-medicine-confirm-actions">

          <button
            type="button"
            className="manage-medicine-confirm-cancel"
            onClick={handleCancelConfirmation}
          >
            Cancel
          </button>


          <button
            type="button"
            className="manage-medicine-confirm-ok"
            onClick={handleConfirm}
          >
            Okay
          </button>

        </div>

      </div>

    </div>
  )}


  {/* Duplicate Medicine Modal */}

  {showDuplicateModal && (

    <div className="manage-medicine-modal-overlay">

      <div className="manage-medicine-duplicate-modal">

        <div className="manage-medicine-duplicate-icon">
          !
        </div>


        <h2>
          Medicine Already Exists
        </h2>


        <p>
          <strong>
            {duplicateMedicineName}
          </strong>{" "}
          already exists in the selected clinic.
        </p>


        <p>
          Please search for the existing medicine
          and update its quantity instead.
        </p>


        <button
          type="button"
          className="manage-medicine-duplicate-ok"
          onClick={closeDuplicateModal}
        >
          Okay
        </button>

      </div>

    </div>
  )}

</div>


);
}

export default ManageMedicine;
