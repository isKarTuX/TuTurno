<script setup lang="ts">
interface Props {
  question: string
  answer: string
  isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
})

const emit = defineEmits<{
  toggle: []
}>()

const isOpen = ref(props.isOpen)
const contentRef = ref<HTMLElement | null>(null)

watch(() => props.isOpen, (v) => { isOpen.value = v })

function toggle() {
  isOpen.value = !isOpen.value
  emit('toggle')
}
</script>

<template>
  <div class="border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/[0.12]">
    <button
      type="button"
      class="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
      @click="toggle"
    >
      <span class="font-medium text-white group-hover:text-[--color-primary-light] transition-colors">{{ question }}</span>
      <span
        class="w-8 h-8 shrink-0 rounded-xl bg-white/[0.05] flex items-center justify-center transition-all duration-300 group-hover:bg-[--color-primary]/20"
        :class="isOpen ? 'rotate-180 bg-[--color-primary]/20' : ''"
      >
        <svg class="w-4 h-4 text-[--text-secondary] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </button>

    <div
      ref="contentRef"
      class="overflow-hidden transition-all duration-300 ease-out"
      :style="{ maxHeight: isOpen ? contentRef?.scrollHeight + 'px' : '0px' }"
    >
      <div class="px-6 pb-5 text-[--text-secondary] leading-relaxed text-sm">
        {{ answer }}
      </div>
    </div>
  </div>
</template>