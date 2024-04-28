<template>
  <v-dialog v-model="model" :max-width="600">
    <v-card v-if="model && redirectSource">
      <v-card-title class="text-h4 text-center pt-7 pb-4">
        <v-avatar :rounded="redirectSource.imageTile ? 0 : undefined">
          <v-img :src="redirectSource.imageUrl"></v-img>
        </v-avatar>
        {{ redirectSource.productName }}</v-card-title
      >
      <v-card-text>
        <v-alert
          v-if="hasTemplate"
          border
          color="primary"
          class="text-h6 px-4 py-6 text-white"
          icon="mdi-format-align-left"
          variant="tonal"
        >
          {{ text }}
          <span class="text-primary" v-for="(e, i) in embeds || []" :key="i">
            {{ e }}</span
          >
        </v-alert>
        <v-checkbox
          label="Star this as one of your preferred client"
          color="orange"
          class="text-h6"
          v-model="isStarred"
          hide-details
        ></v-checkbox>
        <v-checkbox
          :label="`Automatically redirect if coming from ${redirectSource.productName}`"
          class="text-h6"
          v-model="automaticallyContinue"
          hide-details
        ></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          color="primary"
          variant="elevated"
          @click="clickContinue()"
          target="_blank"
        >
          Continue to {{ redirectSource.domain }}
          <v-icon end>mdi-arrow-right-bold</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { defineModel, defineProps, computed, watch, ref } from "vue";
import { IRedirectSource } from "@/sources/types";
import ComposeCastDb from "../databases/composeCastDb";
import { patchSourceConfig, getSourceConfig } from "../databases/sourceConfig";

const model = defineModel<boolean>();
const props = defineProps<{
  source: IRedirectSource | null;
  text: string | undefined;
  embeds: string[] | undefined;
}>();
const targetUrl = ref<string>("");
const isStarred = ref<boolean>(false);
const automaticallyContinue = ref<boolean>(false);

const hasTemplate = computed<boolean>(() => {
  return !!(props.text || props.embeds?.length);
});

const redirectSource = computed<IRedirectSource | null>(() => {
  if (!props.source) return null;
  if (!("fulfilmentType" in props.source)) return null;
  if (props.source.fulfilmentType !== "redirect") return null;
  return props.source as IRedirectSource;
});

// This is little hacky way of letting users opt out of automatic redirects w/o having to navigate
watch(automaticallyContinue, (a: boolean, b: boolean) => {
  if (!a && b) {
    patchSourceConfig(ComposeCastDb, redirectSource.value.domain, {
      automaticallyContinue: false
    });
  }
});

watch(
  () => model.value,
  async (s: boolean | undefined) => {
    if (!s) return;
    if (!redirectSource.value) return;
    targetUrl.value = (redirectSource.value as IRedirectSource).linkGenerator({
      text: props.text,
      embeds: props.embeds,
    });
    const cfg = await getSourceConfig(ComposeCastDb, redirectSource.value.domain);
    isStarred.value = cfg?.isStarred || false;
    automaticallyContinue.value = cfg?.automaticallyContinue || false;
    if (automaticallyContinue.value && redirectSource.value.isReferred) {
      window.location.href = targetUrl.value;
    }
  },
  { immediate: true }
);

const clickContinue = async () => {
  if (!redirectSource.value) return;
  await patchSourceConfig(ComposeCastDb, redirectSource.value.domain, {
    isStarred: isStarred.value,
    automaticallyContinue: automaticallyContinue.value,
  });
  window.location.href = targetUrl.value;
};
</script>

<style scoped>
.text-h6 >>> .v-label {
  font-size: 1.25rem !important;
}
.v-alert >>> .v-alert__content {
  color: white !important;
}
</style>
