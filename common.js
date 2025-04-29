
// Common voice commands
const commands = {
    'hello': () => alert('Hello'),
    'change the color to :color': (color) => {
        document.body.style.backgroundColor = color;
    },
    'navigate to :page': (page) => {
        window.location.href = `${page.toLowerCase()}.html`;
    }
};

function enableVoice() {
    annyang.addCommands(commands);
    annyang.start();
}

function disableVoice() {
    annyang.abort();
}


function disableVoice() {
    if (annyang) {
        annyang.abort();
    }
}