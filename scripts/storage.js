(function(){
  const STORAGE_KEY = 'todolist.tasks.v1';

  function load(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { version: 1, tasks: [] };
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || !Array.isArray(data.tasks)) {
        return { version: 1, tasks: [] };
      }
      return data;
    } catch (e) {
      console.warn('Storage load failed, using empty list', e);
      return { version: 1, tasks: [] };
    }
  }

  function save(state){
    try {
      const payload = JSON.stringify({ version: 1, tasks: state.tasks });
      localStorage.setItem(STORAGE_KEY, payload);
      return true;
    } catch (e) {
      console.error('Storage save failed', e);
      return false;
    }
  }

  window.StorageAPI = { STORAGE_KEY, load, save };
})();
