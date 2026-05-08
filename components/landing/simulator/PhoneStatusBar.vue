<script setup lang="ts">
const currentTime = ref('')

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 60000)
})
</script>

<template>
  <div class="status-bar">
    <span class="time">{{ currentTime }}</span>
    <div class="icons">
      <svg viewBox="0 0 24 24" fill="currentColor" class="icon-signal">
        <rect x="1" y="14" width="4" height="8" rx="1" opacity="0.4"/>
        <rect x="7" y="10" width="4" height="12" rx="1" opacity="0.7"/>
        <rect x="13" y="6" width="4" height="16" rx="1"/>
        <rect x="19" y="2" width="4" height="20" rx="1"/>
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor" class="icon-wifi">
        <path d="M12 18c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0-10c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4z"/>
        <path d="M12 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
      </svg>
      <svg viewBox="0 0 24 24" fill="currentColor" class="icon-battery">
        <rect x="2" y="7" width="18" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <rect x="4" y="9" width="12" height="6" rx="1"/>
        <rect x="20" y="10" width="2" height="4" rx="0.5"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 20px;
  background: transparent;
}

.time {
  font-size: 14px;
  font-weight: 600;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
}

.icons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.icon-signal,
.icon-wifi,
.icon-battery {
  width: 16px;
  height: 16px;
  color: white;
}
</style>