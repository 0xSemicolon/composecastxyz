<template>
  <v-card
    :class="{
      'py-4': true,
      preferred: !isStarred && !isReferred && isPreferred,
      referred: !isStarred && isReferred,
      starred: isStarred,
    }"
    color="surface"
    append-icon="mdi-open-in-new"
    rel="noopener noreferrer"
    rounded="lg"
    :subtitle="`Continue with ${domain || '...'}`"
    target="_blank"
    :elevation="isReferred || isStarred ? 10 : isPreferred ? 8 : undefined"
  >
    <template #append>
      <v-tooltip v-if="isStarred">
        <template #activator="{ props }">
          <v-btn icon v-bind="props" @click.stop="toggleStar(false)">
            <v-icon color="#ffd700">mdi-star</v-icon>
          </v-btn>
        </template>
        <span class="text-black">You have starred this farcaster client.</span>
      </v-tooltip>
      <v-tooltip v-else>
        <template #activator="{ props }">
          <v-btn icon v-bind="props" @click.stop="toggleStar(true)">
            <v-icon>mdi-star-outline</v-icon>
          </v-btn>
        </template>
        <span class="text-black">You have starred this farcaster client.</span>
      </v-tooltip>
    </template>
    <template #title>
      {{ productName || "..." }}

      <v-tooltip v-if="isReferred">
        <template #activator="{ props }">
          <v-icon color="#800080" v-bind="props">mdi-flash</v-icon>
        </template>
        <span class="text-black">This is the client of choice for the referrer.</span>
      </v-tooltip>
      <v-tooltip v-if="isPreferred">
        <template #activator="{ props }">
          <v-icon color="#800080" v-bind="props">mdi-check</v-icon>
        </template>
        <span class="text-black"
          >This is an alternative preferred client for the referrer.</span
        >
      </v-tooltip>
    </template>
    <template #prepend>
      <v-avatar :rounded="imageTile ? 0 : undefined">
        <v-img :src="imageUrl"></v-img>
      </v-avatar>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import { defineProps, defineModel } from "vue";
import ComposeCastDb from "../databases/composeCastDb";
import { patchSourceConfig } from "../databases/sourceConfig";

const props = defineProps<{
  imageTile: boolean | undefined;
  imageUrl: string;
  domain: string;
  isReferred: boolean;
  isPreferred: boolean;
  productName: string;
}>();

const isStarred = defineModel<boolean>('isStarred');

const toggleStar = async (newIsStarred: boolean) => {
  await patchSourceConfig(ComposeCastDb, props.domain, {
    isStarred: newIsStarred,
  });
  isStarred.value = newIsStarred;
};
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
