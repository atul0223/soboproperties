'use strict';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const menuToggle = $('.menu-toggle');
const mobileMenu = $('#mobile-menu');
function closeMenu() {
  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  mobileMenu.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
$$('a', mobileMenu).forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileMenu.hidden) { closeMenu(); menuToggle.focus(); }
});
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
matchMedia('(min-width:768px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
$('#year').textContent = new Date().getFullYear();

const areas = {
  'Worli': {
    description: 'For a Mumbai life with the sea in the picture. Explore the streets around the seafront alongside the area’s changing residential skyline.',
    tips: ['Walk the stretch around your prospective home, not just the promenade.', 'Check the route to your regular destinations at the times you actually travel.', 'Ask about the building’s access, parking and shared spaces.']
  },
  'Malabar Hill': {
    description: 'Start with the quieter lanes, green pockets and coastal setting. Explore how a particular street and building fit your everyday routine.',
    tips: ['Walk the local streets to understand gradients and day-to-day access.', 'Visit at different times to see the light and street activity.', 'Check grocery shops, transport options and the needs of everyone moving with you.']
  },
  'Lower Parel': {
    description: 'A place to consider if you want work, restaurants and city activity close to your home. The right building and daily route can make a real difference.',
    tips: ['Try your actual commute during a normal working day.', 'Visit in the evening to understand traffic and noise near the building.', 'Look into daily essentials, delivery access and parking arrangements.']
  },
  'Prabhadevi': {
    description: 'Explore a neighborhood where residential streets meet the pace of the city. Look closely at the specific location to find the balance you want.',
    tips: ['Walk from the building to the transport options you expect to use.', 'Check the outlook, natural light and ventilation in the actual home.', 'Visit on a weekday and weekend to see how the immediate area changes.']
  }
};

const notes = {
  viewing: {
    title: 'Visit the home. Meet the neighborhood.',
    paragraphs: ['Start before you step inside. Walk the approach to the building, check the entrance, and get a feel for the immediate streets.', 'Inside, notice natural light, ventilation, ambient noise and how the rooms connect. Bring your own list of everyday needs, from a work corner to storage.', 'If a home stays on your shortlist, revisit at another time of day. A single viewing gives you a snapshot; a second visit can give you perspective.'],
    points: ['Take the journey you would actually make every day.', 'Look at shared areas and ask how maintenance is handled.', 'Ask permission before photographing an occupied home.', 'Write down questions while the visit is fresh.']
  },
  shortlist: {
    title: 'Your non-negotiables, before your shortlist.',
    paragraphs: ['Before you compare properties, compare priorities. Write down the things a new home needs to support in your everyday life.', 'Put each requirement in one of three groups: essential, useful, or a bonus. A clear list helps you recognize a good fit without being distracted by a single impressive feature.', 'Include everyone who will live there. A quiet workspace, lift access or proximity to family might matter more than an extra room.'],
    points: ['Set a comfortable budget range to discuss.', 'Choose the locations your routine depends on.', 'Define the space, access and facilities you need.', 'Keep a separate list of questions for each viewing.']
  },
  tradeoffs: {
    title: 'Make the trade-offs yours.',
    paragraphs: ['A view, an extra bedroom, a familiar neighborhood, a shorter commute. The difficult part is often choosing between good things.', 'Imagine an ordinary weekday in each home. Think about when you leave, where you work, who you see and what you want to come back to.', 'Your priorities can change as you explore. Revisit your list after each viewing and notice which details you keep thinking about.'],
    points: ['Rank the three things you would miss most.', 'Separate daily benefits from occasional ones.', 'Try the commute instead of relying on a map estimate.', 'Discuss your trade-offs openly before expanding the search.']
  }
};

let dialogOpener = null;
function openDialog(dialog, opener) {
  dialogOpener = opener || document.activeElement;
  closeMenu();
  dialog.showModal();
  document.body.classList.add('modal-open');
  dialog.scrollTop = 0;
}
$$('dialog').forEach(dialog => {
  $('.dialog-close', dialog).addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (!$('dialog[open]')) document.body.classList.remove('modal-open');
    dialogOpener?.focus();
  });
});

function listItems(items) {
  return items.map(text => { const li = document.createElement('li'); li.textContent = text; return li; });
}
let selectedArea = 'Open to suggestions';
$$('[data-area]').forEach(button => button.addEventListener('click', () => {
  selectedArea = button.dataset.area;
  const area = areas[selectedArea];
  $('#area-dialog-title').textContent = selectedArea;
  $('#area-description').textContent = area.description;
  $('#area-tips').replaceChildren(...listItems(area.tips));
  openDialog($('#area-dialog'), button);
}));

$$('[data-note]').forEach(button => button.addEventListener('click', () => {
  const note = notes[button.dataset.note];
  $('#note-title').textContent = note.title;
  const paragraphs = note.paragraphs.map(text => { const p = document.createElement('p'); p.textContent = text; return p; });
  const list = document.createElement('ul'); list.className = 'note-list';
  list.append(...listItems(note.points));
  $('#note-content').replaceChildren(...paragraphs, list);
  openDialog($('#note-dialog'), button);
}));
$('#note-contact').addEventListener('click', () => $('#note-dialog').close());

function applyFilter(updateUrl = true) {
  const data = new FormData($('#finder'));
  const lifestyle = String(data.get('lifestyle'));
  const intent = String(data.get('intent'));
  let count = 0;
  $$('[data-area]').forEach(tile => {
    tile.hidden = lifestyle !== 'all' && !tile.dataset.tags.split(' ').includes(lifestyle);
    if (!tile.hidden) count++;
  });
  $('#area-status').textContent = `Explore ${count} neighborhood ${count === 1 ? 'guide' : 'guides'} for your ${intent === 'rent' ? 'rental' : 'home'} search`;
  $('#brief-intent').value = intent;
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('intent', intent);
    url.searchParams.set('lifestyle', lifestyle);
    history.replaceState(null, '', url);
  }
}
function restoreFilters() {
  const params = new URLSearchParams(location.search);
  const intent = params.get('intent');
  if (['buy', 'rent'].includes(intent)) $(`input[name="intent"][value="${intent}"]`).checked = true;
  const lifestyle = params.get('lifestyle');
  if (['all', 'sea', 'connected', 'quiet'].includes(lifestyle)) $('#lifestyle').value = lifestyle;
  if (intent || lifestyle) applyFilter(false);
}
$('#finder').addEventListener('submit', event => { event.preventDefault(); applyFilter(); });
window.addEventListener('popstate', restoreFilters);
restoreFilters();

function showBrief(opener) {
  $('#brief-result').hidden = true;
  $('#brief-status').textContent = '';
  openDialog($('#brief-dialog'), opener);
}
$('#open-brief').addEventListener('click', event => showBrief(event.currentTarget));
$('.dialog-brief').addEventListener('click', () => {
  $('#area-dialog').close();
  $('#brief-area').value = selectedArea;
  showBrief($('#open-brief'));
});
$('#brief-form').addEventListener('input', () => {
  $('#brief-result').hidden = true;
  $('#brief-status').textContent = '';
});
$('#brief-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const budget = String(data.get('budget')).trim();
  const priorities = String(data.get('priorities')).trim();
  $('#brief-output').value = [
    'Hi SoBo! I’d like to talk about finding a place in Mumbai.',
    `Looking to: ${data.get('intent') === 'rent' ? 'Rent' : 'Buy'}`,
    `Preferred area: ${data.get('area')}`,
    `Space: ${data.get('size')}`,
    `Budget: ${budget || 'To discuss'}`,
    `What matters most: ${priorities || 'I’d like some help working this out.'}`,
    'Could you let me know the next steps?'
  ].join('\n');
  $('#brief-result').hidden = false;
  $('#brief-status').textContent = 'Your brief is ready. Copy it, then paste it into your Instagram conversation.';
  $('#brief-output').focus();
  $('#brief-output').select();
});
$('#copy-brief').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#brief-output').value);
    $('#brief-status').textContent = 'Copied. Open Instagram and paste your brief into a message to @soboproperty.';
  } catch {
    $('#brief-output').focus();
    $('#brief-output').select();
    $('#brief-status').textContent = 'Select the brief above and use your device’s Copy command. Then paste it into Instagram.';
  }
});

if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.animate([{ opacity: .35, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)' });
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });
  $$('.section-heading, .intro-main, .approach-copy, .journal-grid').forEach(element => observer.observe(element));
}
