const DB_NAME = "SaikiaCodes_2024";
const DB_VERSION = 1;
const STORE_NAME = "items";

// Open the IndexedDB database
function openDatabase() {
  const deferred = $.Deferred();
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });
    }
  };

  request.onsuccess = function (event) {
    deferred.resolve(event.target.result);
  };

  request.onerror = function () {
    deferred.reject("Database failed to open");
  };

  return deferred.promise();
}

// Add an item to the database
function addItem(item) {
  const deferred = $.Deferred();

  openDatabase()
    .done(function (db) {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.add(item);

      tx.oncomplete = function () {
        deferred.resolve("Item added successfully");
      };

      tx.onerror = function () {
        deferred.reject("Failed to add item");
      };
    })
    .fail(function (error) {
      deferred.reject("Failed to add item: " + error);
    });

  return deferred.promise();
}

// Get all items from the database
function getItems() {
  const deferred = $.Deferred();

  openDatabase()
    .done(function (db) {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = function () {
        deferred.resolve(request.result || []);
      };

      request.onerror = function () {
        deferred.reject("Failed to retrieve items");
      };
    })
    .fail(function (error) {
      deferred.reject("Failed to retrieve items: " + error);
    });

  return deferred.promise();
}

// Delete an item from the database
function deleteItem(id) {
  const deferred = $.Deferred();

  openDatabase()
    .done(function (db) {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = function () {
        deferred.resolve("Item deleted successfully");
      };

      request.onerror = function () {
        deferred.reject("Failed to delete item");
      };
    })
    .fail(function (error) {
      deferred.reject("Failed to delete item: " + error);
    });

  return deferred.promise();
}

// Function to update cart count
function updateCartCount() {
  getItems()
    .done(function (cartItems) {
      const cartCount = cartItems.length; // Get the number of items in the cart
      $("#cart-count").text(cartCount); // Update the cart count display
    })
    .fail(function (error) {
      console.error("Failed to update cart count", error);
    });
}

$(document).ready(function () {
  updateCartCount();
});
