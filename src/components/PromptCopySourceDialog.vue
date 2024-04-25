<template>
  <v-dialog v-model="model" :max-width="600" @update:modelValue="wasCopied = false">
    <v-card v-if="model">
      <v-card-title class="text-h4 text-center pt-7 pb-4">
        <v-avatar>
          <v-img :src="promptCopySource.imageUrl"></v-img>
        </v-avatar>
        {{ promptCopySource.productName }}</v-card-title
      >
      <v-card-text>
        <template v-if="hasTemplate">
          <v-alert type="info" variant="text">
            Unfortunately there is no native redirect URL supported in
            {{ promptCopySource.productName }} yet. So to post the following you will have
            to copy and paste the post text first.
          </v-alert>

          <v-alert
            class="text-h6 px-4 py-6 cursor-pointer"
            :icon="wasCopied ? undefined : 'mdi-content-copy'"
            variant="tonal"
            :type="wasCopied ? 'success' : undefined"
            border
            @click="copyPostText()"
          >
            {{ text }}
            <span class="text-primary" v-for="(e, i) in embeds || []" :key="i">
              {{ e }}</span
            >
          </v-alert>
          <v-list-subheader v-if="!wasCopied"
            >^ Copy this text before continuing</v-list-subheader
          >
          <v-list-subheader v-else class="text-success">Copied!</v-list-subheader>
        </template>
        <v-checkbox
          label="Star this as a preferred clients"
          color="orange"
          hide-details
          class="text-h6"
          v-model="isStarred"
        ></v-checkbox>
      </v-card-text>
      <v-card-actions>
        <v-btn
          block
          :color="!hasTemplate || wasCopied ? 'primary' : undefined"
          variant="elevated"
          @click="clickContinue()"
          target="_blank"
          :disabled="hasTemplate && !wasCopied"
        >
          Continue to {{ promptCopySource.domain }}
          <v-icon end>mdi-arrow-right-bold</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { defineModel, defineProps, computed, watch, ref } from "vue";
import { IPromptCopySource } from "@/sources/types";
import ComposeCastDb from "../databases/composeCastDb";
import { patchSourceConfig, getSourceConfig } from "../databases/sourceConfig";

const model = defineModel<boolean>();
const props = defineProps<{
  source: Object | null;
  text: string | undefined;
  embeds: string[] | undefined;
}>();
const targetUrl = ref<string>("");
const wasCopied = ref(false);
const isStarred = ref<boolean>(false);

const hasTemplate = computed<boolean>(() => {
  return !!(props.text || props.embeds?.length);
});

const promptCopySource = computed<IPromptCopySource | null>(() => {
  if (!props.source) return null;
  if (!("fulfilmentType" in props.source)) return null;
  if (props.source.fulfilmentType !== "promptCopy") return null;
  return props.source as IPromptCopySource;
});

const copyPostText = () => {
  wasCopied.value = true;
  navigator.clipboard.writeText(
    `${props.text || ""}${props.embeds?.map((e: string) => ` ${e}`).join("")}`
  );
};

const clickContinue = async () => {
  if (!promptCopySource.value) return;
  await patchSourceConfig(ComposeCastDb, promptCopySource.value.domain, {
    isStarred: isStarred.value,
  });
  window.location.href = targetUrl.value;
};

watch(
  () => model.value,
  async (s: boolean | undefined) => {
    if (!s) return;
    if (!promptCopySource.value) return;
    targetUrl.value = (promptCopySource.value as IPromptCopySource).linkGenerator({
      text: props.text,
      embeds: props.embeds,
    });
    const cfg = await getSourceConfig(ComposeCastDb, promptCopySource.value.domain);
    isStarred.value = cfg?.isStarred || false;
  },
  { immediate: true }
);
</script>

<style scoped>
.text-h6 >>> .v-label {
  font-size: 1.25rem !important;
}
</style>
