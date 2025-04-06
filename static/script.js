function checkNews() {
    let newsText = document.getElementById("newsInput").value.trim();
    let resultDiv = document.getElementById("result");
    let loadingDiv = document.getElementById("loading");

    resultDiv.style.display = "none";
    loadingDiv.style.display = "block";

    if (!newsText) {
        loadingDiv.style.display = "none";
        resultDiv.style.display = "block";
        resultDiv.innerHTML = "Please enter some news content to check.";
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
        loadingDiv.style.display = "none";
        resultDiv.style.display = "block";

        if (data.prediction === "REAL NEWS") {
            resultDiv.innerHTML = "<strong>✔ Verified:</strong> This appears to be real news.";
            resultDiv.classList.add("real");
            resultDiv.classList.remove("fake");
        } else if (data.prediction === "FAKE NEWS") {
            resultDiv.innerHTML = "<strong>✖ Alert:</strong> This content may be fake news.";
            resultDiv.classList.add("fake");
            resultDiv.classList.remove("real");
        } else {
            resultDiv.innerHTML = "An error occurred: " + (data.error || "Unknown response.");
        }
    })
    .catch(error => {
        loadingDiv.style.display = "none";
        resultDiv.style.display = "block";
        resultDiv.innerHTML = "An error occurred while analyzing the news: " + error;
    });
}
