<template>
  <v-img class="mb-4 mt-10" height="70" src="/images/farcaster.svg" />
  <div class="text-center pb-4">
    <div class="text-body-1 font-weight-light mb-n1">
      {{ topText }}
    </div>
    <h1 class="text-h4 font-weight-bold">Share this cast</h1>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";
const props = defineProps<{ referrerUrl: string | null }>();

const topText = computed(() => {
  if (props.referrerUrl) {
    try {
      return `${new URL(props.referrerUrl).host} wants you to`;
    } catch {}
  }
  return "Continue if you want to";
});
</script>
