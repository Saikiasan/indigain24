class Router {
  constructor() {
    this.defaultView = "home";
    this.rootElement = document.getElementById("root");
    this.loadView();
  }

  loadView() {
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get("view") || this.defaultView;

    this.loadViewFromFile(view);
    this.setPageTitle(view);
  }

  setPageTitle(view) {
    const title = view;
    document.title = title.toUpperCase();
  }

  async loadViewFromFile(view) {
    try {
      const response = await fetch(`pages/${view}.html`);

      if (response.ok) {
        const content = await response.text();

        this.renderView(content);

        this.executeScripts(content);
      } else {
        this.renderView(
          ` <div class="container-fluid vh-100 d-flex justify-content-center align-items-center"> <div class="text-center"> <h1>404</h1> <h4 class="fw-normal">Requested page not available</h4> <p>Go back, or refresh this page if this seems like a mistake</p> </div> </div> `
        );
      }
    } catch (error) {
      console.error("Error loading view:", error);
      this.renderView(
        "<h1>Error</h1><p>There was an error loading the content.</p>"
      );
    }
  }

  /**
   * Executes any <script> tags found in the provided content.
   * @param {string} content - The HTML content that includes <script> tags.
   */
  executeScripts(content) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = content;
    const scripts = tempElement.querySelectorAll("script");

    scripts.forEach((script) => {
      const newScript = document.createElement("script");
      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.textContent = script.textContent;
      }

      document.body.appendChild(newScript);
    });
  }

  renderView(content) {
    this.rootElement.innerHTML = content;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new Router();
});
