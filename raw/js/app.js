// app.js - Main Application Logic

import Database from "./db.js"; // Import the Database class
import UI from "./ui.js";

const ui = new UI(); // Create an instance of the UI class

class App {
  constructor() {
    // Initialize event listeners and load items
    this.initializeEventListeners();
    this.loadAndRenderItems();
  }

  // Load items from IndexedDB and render them
  loadAndRenderItems() {
    Database.getItems() // Call the static method from Database class
      .then((items) => {
        ui.renderItemList(items); // Use UI instance to render the items
      })
      .catch((error) => console.error("Failed to load items:", error));
  }

  // Show the add item form
  showAddItemForm() {
    ui.showAddItemForm(); // Use UI instance to show the add item form
  }

  // Add item to the database and reload the list
  addItem(event) {
    event.preventDefault();

    const itemName = document.getElementById("item-name").value;
    const itemDescription = document.getElementById("item-description").value;
    const imageFile = document.getElementById("item-image").files[0];

    // Convert image to Base64 if there's an image file
    let imageBase64 = null;
    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        imageBase64 = reader.result; // The base64 image data

        const newItem = {
          name: itemName,
          description: itemDescription,
          image: imageBase64,
        };

        Database.addItem(newItem) // Call the static method from Database class
          .then(() => {
            this.loadAndRenderItems(); // Reload the list after adding
            this.clearForm();
          })
          .catch((error) => console.error("Failed to add item:", error));
      };
    } else {
      // No image selected, create the item without an image
      const newItem = { name: itemName, description: itemDescription };
      Database.addItem(newItem)
        .then(() => {
          this.loadAndRenderItems(); // Reload the list after adding
          this.clearForm();
        })
        .catch((error) => console.error("Failed to add item:", error));
    }
  }

  // Clear the input form
  clearForm() {
    document.getElementById("item-name").value = "";
    document.getElementById("item-description").value = "";
    document.getElementById("item-image").value = ""; // Clear the image input
  }

  // Initialize event listeners
  initializeEventListeners() {
    document
      .getElementById("add-item-btn")
      .addEventListener("click", () => this.showAddItemForm());
    document
      .getElementById("save-item-btn")
      .addEventListener("click", (event) => this.addItem(event));
  }
}

// Instantiate the App class to initialize the application
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
