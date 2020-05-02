const setVal = document.getElementById('container__heading-inputSet'),
    setButton = document.getElementById('container__heading-button');

setButton.addEventListener('click', function () {
    const name = setVal.value;
    chrome.storage.sync.set({ "dataName": name }, function () {
        document.cookie = `${name};expires=Thu, 18 Dec 2019 12:00:00 UTC`;
        if (chrome.runtime.error) {
            console.log("Runtime error.");
        }
    });
    window.close();
});