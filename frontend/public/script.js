(() => {
  const BASE_URL = 'http://54.90.148.56:3222';

  /** DOM Elements **/
  const historyList = document.getElementById('historyList');
  const recipeContentEl = document.getElementById('recipeContent');
  const recipeTitleEl = document.getElementById('recipeTitle');
  const newRecipeBtn = document.getElementById('newRecipeBtn');
  const createBtn = document.getElementById('createBtn');
  const promptInput = document.getElementById('promptInput');
  const saveBtn = document.getElementById('saveBtn');
  const deleteBtn = document.getElementById('deleteBtn');

  /** State **/
  /** @typedef {{ _id: string, messages: string, time?: string, title?: string }} Recipe */
  /** @type {Recipe[]} */
  let recipes = [];
  /** @type {Recipe | null} */
  let selectedRecipe = null;

  /** Helpers **/
  function formatDate(ts) {
    try {
      if (!ts) return '';
      const d = new Date(ts);
      return d.toLocaleString();
    } catch { return ''; }
  }

  function deriveTitleFromMessage(message) {
    const firstLine = (message || '').split('\n')[0].trim();
    if (!firstLine) return 'Untitled Recipe';
    return firstLine.length > 60 ? firstLine.slice(0, 57) + '…' : firstLine;
  }

  function setButtonsEnabled(enabled) {
    saveBtn.disabled = !enabled;
    deleteBtn.disabled = !enabled;
  }

  function renderHistory() {
    historyList.innerHTML = '';
    const tpl = document.getElementById('historyItemTemplate');
    recipes.forEach((r) => {
      const clone = tpl.content.firstElementChild.cloneNode(true);
      const title = r.title || deriveTitleFromMessage(r.messages);
      clone.querySelector('.item-title').textContent = title;
      clone.querySelector('.item-meta').textContent = formatDate(r.time);
      clone.addEventListener('click', () => selectRecipe(r._id));
      if (selectedRecipe && selectedRecipe._id === r._id) {
        clone.classList.add('active');
      }
      historyList.appendChild(clone);
    });
  }

  function renderSelected() {
    recipeContentEl.innerHTML = '';
    if (!selectedRecipe) {
      recipeContentEl.innerHTML = `
        <div class="empty-state">
          <h2>Welcome to KookGuide</h2>
          <p>Create a recipe or select one from the history.</p>
        </div>`;
      recipeTitleEl.value = '';
      setButtonsEnabled(false);
      return;
    }
    const title = selectedRecipe.title || deriveTitleFromMessage(selectedRecipe.messages);
    recipeTitleEl.value = title;
    const block = document.createElement('article');
    block.className = 'message';
    block.innerText = selectedRecipe.messages || '';
    recipeContentEl.appendChild(block);
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = `Updated ${formatDate(selectedRecipe.time)}`;
    recipeContentEl.appendChild(meta);
    setButtonsEnabled(true);
  }

  /** API **/
  async function apiGetRecipes() {
    const res = await fetch(`${BASE_URL}/recipes`);
    if (!res.ok) throw new Error('Failed to fetch recipes');
    /** @type {Recipe[]} */
    const data = await res.json();
    return data;
  }

  async function apiCreateRecipe(prompt) {
    const res = await fetch(`${BASE_URL}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('Failed to create recipe');
  }

  async function apiUpdateRecipe(id, prompt) {
    const res = await fetch(`${BASE_URL}/recipes`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, prompt })
    });
    if (!res.ok) throw new Error('Failed to update recipe');
  }

  async function apiDeleteRecipe(id) {
    const res = await fetch(`${BASE_URL}/recipes`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (!res.ok) throw new Error('Failed to delete recipe');
  }

  /** Interactions **/
  async function refreshHistory(keepSelection = false) {
    const prevSelectedId = keepSelection && selectedRecipe ? selectedRecipe._id : null;
    recipes = await apiGetRecipes();
    if (prevSelectedId) {
      selectedRecipe = recipes.find(r => r._id === prevSelectedId) || null;
    } else if (!selectedRecipe && recipes.length) {
      selectedRecipe = recipes[0];
    }
    renderHistory();
    renderSelected();
  }

  async function selectRecipe(id) {
    selectedRecipe = recipes.find(r => r._id === id) || null;
    renderHistory();
    renderSelected();
  }

  async function handleCreate() {
    const prompt = promptInput.value.trim();
    // if (!prompt) return;
    // console.log(prompt)
    // createBtn.disabled = true;
    // createBtn.textContent = 'Creating…';
    try {
      await apiCreateRecipe(prompt);
      promptInput.value = '';
      await refreshHistory(true);
    } catch (e) {
      alert(e.message || 'Error creating recipe');
    } finally {
      createBtn.disabled = false;
      createBtn.textContent = 'Create';
    }
  }

  async function handleSave() {
    if (!selectedRecipe) return;
    const newTitle = recipeTitleEl.value.trim();
    if (!newTitle) return;
    const newPrompt = `${newTitle}\n\n${promptInput.value.trim()}`;
    saveBtn.disabled = true;

    console.log(newPrompt);
    try {
      await apiUpdateRecipe(selectedRecipe._id, newPrompt);
      await refreshHistory(true);
    } catch (e) {
      alert(e.message || 'Error saving recipe');
    } finally {
      saveBtn.disabled = false;
    }
  }

  async function handleDelete() {
    if (!selectedRecipe) return;
    if (!confirm('Delete this recipe?')) return;
    deleteBtn.disabled = true;
    try {
      await apiDeleteRecipe(selectedRecipe._id);
      selectedRecipe = null;
      await refreshHistory(false);
    } catch (e) {
      alert(e.message || 'Error deleting recipe');
    } finally {
      deleteBtn.disabled = false;
    }
  }

  /** Auto-resize textarea and keybindings **/
  function autoResizeTextarea(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }
  promptInput.addEventListener('input', () => autoResizeTextarea(promptInput));
  promptInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleCreate();
    }
  });

  /** Wire events **/
  createBtn.addEventListener('click', handleCreate);
  newRecipeBtn.addEventListener('click', () => promptInput.focus());
  saveBtn.addEventListener('click', handleSave);
  deleteBtn.addEventListener('click', handleDelete);

  /** Init **/
  refreshHistory().catch((e) => {
    console.error(e);
    recipeContentEl.innerHTML = `<div class="empty-state"><p>Cannot load recipes. Is the backend running on ${BASE_URL}?</p></div>`;
  });
})();


