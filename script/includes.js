function includeHTML() {
    const elements = document.querySelectorAll("[w3-include-html]");
    elements.forEach((el) => {
        const file = el.getAttribute("w3-include-html");
        if (file) {
            fetch(file)
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    }
                    throw new Error("File not found");
                })
                .then((content) => {
                    el.innerHTML = content;
                    el.removeAttribute("w3-include-html");
                    includeHTML(); // Rekursion für verschachtelte Includes
                })
                .catch((error) => console.error(error));
        }
    });
}
