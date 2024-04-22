<template>
  <ComposeScreen :referrer-url="referrer" v-model:text="text" v-model:embeds="embeds" />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { RouteLocationNormalizedLoaded, useRoute } from "vue-router";
import ComposeScreen from "../components/ComposeScreen.vue";

const route = useRoute();

const calcReferrer = (r: RouteLocationNormalizedLoaded) =>
  document.referrer || route.query["referrer"]?.toString() || "";
const calcText = (r: RouteLocationNormalizedLoaded) =>
  route.query["text"]?.toString() || "";
const calcEmbeds = (r: RouteLocationNormalizedLoaded) =>
  route.query["embeds[]"]?.toString().split(",") || [];

const referrer = ref<string>(calcReferrer(route));
const text = ref<string>(calcText(route));
const embeds = ref<string[]>(calcEmbeds(route));
watch(
  route,
  (r: RouteLocationNormalizedLoaded) => {
    text.value = calcText(r);
    embeds.value = calcEmbeds(r);
    referrer.value = calcReferrer(r);
  },
  { deep: true }
);
</script>
