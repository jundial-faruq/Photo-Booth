// ========================================
// JUNÉTO PHOTO BOOTH
// CAMERA SYSTEM
// ========================================


// ========================================
// ELEMENT
// ========================================

const homeScreen =
    document.getElementById("home-screen");

const cameraScreen =
    document.getElementById("camera-screen");

const previewScreen =
    document.getElementById("preview-screen");

const startButton =
    document.getElementById("start-button");

const takePhotoButton =
    document.getElementById("take-photo");

const retakeButton =
    document.getElementById("retake-button");

const continueButton =
    document.getElementById("continue-button");

const camera =
    document.getElementById("camera");

const cameraCountdown =
    document.getElementById("camera-countdown");

const photoCanvas =
    document.getElementById("photo-canvas");

const flash =
    document.getElementById("flash");

const ticker =
    document.getElementById("tk");


// ========================================
// CAMERA STREAM
// ========================================

let cameraStream = null;


// ========================================
// TICKER TEXT
// ========================================

const tickerText =
    "BUKTI KALIAN PERNAH SERU BARENG ✦ " +
    "4 FOTO 1 VIBE ✦ " +
    "0 DRAMA ✦ " +
    "POSE DULU MIKIR BELAKANGAN ✦ ";

ticker.textContent =
    tickerText.repeat(8);


// ========================================
// SHOW SCREEN
// ========================================

function showScreen(screen) {

    homeScreen.style.display = "none";

    cameraScreen.classList.remove("active");

    previewScreen.classList.remove("active");


    if (screen === "home") {

        homeScreen.style.display = "flex";

    }


    if (screen === "camera") {

        cameraScreen.classList.add("active");

    }


    if (screen === "preview") {

        previewScreen.classList.add("active");

    }

}


// ========================================
// START CAMERA
// ========================================

async function startCamera() {

    try {

        // Cek apakah browser mendukung kamera

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices.getUserMedia
        ) {

            alert(
                "Browser kamu tidak mendukung akses kamera."
            );

            return;
        }


        // Meminta akses kamera

        cameraStream =
            await navigator.mediaDevices.getUserMedia({

                video: {

                    facingMode: "user"

                },

                audio: false

            });


        // Masukkan kamera ke video

        camera.srcObject =
            cameraStream;


        // Tampilkan halaman kamera

        showScreen("camera");


    } catch (error) {

        console.error(
            "Camera error:",
            error
        );


        alert(
            "Kamera tidak dapat digunakan.\n\n" +
            "Pastikan izin kamera sudah diberikan " +
            "kepada browser."
        );

    }

}


// ========================================
// STOP CAMERA
// ========================================

function stopCamera() {

    if (!cameraStream) {

        return;

    }


    cameraStream
        .getTracks()
        .forEach(track => {

            track.stop();

        });


    cameraStream = null;

    camera.srcObject = null;

}


// ========================================
// FLASH
// ========================================

function cameraFlash() {

    flash.classList.remove("go");

    // Memaksa browser menjalankan animasi ulang

    void flash.offsetWidth;

    flash.classList.add("go");

}


// ========================================
// COUNTDOWN
// ========================================

function countdown() {

    return new Promise((resolve) => {

        let number = 3;


        cameraCountdown.classList.remove(
            "hidden"
        );


        cameraCountdown.textContent =
            number;


        const interval =
            setInterval(() => {

                number--;


                if (number > 0) {

                    cameraCountdown.textContent =
                        number;

                } else {

                    clearInterval(interval);


                    cameraCountdown.classList.add(
                        "hidden"
                    );


                    resolve();

                }

            }, 1000);

    });

}


// ========================================
// TAKE PHOTO
// ========================================


async function takePhoto() {
    if (takePhotoButton.disabled) return;

    takePhotoButton.disabled = true;

    try {
        // Countdown 3, 2, 1
        await countdown();

        // Pastikan kamera siap
        const width = camera.videoWidth;
        const height = camera.videoHeight;

        if (!width || !height) {
            alert("Kamera belum siap. Coba lagi.");
            return;
        }

        // Siapkan canvas untuk foto baru
        photoCanvas.width = width;
        photoCanvas.height = height;

        const context = photoCanvas.getContext("2d");

        // Mirror foto seperti kamera depan
        context.save();
        context.translate(width, 0);
        context.scale(-1, 1);

        context.drawImage(camera, 0, 0, width, height);

        context.restore();

        // Efek flash
        cameraFlash();

        // Pindah ke preview setelah flash
        await new Promise(resolve => setTimeout(resolve, 200));

        stopCamera();
        showScreen("preview");

    } catch (error) {
        console.error("Gagal mengambil foto:", error);
        alert("Foto gagal diambil. Silakan coba lagi.");

    } finally {
        takePhotoButton.disabled = false;
    }
}


// ========================================
// RETAKE
// ========================================

async function retakePhoto() {

    // Bersihkan foto sebelumnya

    const context =
        photoCanvas.getContext("2d");

    context.clearRect(
        0,
        0,
        photoCanvas.width,
        photoCanvas.height
    );


    // Buka kamera lagi

    await startCamera();

}


// ========================================
// CONTINUE
// ========================================

function continuePhoto() {

    alert(
        "Tahap berikutnya akan berisi filter dan frame JUNÉTO."
    );

}


// ========================================
// START BUTTON
// ========================================

startButton.addEventListener(
    "click",
    startCamera
);


// ========================================
// TAKE PHOTO BUTTON
// ========================================

takePhotoButton.addEventListener(
    "click",
    takePhoto
);


// ========================================
// RETAKE BUTTON
// ========================================

retakeButton.addEventListener(
    "click",
    retakePhoto
);


// ========================================
// CONTINUE BUTTON
// ========================================

continueButton.addEventListener(
    "click",
    continuePhoto
);