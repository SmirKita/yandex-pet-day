const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const modalBackdrop = document.querySelector('.modal-backdrop');
const modal = document.querySelector('.modal');
const toast = document.querySelector('.toast');
let lastFocusedElement = null;

function closeMenu() {
  menuButton?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  document.body.classList.toggle('menu-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.querySelectorAll('input[name="format"]').forEach((radio) => {
  radio.addEventListener('change', () => {
    const isOffline = radio.value === 'offline';
    document.querySelectorAll('.format-options label').forEach((label) => label.classList.remove('active'));
    radio.closest('label')?.classList.add('active');
    document.querySelector('.format-hint').textContent = isOffline
      ? 'Количество мест ограничено'
      : 'Пришлём ссылку на трансляцию на почту за час до начала';
  });
});

function syncFormatChoice() {
  const selected = document.querySelector('input[name="format"]:checked');
  if (!selected) return;
  document.querySelectorAll('.format-options label').forEach((label) => label.classList.remove('active'));
  selected.closest('label')?.classList.add('active');
  document.querySelector('.format-hint').textContent = selected.value === 'offline'
    ? 'Количество мест ограничено'
    : 'Пришлём ссылку на трансляцию на почту за час до начала';
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 4500);
}

function validationMessage(field) {
  if (field.validity.valueMissing) {
    if (field.name === 'name') return 'Введите имя.';
    if (field.name === 'email') return 'Введите электронную почту.';
    if (field.name === 'question') return 'Опишите ваш вопрос.';
  }
  if (field.validity.typeMismatch && field.type === 'email') return 'Введите почту в формате name@example.com.';
  return 'Проверьте правильность заполнения поля.';
}

function setFieldError(field) {
  const error = field.form?.querySelector(`#${field.getAttribute('aria-describedby')}`);
  const invalid = !field.validity.valid;
  field.setAttribute('aria-invalid', String(invalid));
  if (error) error.textContent = invalid ? validationMessage(field) : '';
  return invalid;
}

function clearFormErrors(form) {
  form.querySelectorAll('[aria-invalid]').forEach((field) => field.removeAttribute('aria-invalid'));
  form.querySelectorAll('.field-error').forEach((error) => { error.textContent = ''; });
}

document.querySelectorAll('form[novalidate] input[required], form[novalidate] textarea[required]').forEach((field) => {
  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') setFieldError(field);
  });
  field.addEventListener('blur', () => {
    if (field.value) setFieldError(field);
  });
});

function validateAndSubmit(event, message) {
  event.preventDefault();
  const form = event.currentTarget;
  const fields = [...form.querySelectorAll('input[required], textarea[required]')];
  let firstInvalid = null;
  fields.forEach((field) => {
    if (setFieldError(field) && !firstInvalid) firstInvalid = field;
  });
  if (firstInvalid) {
    firstInvalid.focus();
    return;
  }
  form.reset();
  clearFormErrors(form);
  if (form.id === 'registration-form') window.requestAnimationFrame(syncFormatChoice);
  showToast(message);
  if (form.id === 'question-form') closeModal();
}

document.querySelector('#registration-form')?.addEventListener('submit', (event) => validateAndSubmit(event, 'Готово! Это демонстрация — данные никуда не отправлены.'));
document.querySelector('#question-form')?.addEventListener('submit', (event) => validateAndSubmit(event, 'Вопрос принят. Это демонстрация — данные никуда не отправлены.'));

function openModal() {
  lastFocusedElement = document.activeElement;
  modalBackdrop.hidden = false;
  document.body.classList.add('modal-open');
  modal.querySelector('input')?.focus();
}

function closeModal() {
  modalBackdrop.hidden = true;
  document.body.classList.remove('modal-open');
  lastFocusedElement?.focus();
}

document.querySelector('[data-open-modal]')?.addEventListener('click', openModal);
document.querySelector('[data-close-modal]')?.addEventListener('click', closeModal);
modalBackdrop?.addEventListener('mousedown', (event) => { if (event.target === modalBackdrop) closeModal(); });

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (!modalBackdrop.hidden) closeModal();
    closeMenu();
  }
  if (event.key === 'Tab' && !modalBackdrop.hidden) {
    const focusable = [...modal.querySelectorAll('button, input, textarea')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)');
const heroArt = document.querySelector('.hero-art');
const mascotHead = document.querySelector('.mascot-head');
let mascotFrame = 0;

function resetMascotLook() {
  mascotHead?.style.setProperty('--look-x', '0px');
  mascotHead?.style.setProperty('--look-y', '0px');
  mascotHead?.style.setProperty('--head-turn', '0deg');
}

heroArt?.addEventListener('pointermove', (event) => {
  if (!mascotHead || reducedMotion.matches || !precisePointer.matches) return;
  window.cancelAnimationFrame(mascotFrame);
  mascotFrame = window.requestAnimationFrame(() => {
    const area = heroArt.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((event.clientX - area.left) / area.width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((event.clientY - area.top) / area.height - 0.5) * 2));
    mascotHead.style.setProperty('--look-x', `${(x * 4).toFixed(2)}px`);
    mascotHead.style.setProperty('--look-y', `${(y * 3).toFixed(2)}px`);
    mascotHead.style.setProperty('--head-turn', `${(x * 2).toFixed(2)}deg`);
  });
});
heroArt?.addEventListener('pointerleave', resetMascotLook);
precisePointer.addEventListener?.('change', resetMascotLook);
reducedMotion.addEventListener?.('change', resetMascotLook);

const speakerPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const speakerCards = [...document.querySelectorAll('.speaker-card')];

function resetSpeakerReaction(card) {
  card.style.setProperty('--speaker-look-x', '0px');
  card.style.setProperty('--speaker-look-y', '0px');
  card.style.setProperty('--speaker-head-turn', '0deg');
  card.style.setProperty('--speaker-ear-turn', '0deg');
  card.style.setProperty('--speaker-accessory-x', '0px');
  card.style.setProperty('--speaker-accessory-y', '0px');
  card.style.setProperty('--speaker-accessory-turn', '0deg');
}

speakerCards.forEach((card) => {
  let frame = 0;
  card.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || !speakerPointer.matches) return;
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      const area = card.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - area.left) / area.width - 0.5) * 2));
      const y = Math.max(-1, Math.min(1, ((event.clientY - area.top) / area.height - 0.5) * 2));
      const accessoryStrength = card.querySelector('.bow-tie') ? 3 : card.querySelector('.glasses') ? 2 : 1.5;
      card.style.setProperty('--speaker-look-x', `${(x * 3.5).toFixed(2)}px`);
      card.style.setProperty('--speaker-look-y', `${(y * 2.3).toFixed(2)}px`);
      card.style.setProperty('--speaker-head-turn', `${(x * 0.7).toFixed(2)}deg`);
      card.style.setProperty('--speaker-ear-turn', `${(x * 1.2).toFixed(2)}deg`);
      card.style.setProperty('--speaker-accessory-x', `${(x * 2.2).toFixed(2)}px`);
      card.style.setProperty('--speaker-accessory-y', `${(y * 1.4).toFixed(2)}px`);
      card.style.setProperty('--speaker-accessory-turn', `${((x + y * 0.2) * accessoryStrength).toFixed(2)}deg`);
    });
  });
  card.addEventListener('pointerleave', () => {
    window.cancelAnimationFrame(frame);
    resetSpeakerReaction(card);
  });
});

function resetAllSpeakerReactions() {
  speakerCards.forEach(resetSpeakerReaction);
}

speakerPointer.addEventListener?.('change', resetAllSpeakerReactions);
reducedMotion.addEventListener?.('change', resetAllSpeakerReactions);

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const peekObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.peeked) return;
      entry.target.dataset.peeked = 'true';
      window.setTimeout(() => entry.target.classList.add('is-peeking'), 100);
      window.setTimeout(() => entry.target.classList.remove('is-peeking'), 4000);
      peekObserver.unobserve(entry.target);
    });
  }, { threshold: 0.34 });
  document.querySelectorAll('.intro, .speakers, .venue, .faq').forEach((section) => peekObserver.observe(section));
}

const microPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const magneticButtons = [...document.querySelectorAll('.header-cta, .hero-actions a[href="#register"], .registration-form button[type="submit"]')];

function resetMagneticButton(button) {
  button.style.setProperty('--mag-x', '0px');
  button.style.setProperty('--mag-y', '0px');
}

magneticButtons.forEach((button) => {
  button.classList.add('pet-magnetic');
  button.addEventListener('pointermove', (event) => {
    if (!microPointer.matches || reducedMotion.matches) return;
    const area = button.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((event.clientX - area.left) / area.width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((event.clientY - area.top) / area.height - 0.5) * 2));
    button.style.setProperty('--mag-x', `${(x * 5).toFixed(2)}px`);
    button.style.setProperty('--mag-y', `${(y * 3).toFixed(2)}px`);
  });
  button.addEventListener('pointerleave', () => resetMagneticButton(button));
  button.addEventListener('click', (event) => {
    if (reducedMotion.matches) return;
    const burst = document.createElement('span');
    burst.className = 'paw-burst';
    burst.setAttribute('aria-hidden', 'true');
    burst.style.left = `${event.clientX}px`;
    burst.style.top = `${event.clientY}px`;
    burst.innerHTML = '<i></i><i></i><i></i>';
    document.body.append(burst);
    window.setTimeout(() => burst.remove(), 650);
  });
});

const tapReactionTargets = [...document.querySelectorAll('.register-stamp, .benefit-card, .schedule-row, .venue-map, .footer-paw, summary')];
tapReactionTargets.forEach((target) => {
  target.addEventListener('pointerdown', () => {
    if (microPointer.matches || reducedMotion.matches) return;
    target.classList.remove('is-pet-tap');
    window.requestAnimationFrame(() => target.classList.add('is-pet-tap'));
    window.setTimeout(() => target.classList.remove('is-pet-tap'), 720);
  });
});

function resetNewMicrointeractions() {
  magneticButtons.forEach(resetMagneticButton);
  tapReactionTargets.forEach((target) => target.classList.remove('is-pet-tap'));
  document.querySelectorAll('.paw-burst').forEach((burst) => burst.remove());
}

microPointer.addEventListener?.('change', resetNewMicrointeractions);
reducedMotion.addEventListener?.('change', resetNewMicrointeractions);
