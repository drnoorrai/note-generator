const currentYearNodes = document.querySelectorAll("[data-current-year]");
currentYearNodes.forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const leaflets = [
  {
    title: "Depression",
    college: "RCPsych",
    specialty: "Mental Health",
    url: "https://www.rcpsych.ac.uk/mental-health/problems-disorders/depression"
  },
  {
    title: "Anxiety, panic and phobias",
    college: "RCPsych",
    specialty: "Mental Health",
    url: "https://www.rcpsych.ac.uk/mental-health/problems-disorders/anxiety-panic-and-phobias"
  },
  {
    title: "Bipolar disorder",
    college: "RCPsych",
    specialty: "Mental Health",
    url: "https://www.rcpsych.ac.uk/mental-health/problems-disorders/bipolar-disorder"
  },
  {
    title: "Schizophrenia",
    college: "RCPsych",
    specialty: "Mental Health",
    url: "https://www.rcpsych.ac.uk/mental-health/problems-disorders/schizophrenia"
  },
  {
    title: "Heavy menstrual bleeding",
    college: "RCOG",
    specialty: "Women's Health",
    url: "https://www.rcog.org.uk/for-the-public/browse-our-patient-information/heavy-menstrual-bleeding/"
  },
  {
    title: "Endometriosis",
    college: "RCOG",
    specialty: "Women's Health",
    url: "https://www.rcog.org.uk/for-the-public/browse-our-patient-information/endometriosis/"
  },
  {
    title: "Pelvic organ prolapse",
    college: "RCOG",
    specialty: "Women's Health",
    url: "https://www.rcog.org.uk/for-the-public/browse-our-patient-information/pelvic-organ-prolapse/"
  },
  {
    title: "Early miscarriage",
    college: "RCOG",
    specialty: "Women's Health",
    url: "https://www.rcog.org.uk/for-the-public/browse-our-patient-information/early-miscarriage/"
  }
];

function initLeaflets() {
  const root = document.querySelector("[data-leaflet-app]");
  if (!root) return;

  const search = root.querySelector("[data-leaflet-search]");
  const chips = Array.from(root.querySelectorAll("[data-specialty]"));
  const list = root.querySelector("[data-results-list]");
  const resultsView = root.querySelector("[data-results-view]");
  const qrView = root.querySelector("[data-qr-view]");
  const qrTitle = root.querySelector("[data-qr-title]");
  const qrMeta = root.querySelector("[data-qr-meta]");
  const qrUrl = root.querySelector("[data-qr-url]");
  const qrCode = root.querySelector("[data-qr-code]");
  const backButton = root.querySelector("[data-back-results]");
  let selectedSpecialty = "All";

  function matches(item) {
    const query = search.value.trim().toLowerCase();
    const text = `${item.title} ${item.college} ${item.specialty}`.toLowerCase();
    const specialtyMatch = selectedSpecialty === "All" || item.specialty === selectedSpecialty;
    return specialtyMatch && (!query || text.includes(query));
  }

  function showResults() {
    resultsView.classList.remove("hidden");
    qrView.classList.remove("active");
    qrView.setAttribute("aria-hidden", "true");
    search.focus({ preventScroll: true });
  }

  function showQr(item) {
    resultsView.classList.add("hidden");
    qrView.classList.add("active");
    qrView.setAttribute("aria-hidden", "false");
    qrTitle.textContent = item.title;
    qrMeta.textContent = `${item.college} · ${item.specialty}`;
    qrUrl.textContent = item.url;
    qrUrl.href = item.url;
    qrCode.innerHTML = "";
    if (window.QRCode) {
      new QRCode(qrCode, {
        text: item.url,
        width: 220,
        height: 220,
        colorDark: "#111210",
        colorLight: "#FFFFFF",
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      qrCode.textContent = "QR library unavailable. Use the link below.";
    }
    backButton.focus({ preventScroll: true });
  }

  function render() {
    const filtered = leaflets.filter(matches);
    list.innerHTML = "";
    if (!filtered.length) {
      const empty = document.createElement("p");
      empty.className = "notice";
      empty.textContent = "No matching leaflets. Try a broader search.";
      list.appendChild(empty);
      return;
    }

    filtered.forEach((item) => {
      const button = document.createElement("button");
      button.className = "leaflet-item";
      button.type = "button";
      button.innerHTML = `
        <strong>${item.title}</strong>
        <span class="leaflet-meta">
          <span>${item.college}</span>
          <span>${item.specialty}</span>
          <span>Show QR</span>
        </span>
      `;
      button.addEventListener("click", () => showQr(item));
      list.appendChild(button);
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      selectedSpecialty = chip.dataset.specialty;
      chips.forEach((item) => item.classList.toggle("active", item === chip));
      render();
    });
  });

  search.addEventListener("input", render);
  backButton.addEventListener("click", showResults);
  render();
}

initLeaflets();
