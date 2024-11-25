// UI.js - UI Rendering Logic

import Database from "./db.js"; // Import the Database class

class UI {
  constructor() {
    this.itemListElement = document.getElementById("item-list");
    this.addItemFormElement = document.getElementById("add-item-form");
    this.itemNameInput = document.getElementById("item-name");
    this.itemDescriptionInput = document.getElementById("item-description");
    this.imageInput = document.getElementById("item-image");
  }

  // Show the Add Item form
  showAddItemForm() {
    this.addItemFormElement.style.display = "block";
  }

  // Render the list of items
  renderItemList(items) {
    this.itemListElement.innerHTML = ""; // Clear current items

    items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.name} - ${item.description}`;

      // If an image exists, create an image element
      if (item.image) {
        const img = document.createElement("img");
        img.src = item.image; // Image source will be the base64 string
        img.alt = item.name;
        img.width = 50; // Set the image size
        listItem.appendChild(img);
      }

      // Create Delete Button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () =>
        this.deleteItem(item.id, listItem)
      );

      listItem.appendChild(deleteButton);
      this.itemListElement.appendChild(listItem);
    });
  }

  // Delete an item and remove it from the UI
  deleteItem(itemId, listItem) {
    Database.deleteItem(itemId)
      .then(() => {
        this.itemListElement.removeChild(listItem); // Remove item from the UI after deletion
      })
      .catch((error) => console.error("Failed to delete item:", error));
  }

  // Load items and render them
  loadAndRenderItems() {
    Database.getItems()
      .then((items) => {
        this.renderItemList(items);
      })
      .catch((error) => console.error("Failed to load items:", error));
  }
}

export default UI;
