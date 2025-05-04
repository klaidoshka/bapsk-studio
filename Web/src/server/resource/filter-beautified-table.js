const filters = [];
let currentColumn = null;
let dialog = null;

document.querySelectorAll('th').forEach(th => {
  th.addEventListener('click', () => {
    const column = parseInt(th.dataset.col);
    const existing = filters.find(f => f.col === column);

    currentColumn = column;

    showFilterDialog(th, existing ? existing.value : "");
  });

  th.addEventListener('mouseenter', () => {
    const column = parseInt(th.dataset.col);
    const f = filters.find(f => f.col === column);

    if (f) {
      th.setAttribute('title', f.value);
    }
  });

  th.addEventListener('mouseleave', () => {
    th.removeAttribute('title');
  });
});

function showFilterDialog(th, presetValue = "") {
  closeFilterDialog();

  dialog = document.createElement('div');
  dialog.className = 'fixed bg-white shadow-md p-4 rounded z-50';
  dialog.style.top = (th.getBoundingClientRect().bottom + window.scrollY + 10)
    + 'px';
  dialog.style.left = (th.getBoundingClientRect().left + window.scrollX) + 'px';
  dialog.innerHTML = `
    <input type="text" class="w-full px-4 py-2 border-none rounded bg-zinc-100 text-sm" id="filterInput" value="${presetValue}" placeholder="Enter filter value..." />
    <div class="flex justify-between mt-3">
      <button id="resetFilter" class="w-[48%] bg-black text-white font-xl py-2 rounded hover:bg-black/90 hover:cursor-pointer transition-all">Reset</button>
      <button id="applyFilter" class="w-[48%] bg-black text-white font-xl py-2 rounded hover:bg-black/90 hover:cursor-pointer transition-all">Filter</button>
    </div>
  `;

  document.body.appendChild(dialog);

  const filterInput = document.getElementById("filterInput");

  filterInput.focus();
  filterInput.selectionStart = filterInput.selectionEnd = filterInput.value.length;

  document.getElementById("filterInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      applyFilter();
    }
  });

  document.getElementById("applyFilter").addEventListener("click", applyFilter);
  document.getElementById("resetFilter").addEventListener("click", resetFilter);
  document.addEventListener("click", outsideClick, true);
}

function outsideClick(e) {
  if (dialog && !dialog.contains(e.target)) {
    closeFilterDialog();
  }
}

function closeFilterDialog() {
  if (dialog) {
    dialog.remove();
    dialog = null;
    document.removeEventListener("click", outsideClick, true);
  }
}

function applyFilter() {
  const input = document.getElementById("filterInput");
  const value = input.value.trim().toLowerCase();
  const existingIndex = filters.findIndex(f => f.col === currentColumn);

  if (value) {
    if (existingIndex >= 0) {
      filters[existingIndex].value = value;
    } else {
      filters.push({col: currentColumn, value: value});
    }
  } else {
    if (existingIndex >= 0) {
      filters.splice(existingIndex, 1);
    }
  }

  updateFilterIndicators();
  applyFilters();
  closeFilterDialog();
}

function resetFilter() {
  document.getElementById("filterInput").value = "";
  applyFilter();
}

function updateFilterIndicators() {
  document.querySelectorAll('th').forEach(th => {
    const column = parseInt(th.dataset.col);
    const indicator = th.querySelector('.filter-index');
    const index = filters.findIndex(f => f.col === column);

    if (index >= 0) {
      indicator.textContent = (index + 1).toString();
    } else {
      indicator.textContent = "";
    }
  });
}

function applyFilters() {
  const headerProvided = document.querySelector('thead th') !== null;
  const rows = document.querySelectorAll('tbody tr');

  rows.forEach((row, i) => {
    if (!headerProvided && i === 0) {
      return;
    }

    let visible = true;

    for (const f of filters) {
      const data = row.querySelectorAll('td')[f.col];

      if (!data || !data.textContent.toLowerCase().includes(f.value)) {
        visible = false;
        break;
      }
    }

    row.style.display = visible ? '' : 'none';
  });
}
