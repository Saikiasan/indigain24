$(document).ready(function () {
  // Function to display cart items
  // Function to display cart items
  function displayCartItems() {
    const $cartItemsList = $("#cart-items-list");
    const $totalItems = $("#total-items");
    const $totalPrice = $("#total-price");

    // Fetch items from IndexedDB
    getItems()
      .done(function (cartItems) {
        $cartItemsList.empty(); // Clear previous items

        if (cartItems.length === 0) {
          // If cart is empty
          $cartItemsList.html("<p>Your cart is empty.</p>");
          $totalItems.text(0);
          $totalPrice.text("0.00");
          return;
        }

        let totalItemsCount = 0;
        let totalPriceAmount = 0;

        // Render cart items
        cartItems.forEach((item) => {
          totalItemsCount++;
          const p = item.price.replace(/&#x20B9; /g, "");
          const pi = p.replace(/,/g, "");
          const price = parseInt(pi) || 0;
          console.log(price);
          totalPriceAmount += price;

          const cartItemHTML = `
              <div class="cart-item" data-id="${item.id}">
                <img src="${item.image || "assets/default-product.jpg"}" alt="${
            item.name
          }">
                <div class="cart-item-details">
                  <h4>${item.name}</h4>
                  <p>${item.description || ""}</p>
                  <p>Price: ${item.price}</p>
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
              </div>
          `;

          $cartItemsList.append(cartItemHTML);
        });

        // Update cart summary
        $totalItems.text(totalItemsCount);
        $totalPrice.text(totalPriceAmount);
      })
      .fail(function (error) {
        console.error("Failed to load cart items:", error);
        $cartItemsList.html("<p>Failed to load cart items.</p>");
      });
  }

  $(document).on("click", ".remove-btn", function () {
    const itemId = $(this).data("id"); // Get the item's ID from data-id attribute
    console.log("Removing item with ID:", itemId); // Log the ID for debugging

    if (!itemId) {
      console.error("Invalid or missing item ID:", itemId);
      return;
    }

    // Call deleteItem function with the correct ID
    deleteItem(itemId)
      .done(function () {
        console.log("Item deleted successfully, refreshing cart");
        displayCartItems(); // Refresh the cart after successful deletion
      })
      .fail(function (error) {
        console.error("Failed to remove item:", error);
      });
  });

  // Initialize the cart display on page load
  displayCartItems();
});
