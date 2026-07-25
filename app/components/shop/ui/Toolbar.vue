<template>
  <div class="toolbar">
    <div class="filters-toolbar-wrapper">
      <div class="row">
        <div
          class="col-4 col-md-4 col-lg-4 filters-toolbar__item collection-view-as d-flex justify-content-start align-items-center"
        >
          <a
            href="#"
            title="Grid View"
            class="change-view"
            :class="{ 'change-view--active': view === 'grid' }"
            @click.prevent="$emit('update:view', 'grid')"
          >
            <img src="/images/grid.jpg" alt="Grid" />
          </a>
          <a
            href="#"
            title="List View"
            class="change-view"
            :class="{ 'change-view--active': view === 'list' }"
            @click.prevent="$emit('update:view', 'list')"
          >
            <img src="/images/list.jpg" alt="List" />
          </a>
        </div>
        <div
          class="col-4 col-md-4 col-lg-4 text-center filters-toolbar__item filters-toolbar__item--count d-flex justify-content-center align-items-center"
        >
          <span class="filters-toolbar__product-count"
            >Showing: {{ productCount }}</span
          >
        </div>
        <div class="col-4 col-md-4 col-lg-4 text-right">
          <div class="filters-toolbar__item">
            <label for="SortBy" class="hidden">Sort</label>
            <select
              id="SortBy"
              class="filters-toolbar__input filters-toolbar__input--sort"
              :value="sortBy"
              @change="$emit('update:sort', $event.target.value)"
            >
              <option value="manual">Sort</option>
              <option value="best-selling">Best Selling</option>
              <option value="title-ascending">Alphabetically, A-Z</option>
              <option value="title-descending">Alphabetically, Z-A</option>
              <option value="price-ascending">Price, low to high</option>
              <option value="price-descending">Price, high to low</option>
              <option value="created-descending">Date, new to old</option>
              <option value="created-ascending">Date, old to new</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  view: { type: String, default: "grid" },
  productCount: { type: Number, required: true },
  sortBy: { type: String, default: "manual" },
});

defineEmits(["update:view", "update:sort"]);
</script>
