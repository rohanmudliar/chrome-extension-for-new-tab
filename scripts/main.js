const container = document.getElementById('container'),
    timeDom = document.getElementById('container__time-display'),
    inputDom = document.getElementById('container__searchBox-elem'),
    micSearch = document.getElementById('container__searchBox-imgCont'),
    listeningDom = document.getElementById('listening'),
    greetingDom = document.getElementById('container__greeting-prefix'),
    nameDom = document.getElementById('container__greeting-name'),
    quoteMessage = document.getElementById('container__randomQuotesMessage'),
    quoteAuthor = document.getElementById('container__randomQuotesAuthor');

const modelObj = {
    timeObj: {},
    greetPrefix: '',
};

window.onload = function () {
    inputDom.focus();
};

renderBackground();
getDataFromStorage();
fetchRandomQuote();

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

inputDom.addEventListener("keyup", inputClickFunctionality);
micSearch.addEventListener('click', micClickFunctionality);

function renderBackground() {
    const randomImgId = Math.floor(Math.random() * imageList.length);
    container.style.background = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${imageList[randomImgId]}) center no-repeat`;
    container.style.backgroundSize = 'cover';
};

function getDataFromStorage() {
    if (chrome.storage) {
        chrome.storage.sync.get("dataName", function (items) {
            if (!chrome.runtime.error) {
                items.dataName ? nameDom.innerHTML = `${items.dataName}.` : nameDom.innerHTML = 'Stranger.';
            };
        });
    } else {
        nameDom.innerHTML = 'Stranger.';
    };
};

function fetchRandomQuote() {
    fetch("https://type.fit/api/quotes")
        .then(function (res) {
            return res.json();
        })
        .then(function (data) {
            var randomNumber = Math.floor(Math.random() * data.length);
            quoteMessage.innerHTML = `"${data[randomNumber].text}"`;
            if (data[randomNumber].author)
                quoteAuthor.innerHTML = `- ${data[randomNumber].author}`;
            else
                quoteAuthor.innerHTML = `- Anonymous`;
        });
};


const ticker = setInterval(() => {
    modelObj.timeObj = renderTime();
    renderDom();
}, 10);

function inputClickFunctionality(_event) {
    if (_event.keyCode === 13) {
        if (inputDom.value.includes('.') && !inputDom.value.includes(' ')) {
            let url = new URL(`https://${inputDom.value}`);
            window.location = url;
        } else {
            SearchOnWeb(inputDom.value);
            inputDom.value = '';
        };
    };
    _event.preventDefault();
};

function micClickFunctionality() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            console.log('You let me use your mic!');
            recognition.start();
        })
        .catch(function (err) {
            console.log('No mic for you!')
        });
};

function SearchOnWeb(_searchValue) {
    window.open(`https://www.google.co.in/search?dcr=0&source=hp&ei=9tbAWomUA4znvAS78pTABg&q=${_searchValue}&oq=${_searchValue}&gs_l=psy-ab.3..0i131i67k1l2j0i10k1j0i67k1j0l3j0i131k1j0j0i10k1.1056.1602.0.1921.5.4.0.0.0.0.147.429.0j3.4.0....0...1.1.64.psy-ab..1.4.561.6..35i39k1.133.LgSijWYB90Y`);
};

function renderDom() {
    let { hrs, mins, sec } = modelObj.timeObj;
    timeDom.innerHTML = `${hrs}:${mins}:${sec}`;

    if (hrs < 12) modelObj.greetPrefix = 'Morning';
    else if (hrs >= 12 && hrs <= 16) modelObj.greetPrefix = 'Afternoon';
    else if (hrs >= 16 && hrs <= 24) modelObj.greetPrefix = 'Evening';

    greetingDom.innerHTML = `Good ${modelObj.greetPrefix},`;
};

recognition.onstart = function () {
    micSearch.classList.add('border-green');
    listening.classList.remove('hidden');
    console.log('Voice recognition activated. Try speaking into the microphone.');
};

recognition.onspeechend = function () {
    micSearch.classList.remove('border-green');
    listening.classList.add('hidden');
    console.log('You were quiet for a while so voice recognition turned itself off.');
};

recognition.onerror = function (event) {
    if (event.error == 'no-speech') {
        micSearch.classList.remove('border-green');
        listening.classList.add('hidden');
        console.log('No speech was detected. Try again.');
    };
};

recognition.onresult = function (event) {
    var current = event.resultIndex;
    var transcript = event.results[current][0].transcript;
    recognition.stop();
    micSearch.classList.remove('border-green');
    SearchOnWeb(transcript);
};