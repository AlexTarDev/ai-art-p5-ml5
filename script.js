window.onload = function () {
    console.log("Page loaded, loading p5.js...");

    function sketch(p) {
        let styleTransfer;
        let birdImage;
        let resultImg;
        let isTransferring = false;

        p.preload = function () {
            console.log("Loading image...");

            // Load the bird image
            birdImage = p.loadImage('bird.jpg', () => {
                console.log("Bird image loaded!");
            }, () => {
                console.error("Error loading the image!");
            });
        };

        p.setup = function () {
            console.log("Running setup()");
            let canvas = p.createCanvas(320, 240);
            canvas.parent("p5-container");

            resultImg = p.createImg("", "Stylized Image");
            resultImg.size(p.width, p.height);
            resultImg.parent("p5-container");

            // Load the AI "Style Transfer" model from CDN
            const modelPath = 'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models@main/models/style-transfer/udnie/';

            console.log("Loading model...");
            styleTransfer = ml5.styleTransfer(modelPath, modelLoaded, modelError);
        };

        function modelLoaded() {
            console.log("Model successfully loaded!");

            // After 2 seconds, apply the style transfer
            setTimeout(() => {
                if (!isTransferring) {
                    transferStyle();
                }
            }, 2000);
        }

        function modelError(err) {
            console.error("Error loading the model:", err);
        }

        p.draw = function () {
            if (birdImage) {
                p.image(birdImage, 0, 0, p.width, p.height);
            }
        };

        function transferStyle() {
            if (!styleTransfer) {
                console.error("Error: model is not loaded yet.");
                return;
            }

            isTransferring = true;
            console.log("Starting style transfer...");

            styleTransfer.transfer(p.canvas, function (err, result) {
                if (err) {
                    console.error("Error processing the image:", err);
                    isTransferring = false;
                    return;
                }

                console.log("Style transfer completed!");
                resultImg.attribute("src", result.src);
                isTransferring = false;
            });
        }
    }

    new p5(sketch);
};
