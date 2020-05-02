function renderTime() {
    let currentTime = new Date(),
        hrs = currentTime.getHours(),
        mins = currentTime.getMinutes(),
        sec = currentTime.getSeconds();

    hrs = ("0" + hrs).slice(-2);
    mins = ("0" + mins).slice(-2);
    sec = ("0" + sec).slice(-2);

    return { hrs, mins, sec };
};