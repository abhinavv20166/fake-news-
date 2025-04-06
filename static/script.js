function checkNews() {
    let newsText = document.getElementById("newsInput").value.trim();
    let resultDiv = document.getElementById("result");
    let loadingDiv = document.getElementById("loading");

    resultDiv.style.display = "none"; // Hide previous result
    loadingDiv.style.display = "block"; // Show loading animation

    if (!newsText) {
        loadingDiv.style.display = "none";
        resultDiv.style.display = "block";
        resultDiv.innerHTML = "⚠️ Please enter some text to analyze.";
        resultDiv.classList.remove("real", "fake");
        return;
    }

    fetch("/predict", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: newsText })
    })
    .then(response => response.json())
    .then(data => {
        loadingDiv.style.display = "none"; // Hide loading animation
        resultDiv.style.display = "block"; // Show result

        if (data.prediction === "REAL NEWS") {
            resultDiv.innerHTML = "✅ This News is REAL";
            resultDiv.classList.add("real");
            resultDiv.classList.remove("fake");
        } else if (data.prediction === "FAKE NEWS") {
            resultDiv.innerHTML = "❌ This News is FAKE";
            resultDiv.classList.add("fake");
            resultDiv.classList.remove("real");
        } else {
            resultDiv.innerHTML = "⚠️ Error: " + data.error;
        }
    })
    .catch(error => {
        loadingDiv.style.display = "none";
        resultDiv.style.display = "block";
        resultDiv.innerHTML = "⚠️ Error: " + error;
    });
}
