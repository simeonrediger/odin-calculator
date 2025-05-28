export default class Clock {

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
