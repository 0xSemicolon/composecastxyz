<template>
  <v-responsive class="align-centerfill-height mx-auto pt-8" style="max-width: 900px">
    <v-img class="mb-4 mt-10" height="70" src="/images/farcaster.svg" />

    <div class="text-center">
      <div class="text-body-1 font-weight-light mb-n1">
        {{ topText }}
      </div>

      <h1 class="text-h4 font-weight-bold">Share this cast</h1>
    </div>
    <div class="py-4" />

    <v-row class="px-3">
      <v-col cols="12" class="pb-0">
        <v-card class="py-4" color="transparent" rounded="lg">
          <template #image>
            <v-img position="top right" />
          </template>

          <v-form>
            <v-textarea
              variant="solo"
              prepend-icon="mdi-message-outline"
              placeholder="..."
              class="text-h6"
              rounded
              v-model="text"
              hide-details
              no-resize
            >
            </v-textarea>
            <v-select
              v-if="embeds?.length"
              v-model="embeds"
              prepend-icon="mdi-shape-plus"
              variant="solo"
              placeholder="Embeds"
              rounded
              class="mt-3 text-h6"
              hide-details
            >
              <template v-slot:selection="{ item }">
                <v-chip color="primary">{{ item.title }}</v-chip>
              </template></v-select
            >
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-responsive>

  <v-row class="mt-7 px-3">
    <v-col xs="12" sm="12" md="6" lg="4" xl="3" v-for="(opt, i) in sources" :key="i">
      <v-card
        class="py-4"
        color="surface"
        @click="chooseOption(opt)"
        append-icon="mdi-open-in-new"
        rel="noopener noreferrer"
        rounded="lg"
        :subtitle="`Continue with ${opt.domain}`"
        target="_blank"
        :title="opt.productName"
      >
        <template #prepend>
          <v-avatar>
            <v-img :src="opt.imageUrl"></v-img>
          </v-avatar>
        </template>
      </v-card>
    </v-col>
  </v-row>

  <RedirectSourceDialog
    v-model="isShowingRedirectDialog"
    :text="text"
    :embeds="embeds"
    :source="targetSource"
  ></RedirectSourceDialog>

  <PromptCopySourceDialog
    v-model="isShowingCopyFirstDialog"
    :text="text"
    :embeds="embeds"
    :source="targetSource"
  ></PromptCopySourceDialog>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineModel, watch } from "vue";
import { randomSources, ISource } from "@/sources/index";
import RedirectSourceDialog from "./RedirectSourceDialog.vue";
import PromptCopySourceDialog from "./PromptCopySourceDialog.vue";

const props = defineProps<{ referrerUrl: string | null; preferred: string[] }>();
const text = defineModel<string>("text", { type: String });
const embeds = defineModel<string[]>("embeds", { type: Array });

const topText = computed(() => {
  if (!props.referrerUrl) {
    return "Continue if you want to";
  }
  return `${new URL(props.referrerUrl).host} wants you to`;
});

const sources = computed<ISource[]>(() => {
  return randomSources(props.referrerUrl);
});

const isShowingRedirectDialog = ref(false);
const isShowingCopyFirstDialog = ref(false);
const targetSource = ref<ISource | null>(null);

const chooseOption = (source: ISource) => {
  targetSource.value = source;
  if (source.fulfilmentType === "redirect") {
    isShowingRedirectDialog.value = true;
  } else if (source.fulfilmentType === "promptCopy") {
    isShowingCopyFirstDialog.value = true;
  } else {
    throw new Error("Unsupported fulfillmentType");
  }
};

watch(
  () => props.referrerUrl,
  (url: string | null) => {
    if (!url || !sources.value) return;
    const [first] = sources.value;
    if (
      first.fulfilmentType === "redirect" &&
      props.referrerUrl &&
      first.autoredirectCondition &&
      first.autoredirectCondition({ url: new URL(url) })
    ) {
      chooseOption(first);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.compose-prompt {
  text-wrap: wrap;
}
.text-h6 >>> textarea,
.text-h6 >>> .v-chip {
  font-size: 1.25rem !important;
}
</style>
