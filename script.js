document.addEventListener("DOMContentLoaded", () => {
  // Page navigation
  const navLinks = document.querySelectorAll(".nav-link, .mobile-nav-link, .btn[data-page]");
  const pages = document.querySelectorAll(".page");

  function showPage(pageId) {
    pages.forEach(page => page.classList.remove("active"));
    const newPage = document.getElementById(pageId);
    if (newPage) {
        newPage.classList.add("active");
    } else {
        document.getElementById('home').classList.add("active"); // Fallback to home
    }
    window.scrollTo(0, 0);

    navLinks.forEach(link => {
      link.classList.toggle("active", link.dataset.page === pageId);
    });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const pageId = e.currentTarget.dataset.page;
      showPage(pageId);
      if (mobileNav.classList.contains("open")) {
        mobileNav.classList.remove("open");
      }
    });
  });

  // Mobile menu
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  mobileMenuToggle.addEventListener("click", () => mobileNav.classList.toggle("open"));

  // Heatmap generation
  const heatmapGrid = document.querySelector(".heatmap-grid");
  if(heatmapGrid) {
    for (let i = 0; i < 24; i++) {
        const cell = document.createElement("div");
        cell.classList.add("heatmap-cell");
        let cellType = 'low';
        if (i % 7 === 0) cellType = 'severe';
        else if (i % 5 === 0) cellType = 'high';
        cell.classList.add(cellType);
        heatmapGrid.appendChild(cell);
    }
  }

  // Registration Form
  let currentStep = 1;
  const form = {
    fullName: 'Anike', idType: 'Passport', idNumber: 'A1234567', dob: '1990-01-01', gender: 'Male', 
    nationality: 'Indian', phone: '+919876543210', email: 'anike@example.com', medical: '', agree: false
  };
  const itinerary = [{ place: 'Delhi', from: '2025-10-01', to: '2025-10-05' }];
  const emergency = [{ name: 'Kishan', relation: 'Friend', phone: '+919876543211' }];
  let kycFileName = null;

  const progressFill = document.getElementById("registration-progress");
  const backBtn = document.getElementById("back-btn");
  const nextBtn = document.getElementById("next-btn");
  const submitBtn = document.getElementById("submit-btn");
  const steps = document.querySelectorAll(".registration-step");

  function updateFormStep() {
    steps.forEach(step => step.classList.remove("active"));
    document.getElementById(`step-${currentStep}`).classList.add("active");
    if(progressFill) progressFill.style.width = `${(currentStep / 4) * 100}%`;

    if(backBtn) backBtn.disabled = currentStep === 1;
    if(nextBtn) nextBtn.style.display = currentStep < 4 ? "inline-flex" : "none";
    if(submitBtn) submitBtn.style.display = currentStep === 4 ? "inline-flex" : "none";
  }

  function validateStep() {
    // Basic validation for demo
    return true;
  }

  if(nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (validateStep()) {
        currentStep = Math.min(4, currentStep + 1);
        updateFormStep();
        if (currentStep === 4) populateReview();
      }
    });
  }

  if(backBtn) {
    backBtn.addEventListener("click", () => {
      currentStep = Math.max(1, currentStep - 1);
      updateFormStep();
    });
  }

  if(submitBtn) {
      submitBtn.addEventListener("click", () => {
        if (form.agree) {
          document.querySelector(".registration-content").style.display = "none";
          document.getElementById("registration-success").style.display = "block";
          populateSuccessScreen();
        }
      });
  }

  const agreeCheckbox = document.getElementById('agree');
  if(agreeCheckbox) {
      agreeCheckbox.addEventListener('change', (e) => {
        form.agree = e.target.checked;
        if(submitBtn) submitBtn.disabled = !form.agree;
      });
  }
  
  // Simplified data binding
  document.querySelectorAll('input, select, textarea').forEach(input => {
      if(form[input.name] !== undefined) {
          input.value = form[input.name];
          input.addEventListener('input', (e) => form[e.target.name] = e.target.value);
      }
  });

  // Itinerary and Emergency Contacts handlers
  function createItineraryItem(item, index) {
    return `
      <div class="itinerary-item" data-index="${index}">
          <div class="item-header">
              <div class="item-title">Stop ${index + 1}</div>
              ${index > 0 ? '<button type="button" class="btn btn-outline btn-sm remove-itinerary">Remove</button>' : ''}
          </div>
          <div class="form-group"><label>Place/City</label><input type="text" name="place" value="${item.place}"></div>
          <div class="form-row">
              <div class="form-group"><label>From</label><input type="date" name="from" value="${item.from}"></div>
              <div class="form-group"><label>To</label><input type="date" name="to" value="${item.to}"></div>
          </div>
      </div>`;
  }

  function renderItinerary() {
    const container = document.getElementById('itinerary-container');
    if(container) container.innerHTML = itinerary.map(createItineraryItem).join('');
  }

  const addItineraryBtn = document.getElementById('add-itinerary');
  if(addItineraryBtn) {
    addItineraryBtn.addEventListener('click', () => {
        itinerary.push({ place: '', from: '', to: '' });
        renderItinerary();
    });
  }

  const itineraryContainer = document.getElementById('itinerary-container');
  if(itineraryContainer) {
    itineraryContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-itinerary')) {
            const index = e.target.closest('.itinerary-item').dataset.index;
            itinerary.splice(index, 1);
            renderItinerary();
        }
    });
  }

  function populateReview() {
    const reviewSummary = document.getElementById('review-summary');
    if(reviewSummary) {
        reviewSummary.innerHTML = `
            <div><strong>Name:</strong> ${form.fullName}</div>
            <div><strong>ID:</strong> ${form.idType} - ${form.idNumber}</div>
            <div><strong>DOB:</strong> ${form.dob}</div>
            <div><strong>Phone:</strong> ${form.phone}</div>
            <div><strong>Email:</strong> ${form.email}</div>
        `;
    }
  }

  function populateSuccessScreen() {
    const finalIdCard = document.getElementById('final-id-card');
    const finalDetails = document.getElementById('final-details');
    if(finalIdCard) finalIdCard.innerHTML = `<div class="id-card"><div class="id-header"><h4>Tourist ID</h4><div class="id-number">ST-PAS-${form.idNumber.slice(-4)}</div></div><div class="id-body"><div class="id-name">${form.fullName}</div><div class="qr-placeholder">QR</div></div></div>`;
    if(finalDetails) finalDetails.innerHTML = `<div><strong>Name:</strong> ${form.fullName}</div><div><strong>ID:</strong> ST-PAS-${form.idNumber.slice(-4)}</div>`;
  }

  // Initial page load
  const initialPage = window.location.hash.substring(1) || 'home';
  showPage(initialPage);
  renderItinerary();
  updateFormStep();
});
