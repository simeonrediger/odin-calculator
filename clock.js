export default class Clock {

    updateClockContinuously() {
        this.displayCurrentTime();
        setInterval(this.displayCurrentTime, 1000);
    }

    displayCurrentTime() {
        const timeDisplay = document.querySelector('#time');
        timeDisplay.textContent = new Date()
            .toLocaleString([], {
                hour: '2-digit',
                minute: '2-digit',
            })
            .replace(/\s+(AM|PM)/, '')    // Remove meridiem indicator
            .replace(/0(?=[0-9]:)/, '');  // Remove left-padding 0 from hour
    }
}
