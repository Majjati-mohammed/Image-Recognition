let classifier;
let imageElement = document.getElementById('image');
let resultElement = document.getElementById('result');
function setup() {
    classifier = ml5.imageClassifier('MobileNet', modelLoaded);
}
function modelLoaded() {
    console.log('Model Loaded!');
}
document.getElementById('file')
        .addEventListener('change', handleFileSelect);
function handleFileSelect(event) {
    let file = event.target.files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            imageElement.src = e.target.result;
            imageElement.style.display = 'block';
            imageElement.onload = function () {
                classifyFn();
            };
        };
        reader.readAsDataURL(file);
    }
}
function classifyFn() {
    console.log('Classifying image...');
    classifier.classify(imageElement)
        .then(results => {
            console.log('Classification results:', results);
            let highestConfidenceResult = results.reduce((max, result) =>
                result.confidence > max.confidence ? result : max,
                { label: '', confidence: 0 }
            );
            resultElement.innerText = ` ${highestConfidenceResult.label}\nConfidence: 
            ${(highestConfidenceResult.confidence * 100).toFixed(2)}%`;
        })
        .catch(error => {
            console.error('Classification error:', error);
            resultElement.innerText = 'Error classifying image.';
        });
}
setup();