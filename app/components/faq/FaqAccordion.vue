<template>
  <div id="accordionExample">
    <div v-for="group in groups" :key="group.title" class="faq-group">
      <h2 class="title h2">{{ group.title }}</h2>
      <div v-for="item in group.items" :key="item.question" class="faq-body">
        <h4
          class="panel-title"
          :class="{ active: openQuestion === item.question }"
          :aria-expanded="openQuestion === item.question ? 'true' : 'false'"
          @click="toggle(item.question)"
        >
          {{ item.question }}
        </h4>
        <div v-show="openQuestion === item.question" class="panel-content">
          {{ item.answer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  groups: { type: Array, required: true },
});

const openQuestion = ref(null);

function toggle(question) {
  openQuestion.value = openQuestion.value === question ? null : question;
}
</script>
