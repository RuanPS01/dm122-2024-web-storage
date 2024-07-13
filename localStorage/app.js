class App {
    constructor() {
        this.initializeForm();
    }

    initializeForm() {
        const form = document.querySelector('form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            // console.log("Form submitted!");
            // console.log("Key: " + event.target.key.value);
            // console.log("Value: " + event.target.keyValue.value);

            const data = {
                key: event.target.key.value,
                value: event.target.keyValue.value
            };
            this.save(data);

            form.reset();
            form.key.focus();
        });
    }

    save({ key, value }) {
        window.localStorage.setItem(key, value);
        this.listValues();
    }

    listValues() {
        const storedData = window.localStorage;
        const keys = Object.keys(storedData);
        console.log(keys);
    }
}
new App();