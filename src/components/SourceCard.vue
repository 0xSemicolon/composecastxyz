<template>
  <v-card
    :class="{
      'py-4': true,
      preferred: !value.isReferred && value.isPreferred,
      referred: value.isReferred,
    }"
    color="surface"
    append-icon="mdi-open-in-new"
    rel="noopener noreferrer"
    rounded="lg"
    :subtitle="`Continue with ${value?.domain || '...'}`"
    target="_blank"
  >
    <template #title>
      {{ value.productName || "..." }}
      <v-icon color="#ffd700">mdi-star</v-icon>
    </template>
    <template #prepend>
      <v-avatar v-if="value">
        <v-img :src="value.imageUrl"></v-img>
      </v-avatar>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import { IOrderedSource } from "@/sources/index";
defineProps<{ value: IOrderedSource | undefined }>();
</script>

<style scoped>
.starred {
  border: solid 1px gold
}
.preferred {
  border: solid 1px #7a5d7a;
}
.referred {
  border: solid 1px #800080;
}
</style>
