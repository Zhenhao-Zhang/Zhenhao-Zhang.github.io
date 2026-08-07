const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('zhenhao-theme');

if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  root.dataset.theme = 'dark';
}

themeToggle.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = nextTheme;
  localStorage.setItem('zhenhao-theme', nextTheme);
});

const publicationList = document.querySelector('.publication-list');
const publications = [...document.querySelectorAll('.publication')];
const filterButtons = document.querySelectorAll('.filter button');
const sortButton = document.querySelector('.sort-control');
let currentPublicationFilter = 'selected';
let sortByNewestYear = false;

publications.forEach((publication, index) => {
  publication.dataset.originalOrder = String(index);
});

const updatePublications = () => {
  const orderedPublications = [...publications].sort((a, b) => {
    if (sortByNewestYear) {
      return Number(b.dataset.year) - Number(a.dataset.year) || Number(a.dataset.originalOrder) - Number(b.dataset.originalOrder);
    }
    return Number(a.dataset.originalOrder) - Number(b.dataset.originalOrder);
  });

  orderedPublications.forEach((publication) => {
    publicationList.appendChild(publication);
    publication.hidden = currentPublicationFilter === 'selected' && publication.dataset.selected !== 'true';
  });
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

sortButton.addEventListener('click', () => {
  sortByNewestYear = true;
  sortButton.classList.add('active');
  sortButton.setAttribute('aria-pressed', 'true');
  updatePublications();
});

updatePublications();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();
