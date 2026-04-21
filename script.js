const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const promptForm = document.getElementById('promptForm');
const waitlistForm = document.getElementById('waitlistForm');
const promptOutput = document.getElementById('promptOutput');
const statusPill = document.getElementById('statusPill');
const loadingState = document.getElementById('loadingState');
const copyPromptBtn = document.getElementById('copyPromptBtn');
const samplePromptBtn = document.getElementById('samplePromptBtn');
const clearPromptBtn = document.getElementById('clearPromptBtn');
const toast = document.getElementById('toast');
const navDemoBtn = document.getElementById('navDemoBtn');
const watchPreviewBtn = document.getElementById('watchPreviewBtn');
const monthlyBtn = document.getElementById('monthlyBtn');
const yearlyBtn = document.getElementById('yearlyBtn');
const priceElements = document.querySelectorAll('.price');
const planButtons = document.querySelectorAll('.plan-btn');
const faqQuestions = document.querySelectorAll('.faq-question');

const promptTemplates = {
  marketing: ({ goal, tone }) =>
    `Act as a senior marketing strategist. Create a ${tone} campaign plan for ${goal}. Include audience insights, positioning, 3 content angles, 2 paid acquisition ideas, a CTA strategy and a short launch timeline.`,
  coding: ({ goal, tone }) =>
    `Act as a senior software engineer. Build a ${tone} implementation plan for ${goal}. Provide architecture suggestions, step-by-step tasks, code structure guidance, testing recommendations and likely edge cases.`,
  sales: ({ goal, tone }) =>
    `Act as a high-performing sales consultant. Create a ${tone} outreach strategy for ${goal}. Include a discovery approach, objection handling, follow-up sequence, sample opening message and conversion recommendations.`,
  operations: ({ goal, tone }) =>
    `Act as an operations manager. Design a ${tone} workflow for ${goal}. Include process steps, priority checkpoints, stakeholder responsibilities, a simple KPI list and risk mitigation suggestions.`
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function closeMenu() {
  navMenu.classList.remove('active');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
  const isActive = navMenu.classList.toggle('active');
  menuToggle.setAttribute('aria-expanded', String(isActive));
  document.body.classList.toggle('menu-open', isActive);
});

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

navDemoBtn.addEventListener('click', () => {
  showToast('Your demo request has been processed. We will contact you soon.');
  closeMenu();
});

watchPreviewBtn.addEventListener('click', () => {
  document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
  showToast('Live preview opened. Try generating a prompt below.');
});

promptForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const category = document.getElementById('category').value;
  const goal = document.getElementById('goal').value.trim();
  const tone = document.getElementById('tone').value;

  if (!goal) {
    showToast('Please enter an objective before generating a prompt.');
    document.getElementById('goal').focus();
    return;
  }

  loadingState.hidden = false;
  statusPill.textContent = 'Generating';

  setTimeout(() => {
    const template = promptTemplates[category];
    promptOutput.value = template({ goal, tone });
    loadingState.hidden = true;
    statusPill.textContent = 'Completed';
    showToast('Prompt generated successfully.');
  }, 950);
});

samplePromptBtn.addEventListener('click', () => {
  document.getElementById('category').value = 'marketing';
  document.getElementById('goal').value = 'launching a new AI productivity app';
  document.getElementById('tone').value = 'professional';
  promptOutput.value = promptTemplates.marketing({
    goal: 'launching a new AI productivity app',
    tone: 'professional'
  });
  statusPill.textContent = 'Example loaded';
  showToast('Example prompt loaded.');
});

clearPromptBtn.addEventListener('click', () => {
  promptForm.reset();
  promptOutput.value = 'Choose your category and objective to generate a polished prompt.';
  statusPill.textContent = 'Ready';
  loadingState.hidden = true;
  showToast('Form reset successfully.');
});

copyPromptBtn.addEventListener('click', async () => {
  const text = promptOutput.value.trim();

  if (!text || text === 'Choose your category and objective to generate a polished prompt.') {
    showToast('Generate a prompt before copying.');
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showToast('Prompt copied to clipboard.');
  } catch (error) {
    showToast('Copy failed. Please try again.');
  }
});

waitlistForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const nameInput = document.getElementById('nameInput');
  const emailInput = document.getElementById('emailInput');
  const goalSelect = document.getElementById('goalSelect');
  const consentInput = document.getElementById('consentInput');
  const submitBtn = waitlistForm.querySelector("button[type='submit']");
  const originalText = submitBtn.textContent;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const goal = goalSelect.value.trim();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name) {
    showToast('Please enter your name.');
    nameInput.focus();
    return;
  }

  if (!isValidEmail) {
    showToast('Please enter a valid email address.');
    emailInput.focus();
    return;
  }

  if (!goal) {
    showToast('Please select your main goal.');
    goalSelect.focus();
    return;
  }

  if (!consentInput.checked) {
    showToast('Please agree to receive updates before submitting.');
    consentInput.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  const formData = new FormData(waitlistForm);

  try {
    const response = await fetch(waitlistForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json'
      }
    });

    if (response.ok) {
      waitlistForm.reset();
      showToast("You're on the waitlist! We'll be in touch soon.");
    } else {
      showToast('Something went wrong. Please try again.');
    }
  } catch (error) {
    showToast('Connection error. Please try again later.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

function setPricing(mode) {
  const isMonthly = mode === 'monthly';
  monthlyBtn.classList.toggle('toggle-option--active', isMonthly);
  yearlyBtn.classList.toggle('toggle-option--active', !isMonthly);

  priceElements.forEach((price) => {
    price.textContent = isMonthly ? price.dataset.monthly : price.dataset.yearly;
  });
}

monthlyBtn.addEventListener('click', () => setPricing('monthly'));
yearlyBtn.addEventListener('click', () => setPricing('yearly'));

planButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showToast(`${button.dataset.plan} plan selected. Your request has been processed.`);
  });
});

faqQuestions.forEach((question) => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    item.classList.toggle('open');
  });
});
