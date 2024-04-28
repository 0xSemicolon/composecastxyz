<template>
  <v-card
    :class="{
      'py-4': true,
      preferred: !value.isStarred && !value.isReferred && value.isPreferred,
      referred: !value.isStarred && value.isReferred,
      starred: value.isStarred,
    }"
    color="surface"
    append-icon="mdi-open-in-new"
    rel="noopener noreferrer"
    rounded="lg"
    :subtitle="`Continue with ${value?.domain || '...'}`"
    target="_blank"
    :elevation="
      value.isReferred || value.isStarred ? 10 : value.isPreferred ? 8 : undefined
    "
  >
    <template #title>
      {{ value.productName || "..." }}
      <v-tooltip v-if="value.isStarred">
        <template #activator="{ props }">
          <v-icon color="#ffd700"  v-bind="props">mdi-star</v-icon>
        </template>
        <span class="text-black">You have starred this farcaster client.</span>
      </v-tooltip>
      <v-tooltip v-if="value.isReferred">
        <template #activator="{ props }">
          <v-icon color="#800080" v-bind="props">mdi-flash</v-icon>
        </template>
        <span class="text-black">This is the client of choice for the referrer.</span>
      </v-tooltip>
      <v-tooltip v-if="value.isPreferred">
        <template #activator="{ props }">
          <v-icon color="#800080" v-bind="props">mdi-check</v-icon>
        </template>
        <span class="text-black">This is an alternative preferred client for the referrer.</span>
      </v-tooltip>
    </template>
    <template #prepend>
      <v-avatar v-if="value" :rounded="value.imageTile ? 0 : undefined">
        <v-img :src="value.imageUrl" ></v-img>
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
  border: solid 1px gold;
}
.preferred {
  border: solid 1px #7a5d7a;
}
.referred {
  border: solid 1px #800080;
}
.starred.elevation-10 {
  box-shadow: 0px 6px 6px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 10px 14px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 4px 18px 3px var(--v-shadow-key-ambient-opacity, #938334) !important;
}
.elevation-10 {
  box-shadow: 0px 6px 6px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 10px 14px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 4px 18px 3px var(--v-shadow-key-ambient-opacity, rgb(172 46 46 / 65%)) !important;
}
.elevation-8 {
  box-shadow: 0px 5px 5px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 8px 10px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 3px 14px 2px var(--v-shadow-key-ambient-opacity, rgb(150 83 83 / 39%)) !important;
}
</style>
