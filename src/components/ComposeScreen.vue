<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto pt-8" max-width="900">
      <v-img class="mb-4 mt-10" height="70" src="/images/farcaster.svg" />

      <div class="text-center">
        <div class="text-body-1 font-weight-light mb-n1">
          {{ topText }}
        </div>

        <h1 class="text-h4 font-weight-bold">Share this cast</h1>
      </div>

      <div class="py-4" />

      <v-row>
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

        <v-col cols="6" v-for="(opt, i) in sources" :key="i">
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
    </v-responsive>
    <v-dialog v-model="isShowingRedirectDialog" :max-width="600">
      <v-card v-if="isShowingRedirectDialog">
        <v-card-title class="text-h4 text-center pt-7 pb-4">
          <v-avatar>
            <v-img :src="targetSource.imageUrl"></v-img>
          </v-avatar>
          {{ targetSource.productName }}</v-card-title
        >
        <v-card-text>

          <v-alert
            class="text-h6 px-4 py-6"
            icon="mdi-format-align-left"
            variant="text"
          >
            {{ text }}
            <span class="text-primary" v-for="(e, i) in embeds || []" :key="i">
              {{ e }}</span
            >
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            color="primary"
            variant="elevated"
            :href="targetUrl"
            target="_blank"
          >
            Continue to {{ targetSource.domain }}
            <v-icon end>mdi-arrow-right-bold</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isShowingCopyFirstDialog" :max-width="600">
      <v-card v-if="isShowingCopyFirstDialog">
        <v-card-title class="text-h4 text-center pt-7 pb-4">
          <v-avatar>
            <v-img :src="targetSource.imageUrl"></v-img>
          </v-avatar>
          {{ targetSource.productName }}</v-card-title
        >
        <v-card-text>
          <v-alert type="info" variant="text">
            Unfortunately there is no native redirect URL supported in this platform yet.
            So to post the following you will have to copy and paste the post text first.
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
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            :color="wasCopied ? 'primary' : undefined"
            variant="elevated"
            :href="targetUrl"
            target="_blank"
            :disabled="!wasCopied"
          >
            Continue to {{ targetSource.domain }}
            <v-icon end>mdi-arrow-right-bold</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineModel, watch } from "vue";
import { randomSources, ISource } from "@/sources/index";

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
const targetUrl = ref<string | null>(null);

const wasCopied = ref(false);
const copyPostText = () => {
  wasCopied.value = true;
  navigator.clipboard.writeText(
    `${text.value || ""}${embeds.value?.map((e: string) => ` ${e}`).join("")}`
  );
};

const chooseOption = (source: ISource) => {
  targetSource.value = source;
  if (source.fulfilmentType === "redirect") {
    isShowingRedirectDialog.value = true;
    targetUrl.value = source.linkGenerator({ text: text.value, embeds: embeds.value });
  } else if (source.fulfilmentType === "promptCopy") {
    isShowingCopyFirstDialog.value = true;
    targetUrl.value = source.linkGenerator({ text: text.value, embeds: embeds.value });
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
