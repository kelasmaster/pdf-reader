// script.js

// Initialize variables
let pdfDoc = null;
let currentPage = 1;
let totalPages = 0;

// Get DOM elements
const pdfUpload = document.getElementById('pdf-upload');
const pdfCanvas = document.getElementById('pdf-canvas');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

// Load PDF using PDF.js
pdfUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf') {
    const fileURL = URL.createObjectURL(file);
    loadPDF(fileURL);
  } else {
    alert('Please upload a valid PDF file.');
  }
});

// Function to load PDF
function loadPDF(url) {
  pdfjsLib.getDocument(url).promise.then((pdf) => {
    pdfDoc = pdf;
    totalPages = pdf.numPages;
    currentPage = 1;
    renderPage(currentPage);
    updateControls();
  }).catch((error) => {
    console.error('Error loading PDF:', error);
    alert('Failed to load PDF.');
  });
}

// Function to render a specific page
function renderPage(pageNumber) {
  pdfDoc.getPage(pageNumber).then((page) => {
    const viewport = page.getViewport({ scale: 1.5 });
    const canvasContext = pdfCanvas.getContext('2d');
    pdfCanvas.width = viewport.width;
    pdfCanvas.height = viewport.height;

    page.render({
      canvasContext,
      viewport
    }).promise.then(() => {
      // Rendering complete
    });
  });
}

// Update navigation controls
function updateControls() {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= totalPages;
}

// Previous page button
prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
    updateControls();
  }
});

// Next page button
nextPageBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    renderPage(currentPage);
    updateControls();
  }
});
