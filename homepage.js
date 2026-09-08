const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');

const readSavedTheme = () => {
  try {
    return localStorage.getItem('zhenhao-theme');
  } catch {
    return null;
  }
};

const applyTheme = (theme) => {
  const isDark = theme === 'dark';

  if (isDark) {
    root.dataset.theme = 'dark';
  } else {
    delete root.dataset.theme;
  }

  if (themeToggle) {
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
    themeToggle.title = `Switch to ${isDark ? 'light' : 'dark'} theme`;

    const icon = themeToggle.querySelector('span');
    if (icon) icon.textContent = isDark ? '☀' : '◐';
  }

  if (themeColor) {
    themeColor.content = isDark ? '#111311' : '#fafaf8';
  }
};

const savedTheme = readSavedTheme();
const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

themeToggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);

  try {
    localStorage.setItem('zhenhao-theme', nextTheme);
  } catch {
    // The visual theme still changes when storage is unavailable.
  }
});

const publicationList = document.querySelector('.publication-list');
const publications = [...document.querySelectorAll('.publication')];
const filterButtons = [...document.querySelectorAll('.filter button')];
const sortButton = document.querySelector('.sort-control');
const publicationStatus = document.querySelector('.publication-status');
let currentPublicationFilter = 'selected';
let sortByNewsDate = false;

publications.forEach((publication, index) => {
  publication.dataset.originalOrder = String(index);
});

const updatePublications = () => {
  if (!publicationList) return;

  const orderedPublications = [...publications].sort((a, b) => {
    if (sortByNewsDate) {
      return b.dataset.newsDate.localeCompare(a.dataset.newsDate)
        || Number(a.dataset.originalOrder) - Number(b.dataset.originalOrder);
    }

    return Number(a.dataset.originalOrder) - Number(b.dataset.originalOrder);
  });

  let visibleCount = 0;
  orderedPublications.forEach((publication) => {
    publicationList.appendChild(publication);
    publication.hidden = currentPublicationFilter === 'selected'
      && publication.dataset.selected !== 'true';
    if (!publication.hidden) visibleCount += 1;
  });

  if (publicationStatus) {
    publicationStatus.textContent = `${visibleCount} shown`;
  }
};

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentPublicationFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });

    updatePublications();
  });
});

sortButton?.addEventListener('click', () => {
  sortByNewsDate = !sortByNewsDate;
  sortButton.classList.toggle('active', sortByNewsDate);
  sortButton.setAttribute('aria-pressed', String(sortByNewsDate));
  sortButton.setAttribute(
    'aria-label',
    sortByNewsDate ? 'Restore curated publication order' : 'Sort publications by newest first'
  );

  const orderLabel = sortButton.querySelector('strong');
  if (orderLabel) orderLabel.textContent = sortByNewsDate ? 'Newest' : 'Curated';
  updatePublications();
});

updatePublications();

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
