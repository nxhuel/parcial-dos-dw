let recorder;
let stream;

let timerInterval;
let segundos = 0;

const etapa = document.getElementById("etapa");
const video = document.getElementById("video");
const preview = document.getElementById("preview");

const status = document.getElementById("statusMyGiphy");
const result = document.getElementById("resultMyGiphy");

function cancelarProceso() {
    etapa.textContent = '';
    video.style.display = 'none';
    preview.style.display = 'none';
    document.querySelectorAll('button').forEach(btn => btn.style.display = 'none');
}

function iniciarEtapa1() {
    etapa.textContent = "Un chequeo antes de empezar";
    document.getElementById("btnCapturar").style.display = "inline";
    video.style.display = "block";

    navigator.mediaDevices.getUserMedia({ video: true }).then(mediaStream => {
        stream = mediaStream;
        video.srcObject = stream;
    });
}

document.getElementById("btnCapturar").onclick = () => {
    etapa.textContent = "Capturando tu Guifo";

    recorder = new RecordRTC(stream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240
    });

    recorder.startRecording();

    segundos = 0;
    document.getElementById("cronometro").style.display = "block";
    document.getElementById("cronometro").textContent = "00:00";

    timerInterval = setInterval(() => {
        segundos++;
        const min = String(Math.floor(segundos / 60)).padStart(2, "0");
        const sec = String(segundos % 60).padStart(2, "0");
        document.getElementById("cronometro").textContent = `${min}:${sec}`;
    }, 1000);

    document.getElementById("btnCapturar").style.display = "none";
    document.getElementById("btnListo").style.display = "inline";
};

document.getElementById("btnListo").onclick = () => {
    recorder.stopRecording(() => {
        etapa.textContent = "Vista previa";
        stream.getTracks().forEach(t => t.stop());
        video.style.display = "none";
        preview.style.display = "block";

        const blob = recorder.getBlob();
        const gifURL = URL.createObjectURL(blob);
        preview.innerHTML = `<img src="${gifURL}" alt="preview" />`;

        clearInterval(timerInterval);
        document.getElementById("cronometro").style.display = "none";
        document.getElementById("btnListo").style.display = "none";
        document.getElementById("btnRepetir").style.display = "inline";
        document.getElementById("btnSubir").style.display = "inline";
    });
};

document.getElementById("btnRepetir").onclick = () => {
    preview.style.display = "none";
    iniciarEtapa1();
};

document.getElementById("btnSubir").onclick = async () => {
    etapa.textContent = "Subiendo Guifo";
    status.textContent = "Estamos subiendo tu guifo...";

    const blob = recorder.getBlob();
    const form = new FormData();
    form.append("file", blob, "guifo.gif");
    form.append("api_key", ENV.API_KEY);

    document.getElementById("barraUpload").style.display = "block";
    let progreso = 0;

    const simulador = setInterval(() => {
        if (progreso >= 100) {
            clearInterval(simulador);
        } else {
            progreso += 5;
            document.getElementById("progresoUpload").style.width = `${progreso}%`;
        }
    }, 100);


    const res = await fetch(ENV.UPLOAD_URL, {
        method: "POST",
        body: form

    });

    progreso = 100;
    document.getElementById("progresoUpload").style.width = `100%`;
    clearInterval(simulador);


    setTimeout(() => {
        document.getElementById("barraUpload").style.display = "none";
        document.getElementById("progresoUpload").style.width = "0%";
    }, 300);

    const data = await res.json();
    const gifId = data.data.id;

    let misGuifos = JSON.parse(localStorage.getItem("misGuifos")) || [];
    misGuifos.push(gifId);
    localStorage.setItem("misGuifos", JSON.stringify(misGuifos));


    const gifRes = await fetch(`${ENV.BASE_URL}/${gifId}?api_key=${ENV.API_KEY}`);
    const gifData = await gifRes.json();
    const gifURL = gifData.data.images.original.url;

    etapa.textContent = "Guifo subido con exito";
    preview.innerHTML = `<img src="${gifURL}" alt="guifo creado" />`;

    document.getElementById("btnSubir").style.display = "none";
    document.getElementById("btnCopiar").style.display = "inline";
    document.getElementById("btnDescargar").style.display = "inline";
    document.getElementById("btnListoFinal").style.display = "inline";

    document.getElementById("btnCopiar").onclick = () => navigator.clipboard.writeText(gifURL);

    document.getElementById("btnDescargar").onclick = () => {
        const a = document.createElement('a');
        a.href = gifURL;
        a.download = "mi_guifo.gif";
        a.click();
    };

    document.getElementById("btnListoFinal").onclick = () => {
        result.innerHTML = `<img src="${gifURL}" alt="mi guifo" />`;
        status.textContent = "Guifo creado con exito";
        preview.style.display = "none";

        setTimeout(() => {
            getAllMyGifs();
        }, 1500);

        cancelarProceso();
    };

};

async function getAllMyGifs() {
    const ids = JSON.parse(localStorage.getItem("misGuifos")) || [];

    const contenedor = document.getElementById("resultMyGiphy");
    const estado = document.getElementById("statusMyGiphy");

    contenedor.innerHTML = '';
    estado.textContent = '';

    if (ids.length === 0) {
        estado.textContent = "Todavía no creaste ningún guifo.";
        return;
    }

    estado.textContent = "Cargando tus guifos...";

    for (let i = ids.length - 1; i >= 0; i--) {
        const id = ids[i];
        const res = await fetch(`${ENV.BASE_URL}/${id}?api_key=${ENV.API_KEY}`);
        const data = await res.json();

        const img = document.createElement("img");
        img.src = data.data.images.fixed_height.url;
        img.alt = data.data.title;
        contenedor.appendChild(img);
    }


    estado.textContent = "Tus guifos creados:";
}

window.onload = () => {
    getAllMyGifs();
};
