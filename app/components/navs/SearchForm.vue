<template>
  <div ref="searchEl" class="search" :class="{ 'search--opened': isSearchOpen }">
    <div class="search__form">
      <form class="search-bar__form" action="#" @submit.prevent="handleSearch">
        <button class="go-btn search__button" type="submit">
          <i class="icon anm anm-search-l"></i>
        </button>
        <input
          ref="inputEl"
          v-model="query"
          class="search__input"
          type="search"
          name="q"
          placeholder="Search entire store..."
          aria-label="Search"
          autocomplete="off"
        />
      </form>
      <button type="button" class="search-trigger close-btn" @click="closeSearch">
        <i class="anm anm-times-l"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
const { isSearchOpen, closeSearch } = useUiState();
const query = ref("");
const searchEl = ref(null);
const inputEl = ref(null);

watch(isSearchOpen, (open) => {
  if (open) nextTick(() => inputEl.value?.focus());
});

function handleSearch() {
  if (!query.value.trim()) return;
  navigateTo({ path: "/shop", query: { search: query.value.trim() } });
  closeSearch();
}

function handleClickOutside(event) {
  if (!isSearchOpen.value) return;
  const target = event.target;
  const clickedInside = searchEl.value?.contains(target);
  const clickedTrigger = target.closest?.(".search-trigger");
  if (!clickedInside && !clickedTrigger) {
    closeSearch();
  }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", handleClickOutside));
</script>
