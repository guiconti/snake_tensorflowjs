

const converter = new showdown.Converter();
const text = '#hello, markdown!';
const htmlBody = document.getElementById("markdown");
htmlBody.innerHTML = converter.makeHtml(text);