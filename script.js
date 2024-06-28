window.addEventListener('load', () => {
    const colorPicker = document.getElementById('color');
    const textInput = document.getElementById('text');
    const textColorPicker = document.getElementById('text-color');
    const imageInput = document.getElementById('image');
    const logoInput = document.getElementById('logo');
    const borderColorPicker = document.getElementById('border-color');
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const downloadButton = document.getElementById('download-btn');

    let backgroundImage = new Image();
    let logoImage = new Image();

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            backgroundImage.src = event.target.result;
            backgroundImage.onload = () => {
                drawTemplate();
            };
        };
        reader.readAsDataURL(file);
    });

    logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            logoImage.src = event.target.result;
            logoImage.onload = () => {
                drawTemplate();
            };
        };
        reader.readAsDataURL(file);
    });

    function drawTemplate() {
        const color = colorPicker.value;
        const textColor = textColorPicker.value;
        const text = textInput.value;
        const borderColor = borderColorPicker.value;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (backgroundImage.src) {
            ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        }

        // Draw the semi-transparent color overlay
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        function drawRoundedRect(x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
        }

        // Draw the rounded border
        ctx.globalAlpha = 1;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 2;
        drawRoundedRect(5, 5, canvas.width - 10, canvas.height - 10, 15);
        ctx.stroke();

        // Draw the text with higher contrast, vertically centered
        ctx.font = '48px Arial';
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        // Reset shadow
        ctx.shadowColor = 'transparent';

        // Draw the logo in the bottom right corner
        if (logoImage.src) {
            const logoWidth = 200;
            const logoHeight = (logoImage.height / logoImage.width) * logoWidth;
            ctx.drawImage(logoImage, canvas.width - logoWidth - 10, canvas.height - logoHeight - 10, logoWidth, logoHeight);
        }
    }

    // Update the canvas whenever the color, text, or images are changed
    colorPicker.addEventListener('input', drawTemplate);
    textInput.addEventListener('input', drawTemplate);
    textColorPicker.addEventListener('input', drawTemplate);
    borderColorPicker.addEventListener('input', drawTemplate);

    // Initial draw
    drawTemplate();

    // Download the image
    downloadButton.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'cover-image.png';
        link.click();
    });
});
