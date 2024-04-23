<template>
  <ComposeScreen
    :referrer-url="referrer"
    :preferred="preferred"
    v-model:text="text"
    v-model:embeds="embeds"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { RouteLocationNormalizedLoaded, useRoute } from "vue-router";
import ComposeScreen from "../components/ComposeScreen.vue";

const route = useRoute();

const cleanUrl = (url: string | undefined | null) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};
const calcReferrer = (r: RouteLocationNormalizedLoaded) =>
  document.referrer || cleanUrl(route.query["referrer"]?.toString());
const calcPreferred = (r: RouteLocationNormalizedLoaded) =>
  (route.query["preferred[]"]?.toString().split(",") || []).map((r:string) => cleanUrl(r));
const calcText = (r: RouteLocationNormalizedLoaded) =>
  route.query["text"]?.toString() || "";
const calcEmbeds = (r: RouteLocationNormalizedLoaded) =>
  route.query["embeds[]"]?.toString().split(",") || [];

const referrer = ref<string>(calcReferrer(route));
const text = ref<string>(calcText(route));
const embeds = ref<string[]>(calcEmbeds(route));
const preferred = ref<string[]>(calcPreferred(route));
watch(
  route,
  (r: RouteLocationNormalizedLoaded) => {
    text.value = calcText(r);
    embeds.value = calcEmbeds(r);
    referrer.value = calcReferrer(r);
    preferred.value = calcPreferred(r);
  },
  { deep: true }
);
</script>
